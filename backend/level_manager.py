"""
Level Manager Module

This module provides a class to manage password validation across different levels.
It dynamically imports level validators and provides methods to verify passwords.
"""
import importlib
import os
import json
from typing import Dict, List, Optional, Any, cast

from user_scorecard import scorecard_manager
from levels.base_level import BaseLevel

class LevelManager:
    def __init__(self):
        """Initialize the LevelManager and load all available level validators."""
        self.levels: Dict[int, BaseLevel] = {}
        self._load_validators()
        
        # Load user data file path
        self.db_path = os.path.join(os.path.dirname(__file__), 'db.json')
        self._ensure_db_exists()
        
    def _ensure_db_exists(self) -> None:
        """Ensure the database file exists with proper structure."""
        if not os.path.exists(self.db_path):
            with open(self.db_path, 'w') as f:
                json.dump({}, f)
                
    def _get_user_data(self, user_id: str) -> Dict[str, Any]:
        """Get user data from the database."""
        try:
            with open(self.db_path, 'r') as f:
                db = json.load(f)
                return db.get(user_id, {})
        except (FileNotFoundError, json.JSONDecodeError):
            return {}
            
    def _save_user_data(self, user_id: str, data: Dict[str, Any]) -> None:
        """Save user data to the database."""
        try:
            with open(self.db_path, 'r+') as f:
                try:
                    db = json.load(f)
                except json.JSONDecodeError:
                    db = {}
                db[user_id] = data
                f.seek(0)
                json.dump(db, f, indent=2)
                f.truncate()
        except FileNotFoundError:
            with open(self.db_path, 'w') as f:
                json.dump({user_id: data}, f, indent=2)
    
    def _load_validators(self) -> None:
        """Dynamically load all level validators from the levels directory."""
        levels_dir = os.path.join(os.path.dirname(__file__), 'levels')
        if not os.path.exists(levels_dir):
            raise FileNotFoundError("Levels directory not found")
        
        for filename in os.listdir(levels_dir):
            if filename.startswith('level_') and filename.endswith('.py') and filename != 'base_level.py':
                try:
                    level_num = int(filename[6:-3])  # Extract number from 'level_X.py'
                    module_name = f"levels.level_{level_num}"
                    module = importlib.import_module(module_name)
                    level_instance = getattr(module, 'level', None)
                    if level_instance and isinstance(level_instance, BaseLevel):
                        self.levels[level_num] = level_instance
                    else:
                        print(f"Warning: {filename} does not export a valid level instance")
                except (ValueError, ImportError, AttributeError) as e:
                    print(f"Warning: Failed to load validator for {filename}: {e}")
    
    def verify_password(self, user_id: str, password: str, current_level: int) -> dict:
        """Verify a password against all levels up to the current level.
        
        Args:
            user_id: Unique identifier for the user
            password: The password to verify
            current_level: The user's current level
            
        Returns:
            dict: Dictionary containing verification results and score information
        """
        passed_levels = []
        failed_levels = []
        score_updates = []
        new_current_level = current_level  # Track if current level should be updated
        
        # Get user data and initialize level states if needed
        user_data = self._get_user_data(user_id)
        if 'level_states' not in user_data:
            user_data['level_states'] = {}
        
        # Get or create user's scorecard
        scorecard = scorecard_manager.get_scorecard(user_id, total_levels=len(self.levels))
        
            # Get all accessible levels (previously passed + current level)
        accessible_levels = set(range(1, current_level + 1))
        
        # Add any previously passed levels beyond current_level
        for entry in scorecard:
            if entry.get("completed_at") is not None:
                accessible_levels.add(entry["level"])
        
        # Sort the levels to process them in order
        for level_num in sorted(accessible_levels):
            if level_num not in self.levels:
                continue
                
            level = self.levels[level_num]
            
            # Get current level stats
            level_stats = next((entry for entry in scorecard if entry["level"] == level_num), None)
            if not level_stats:
                continue
                
            # Skip validation for already completed levels
            if level_stats["completed_at"] is not None:
                # If level is already completed, ensure it's in passed_levels
                if level_num not in passed_levels:
                    passed_levels.append(level_num)
                continue
                
            # Get or initialize level state
            if str(level_num) not in user_data['level_states']:
                level_data = level.start()
                user_data['level_states'][str(level_num)] = level_data['level_state']
                self._save_user_data(user_id, user_data)
            
            level_state = user_data['level_states'][str(level_num)]
            
            # Record the attempt
            scorecard_manager.record_attempt(user_id, level_num)
            
            try:
                # Validate the password with level state
                if level.is_valid(password, level_state):
                    passed_levels.append(level_num)
                    
                    # Update level state if needed
                    if level_state:
                        user_data['level_states'][str(level_num)] = level_state
                        self._save_user_data(user_id, user_data)
                    
                    # Only update score and completion if not already completed
                    if level_stats["completed_at"] is None:
                        score = self.calculate_score(level_num, level_stats["tries"] + 1)
                        completed_at = datetime.now().isoformat()
                        scorecard_manager.complete_level(user_id, level_num, score, completed_at)
                        
                        # If this was the current level, update new_current_level
                        if level_num == current_level:
                            new_current_level = current_level + 1
                        
                        score_updates.append({
                            'level': level_num,
                            'score': score,
                            'tries': level_stats["tries"] + 1,
                            'completed': True,
                            'completed_at': completed_at
                        })
                    # If already completed, just add to passed_levels without updating score
                    elif level_num not in passed_levels:
                        passed_levels.append(level_num)
                else:
                    failed_levels.append(level_num)
            except Exception as e:
                print(f"Error validating level {level_num}: {e}")
                failed_levels.append(level_num)
        
        # Get the current scorecard state for response
        scorecard_data = scorecard_manager.get_all_scores(user_id)
        
        # Get all passed levels from the scorecard
        all_passed = [
            entry["level"] 
            for entry in scorecard_data 
            if entry.get("completed_at") is not None
        ]
        
        # Get newly passed levels from this attempt
        newly_passed = [
            level for level in passed_levels 
            if level not in all_passed
        ]
        
        # Update all_passed with newly passed levels
        all_passed.extend(newly_passed)
        all_passed = sorted(list(set(all_passed)))  # Remove duplicates and sort
        
        return {
            'passed': all_passed,  # All levels that are passed (including previously passed)
            'newly_passed': newly_passed,  # Only levels passed in this attempt
            'failed': failed_levels,  # Levels that failed in this attempt
            'current_level': new_current_level,  # Updated current level if level was completed
            'score_updates': score_updates,
            'scorecard': scorecard_data
        }

    def get_level_info(self, level_num: int) -> Optional[Dict[str, Any]]:
        """Get information about a specific level.
        
        Args:
            level_num: The level number to get info for
            
        Returns:
            Dict containing level information or None if level doesn't exist
        """
        if level_num not in self.levels:
            return None
            
        level = self.levels[level_num]
        level_data = level.start()
        
        return {
            'level_id': level_data['level_id'],
            'description': level_data['level_desc'],
            'has_state': bool(level_data['level_state'])
        }
        
    def get_user_level_state(self, user_id: str, level_num: int) -> Dict[str, Any]:
        """Get the current state for a user's level.
        
        Args:
            user_id: The user's ID
            level_num: The level number to get state for
            
        Returns:
            Dict containing the level state
        """
        user_data = self._get_user_data(user_id)
        return user_data.get('level_states', {}).get(str(level_num), {})
        
    def reset_user_level(self, user_id: str, level_num: int) -> bool:
        """Reset a user's progress on a specific level.
        
        Args:
            user_id: The user's ID
            level_num: The level number to reset
            
        Returns:
            bool: True if reset was successful, False otherwise
        """
        user_data = self._get_user_data(user_id)
        if 'level_states' in user_data and str(level_num) in user_data['level_states']:
            del user_data['level_states'][str(level_num)]
            self._save_user_data(user_id, user_data)
            return True
        return False
    
    def calculate_score(self, level: int, tries: int) -> float:
        """Calculate a score based on level and number of tries.
        
        The score is calculated as follows:
        - Base score: 1000 points per level (higher levels are worth more)
        - Try penalty: 50 points per attempt after the first one
        - Minimum score: 100 points
        
        Args:
            level: The level being attempted
            tries: Number of tries for this level
            
        Returns:
            float: Calculated score (higher is better)
        """
        base_score = level * 1000  # Higher levels are worth more
        try_penalty = max(0, (tries - 1) * 50)  # Penalty for multiple attempts
        return max(100, base_score - try_penalty)  # Minimum score of 100 

# Singleton instance
level_manager = LevelManager()
