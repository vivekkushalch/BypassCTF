from fastapi import FastAPI, HTTPException, Depends, status, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
import json
import os
from typing import Optional, Dict, Any, List, Tuple
from pydantic import BaseModel, Field
import jwt
import secrets
import time
import operator
import os
from level_manager import level_manager
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from api_analytics.fastapi import Analytics

# Initialize rate limiter
limiter = Limiter(
    key_func=get_remote_address,  # Rate limit by IP address
    default_limits=["100/minute"],  # Default rate limit
)

# Initialize FastAPI with rate limiting
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add rate limiting middleware
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(Analytics, api_key=os.getenv("API_DASH"))

# Database configuration
DB_FILE = "./db.json"
# Update FastAPI app config with docs and redoc disabled
app.title = "User Registration API"
app.docs_url = None  # Disable /docs
app.redoc_url = None  # Disable /redoc

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "db.json"
# Read JWT secret from environment variable with a default value for development
JWT_SECRET = os.getenv("JWT_SEC", "your-secret-key-here")
JWT_ALGORITHM = "HS256"

# JWT Token model
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None

# Pydantic models
class UserRegistration(BaseModel):
    user_id: str

class LeaderboardUser(BaseModel):
    user_id: str
    rank: int
    score: float = Field(..., description="Total score based on levels completed and performance")
    current_level: int

class LeaderboardResponse(BaseModel):
    leaderboard: List[LeaderboardUser]
    last_updated: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class UserResponse(BaseModel):
    user_id: str
    current_level: dict
    failed_levels: list
    passed_levels: list
    registered_at: str
    auth_token: str  # This is generated on the fly, not stored

# Helper functions
def get_db():
    """Get the database content with proper structure."""
    try:
        with open(DB_FILE, 'r') as f:
            db = json.load(f)
            # Ensure proper structure
            if not isinstance(db, dict):
                db = {'_global': {'levels': {}}, 'users': {}}
            if '_global' not in db or not isinstance(db['_global'], dict):
                db['_global'] = {'levels': {}}
            if 'users' not in db or not isinstance(db['users'], dict):
                db['users'] = {}
            return db
    except (FileNotFoundError, json.JSONDecodeError):
        return {'_global': {'levels': {}}, 'users': {}}

def save_db(data):
    """Save the database with proper structure."""
    # Ensure proper structure
    if not isinstance(data, dict):
        data = {'_global': {'levels': {}}, 'users': {}}
    if '_global' not in data or not isinstance(data['_global'], dict):
        data['_global'] = {'levels': {}}
    if 'users' not in data or not isinstance(data['users'], dict):
        data['users'] = {}
        
    # Ensure the directory exists
    db_dir = os.path.dirname(DB_FILE) or '.'
    if db_dir:  # Only create directory if a path is specified
        os.makedirs(db_dir, exist_ok=True)
    
    # Write to a temporary file first, then rename (atomic write)
    temp_path = f"{DB_FILE}.tmp"
    with open(temp_path, 'w') as f:
        json.dump(data, f, indent=2)
        
    # On Windows, we need to remove the destination file first
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)
    os.rename(temp_path, DB_FILE)

def create_access_token(user_id: str) -> str:
    """Create JWT token with user_id"""
    expires_delta = timedelta(days=7)
    expire = datetime.utcnow() + expires_delta
    to_encode = {"sub": user_id, "exp": expire}
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token: str) -> Dict[str, Any]:
    """Verify JWT token and return payload"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.get("/")
async def home():
    """Home endpoint"""
    return {"message": "Welcome to the User Registration API"}

@app.get("/docs")
@limiter.limit("10/minute")
async def custom_docs(request: Request):
    """Custom docs endpoint with a secret message"""
    return {"message": "bro we know this page will be available at the right time ;) =V07="}

@app.get("/leaderboard", response_model=LeaderboardResponse)
@limiter.limit("60/minute")
async def get_leaderboard(
    request: Request,  # Required for rate limiting
    limit: int = 100,
    offset: int = 0
):
    """
    Get the global leaderboard
    
    Args:
        limit: Maximum number of entries to return (max 100)
        offset: Number of entries to skip (for pagination)
        
    Returns:
        Object containing leaderboard array and last_updated timestamp
    """
    limit = max(1, min(limit, 1000))  # Ensure limit is between 1 and 100
    db = get_db()
    
    # Calculate ranks and get full leaderboard
    _, leaderboard = calculate_rank("", db)
    
    # Convert to new format without last_updated in user entries
    # current_level is already adjusted in calculate_rank
    leaderboard_users = [
        {
            'user_id': entry['user_id'],
            'rank': entry['rank'],
            'score': entry['score'],
            'current_level': entry['current_level']  # Already adjusted to n-1 in calculate_rank
        }
        for entry in leaderboard[offset:offset + limit]
    ]
    
    return {
        'leaderboard': leaderboard_users,
        'last_updated': datetime.utcnow().isoformat()
    }

@app.get("/leaderboard/{user_id}", response_model=LeaderboardUser)
async def get_user_rank(user_id: str):
    """
    Get a specific user's rank and leaderboard information
    """
    db = get_db()
    
    if user_id not in db.get('users', {}):
        raise HTTPException(status_code=404, detail="User not found")
    
    rank, leaderboard = calculate_rank(user_id, db)
    user_entry = next((entry for entry in leaderboard if entry['user_id'] == user_id), None)
    
    if not user_entry:
        raise HTTPException(status_code=404, detail="User not found in leaderboard")
        
    return user_entry

@app.post("/register", response_model=UserResponse, responses={
    400: {"description": "User already exists"},
    429: {"description": "Too Many Requests"}
})
@limiter.limit("3/minute")
async def register_user(
    request: Request,  # Required for rate limiting
    user_registration: UserRegistration
):
    """Register a new user"""
    db = get_db()
    
    # Check if user already exists
    if user_registration.user_id in db['users']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )
    
    # Create new user
    user_data = {
        "current_level": 1,
        "level_states": {},
        "passed_levels": [],
        "failed_levels": [],
        "registered_at": datetime.utcnow().isoformat(),
        "initialized": True
    }
    
    # Save the new user without auth token
    db['users'][user_registration.user_id] = user_data
    save_db(db)
    
    # Generate a new auth token for the response
    auth_token = create_access_token(user_registration.user_id)
    
    # Create response with user data and auth token
    return UserResponse(
        user_id=user_registration.user_id,
        current_level={
            "level": 1,
            "name": "Level 1",
            "description": "",
            "extras": {}
        },
        failed_levels=[],
        passed_levels=[],
        registered_at=user_data["registered_at"],
        auth_token=auth_token
    )

# Request models
class PasswordSubmit(BaseModel):
    auth_token: str
    password: str

def calculate_rank(user_id: str, db: dict) -> Tuple[int, List[dict]]:
    """
    Calculate ranks for all users based on their scores.
    Returns the rank of the specified user and the full leaderboard.
    """
    # Get all users with their scores
    leaderboard = []
    for uid, user_data in db.get('users', {}).items():
        if not isinstance(user_data, dict):
            continue
            
        try:
            # Calculate score based on passed levels and current level
            passed_levels = user_data.get('passed_levels', [])
            current_level = user_data.get('current_level', 1)  # Default to level 1 if not set
            
            # Ensure passed_levels is a list of integers
            if not isinstance(passed_levels, list):
                passed_levels = []
                
            # Ensure current_level is an integer
            try:
                current_level = int(current_level)
            except (ValueError, TypeError):
                current_level = 1
            
            # Simple scoring: 100 points per level completed + 10 points per level in current level
            score = (len(passed_levels) * 100) + (current_level * 10)
            
            leaderboard.append({
                'user_id': uid,
                'score': score,
                'current_level': current_level,
                'last_updated': user_data.get('registered_at', datetime.utcnow().isoformat())
            })
        except Exception as e:
            print(f"Error calculating score for user {uid}: {e}")
            continue
    
    # Sort by score (descending) and then by last_updated (ascending for tiebreaker)
    leaderboard.sort(key=lambda x: (-x['score'], x['last_updated']))
    
    # Assign ranks
    for i, entry in enumerate(leaderboard, 1):
        entry['rank'] = i
    
    # Find the user's rank
    user_rank = next((entry['rank'] for entry in leaderboard if entry['user_id'] == user_id), None)
    
    # Create a copy of leaderboard with current_level as n-1 for consistent display
    display_leaderboard = []
    for entry in leaderboard:
        entry_copy = entry.copy()
        entry_copy['current_level'] = max(0, entry_copy['current_level'] - 1)  # Show as n-1, min 0
        display_leaderboard.append(entry_copy)
    
    return user_rank or len(leaderboard) + 1, display_leaderboard

class SubmitResponse(BaseModel):
    user_id: str
    current_level: dict
    passed_levels: list
    failed_levels: list
    message: str

@app.post("/submit", response_model=SubmitResponse)
@limiter.limit("70/minute")
async def submit_password(
    request: Request,  # Required for rate limiting
    submit_data: PasswordSubmit
):
    """
    Submit a password for the current level.
    
    - Verifies the JWT token
    - Validates the password against current level
    - Updates user progress
    - Returns user data with level information
    """
    # Verify token
    try:
        payload = verify_token(submit_data.auth_token)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=400, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    # Get user data
    db = get_db()
    if user_id not in db.get('users', {}):
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = db['users'][user_id]
    current_level = user_data.get("current_level", 1)
    
    # Ensure current_level is an integer
    try:
        current_level = int(current_level)
    except (ValueError, TypeError):
        current_level = 1
        user_data["current_level"] = current_level
    
    # Verify password against levels
    try:
        result = level_manager.verify_password(user_id, submit_data.password, current_level)
    except Exception as e:
        print(f"Error verifying password: {e}")
        raise HTTPException(status_code=500, detail="Error verifying password")
    
    # Update user data based on verification
    try:
        # Ensure passed_levels is a list of integers
        if 'passed_levels' not in user_data or not isinstance(user_data['passed_levels'], list):
            user_data['passed_levels'] = []
        
        # Get the list of passed levels from the result
        passed_levels = result.get('passed', [])
        is_current_level_passed = any(level.get('level') == current_level for level in passed_levels)
        
        # Update passed levels if needed
        if is_current_level_passed:
            if current_level not in user_data["passed_levels"]:
                user_data["passed_levels"].append(current_level)
        else:
            # Initialize failed_levels if not present
            if 'failed_levels' not in user_data or not isinstance(user_data['failed_levels'], list):
                user_data['failed_levels'] = []
            
            # Store only the level number in the database if not already passed
            if current_level not in user_data.get('passed_levels', []) and current_level not in user_data['failed_levels']:
                user_data['failed_levels'].append(current_level)
                print(f"Added level {current_level} to failed_levels for user {user_id}")
        
        # Update user's current level if they passed
        if is_current_level_passed:
            new_level = current_level + 1
            max_level = level_manager.get_max_level() or 1
            if new_level > max_level:
                new_level = max_level
            
            if new_level > current_level:
                user_data["current_level"] = new_level
                current_level = new_level
        
        # Update last updated timestamp
        user_data["last_updated"] = datetime.utcnow().isoformat()
        
        # Save updated user data
        db['users'][user_id] = user_data
        save_db(db)
        
    except Exception as e:
        print(f"Error updating user data: {e}")
        raise HTTPException(status_code=500, detail="Error updating user progress")
    
    # Prepare response using the validation results directly
    try:
        # Get the current level number from the validation results
        current_level_num = result.get('current_level', current_level)
        
        # Get the current level's full information
        current_level_info = level_manager.get_level_info(current_level_num) or {}
        
        # Prepare the current level response with full information
        current_level_response = {
            "level": current_level_num,
            "name": current_level_info.get('name', f"Level {current_level_num}"),
            "description": current_level_info.get('description', ""),
            "extras": current_level_info.get('extras', {})
        }
        
        # Use the passed and failed levels directly from the validation results
        passed_levels_info = result.get('passed', [])
        failed_levels_info = result.get('failed', [])
        
        # Prepare the response with the validation results
        response = {
            "user_id": user_id,
            "current_level": current_level_response,
            "passed_levels": passed_levels_info,
            "failed_levels": failed_levels_info,
            "message": "Password verified successfully" if is_current_level_passed else "Password verification failed"
        }
        
        # Log the prepared response for debugging
        print(f"Prepared response: {response}")
        return response
        
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Error preparing response: {e}\n{error_trace}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error preparing response: {str(e)}"
        )

@app.get("/exportdb")
@limiter.limit("10/minute")  # Additional rate limiting for exportdb
async def export_database(
    request: Request,  # Required for rate limiting
    password: str = Query(..., description="Password to access the database")
):
    """
    Export the database as JSON.
    
    Args:
        password: The password to authenticate the request (must match DB_PWD environment variable)
        
    Returns:
        dict: The database content if authentication is successful
        
    Raises:
        HTTPException: If authentication fails
    """
    # Get the password from environment variable
    db_password = os.getenv("DB_PWD")
    
    # Check if password is set and matches
    if not db_password:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database export is not configured"
        )
    
    if password != db_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Query"},
        )
    
    # Return the database content
    try:
        with open(DB_FILE, 'r') as f:
            db_content = json.load(f)
        return db_content
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read database: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
