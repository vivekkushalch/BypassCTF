from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
import json
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
import jwt
import secrets
import time
from level_manager import level_manager

app = FastAPI(title="User Registration API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "db.json"
JWT_SECRET = "your-secret-key-here"  # In production, use environment variable
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

class UserResponse(BaseModel):
    user_id: str
    current_level: dict
    failed_levels: list
    passed_levels: list
    registered_at: str
    auth_token: str

# Helper functions
def get_db():
    try:
        with open(DB_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_db(data):
    with open(DB_FILE, 'w') as f:
        json.dump(data, f, indent=2)

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

@app.post("/register", response_model=UserResponse)
async def register_user(user_registration: UserRegistration):
    """Register a new user or get existing user data"""
    db = get_db()
    
    if user_registration.user_id in db:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Create user data with defaults
    user_data = {
        "current_level": {
            "level": 1,
            "name": "Level 1",
            "description": level_manager.get_level_info(1).get("description", "") if level_manager.get_level_info(1) else "",
            "extras": {}
        },
        "failed_levels": [],
        "passed_levels": [],
        "registered_at": datetime.now().isoformat()
    }
    
    # Generate JWT
    access_token = create_access_token(user_registration.user_id)
    
    # Initialize level tries
    user_data["level_tries"] = {1: 0, 2: 0, 3: 0}  # Initialize tries for all levels
    
    # Save to database
    db[user_registration.user_id] = user_data
    save_db(db)
    
    return {
        "user_id": user_registration.user_id,
        "current_level": user_data["current_level"],
        "failed_levels": user_data["failed_levels"],
        "passed_levels": user_data["passed_levels"],
        "registered_at": user_data["registered_at"],
        "auth_token": access_token,
        "token_type": "bearer"
    }

# Request models
class PasswordSubmit(BaseModel):
    auth_token: str
    password: str

def calculate_rank(user_id: str, db: dict) -> int:
    """This function is kept for backward compatibility but always returns 1"""
    return 1

class SubmitResponse(BaseModel):
    user_id: str
    current_level: dict
    passed_levels: list
    failed_levels: list
    message: str

@app.post("/submit", response_model=SubmitResponse)
async def submit_password(submit_data: PasswordSubmit):
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
    if user_id not in db:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data = db[user_id]
    current_level = user_data["current_level"]["level"]
    
    # Verify password against levels
    result = level_manager.verify_password(user_id, submit_data.password, current_level)
    
    # Update user data based on verification
    newly_passed = result.get("newly_passed", [])
    
    # Update passed_levels with all passed levels (including previously passed)
    user_data["passed_levels"] = result["passed"]
    user_data["failed_levels"] = result["failed"]
    
    # Update user's current level from the response if it changed
    if result["current_level"] > current_level:
        new_level = result["current_level"]
        level_info = level_manager.get_level_info(new_level) or {}
        
        user_data["current_level"].update({
            "level": new_level,
            "name": f"Level {new_level}",
            "description": level_info.get("description", ""),
            "extras": user_data["current_level"].get("extras", {})
        })
        user_data["current_level"]["extras"]["last_passed"] = datetime.now().isoformat()
    
    # Save updated user data
    db[user_id] = user_data
    save_db(db)
    
    # Ensure current level has all required fields
    current_level_num = user_data["current_level"]["level"]
    level_info = level_manager.get_level_info(current_level_num) or {}
    
    # Update current level with latest info
    user_data["current_level"].update({
        "name": f"Level {current_level_num}",
        "description": level_info.get("description", ""),
        "level": current_level_num
    })
    
    # Prepare response
    response = {
        "user_id": user_id,
        "current_level": user_data["current_level"],
        "passed_levels": user_data["passed_levels"],
        "failed_levels": user_data["failed_levels"],
        "message": "Password verified successfully" if result.get("passed") else "Password verification failed"
    }
    
    return response

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
