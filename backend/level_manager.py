"""
Level Manager Module

This module provides a class to manage password validation across different levels.
It dynamically imports level validators and provides methods to verify passwords.
"""
import importlib
import os
import json
from typing import Dict, List, Optional, Any, cast
from datetime import datetime

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
    
    def verify_password(self, user_id: str, password: str, current_level: int) -> Dict[str, Any]:
        """Verify a password against all levels up to the current level.
        
        Args:
            user_id: Unique identifier for the user
            password: The password to verify
            current_level: The user's current level
            
        Returns:
            dict: Dictionary containing verification results
        """
        passed_levels = []
        failed_levels = []
        new_current_level = current_level  # Initialize with current level
        
        # Ensure user data is loaded
        user_data = self._get_user_data(user_id)
        if 'level_states' not in user_data:
            user_data['level_states'] = {}
            self._save_user_data(user_id, user_data)
        
        # Track all accessible levels (previously passed + current level)
        accessible_levels = set(range(1, current_level + 1))
        
        # Add any previously passed levels beyond current_level
        if 'passed_levels' in user_data:
            for level in user_data['passed_levels']:
                if isinstance(level, dict):
                    level_num = level.get('level')
                else:
                    level_num = level
                if level_num is not None:
                    accessible_levels.add(int(level_num))
        
        # Sort the levels to process them in order
        for level_num in sorted(accessible_levels):
            if level_num not in self.levels:
                continue
                
            level = self.levels[level_num]
            
            # Skip validation for already completed levels
            if any(lvl.get('level') == level_num for lvl in user_data.get('passed_levels', [])):
                passed_levels.append({
                    'level': level_num,
                    'name': f'Level {level_num}',
                    'description': level.level_desc if hasattr(level, 'level_desc') else ''
                })
                continue
                
            # Get or initialize level state
            if str(level_num) not in user_data['level_states']:
                level_data = level.start()
                if level_data is None:
                    level_data = {}
                user_data['level_states'][str(level_num)] = level_data.get('level_state', {})
                self._save_user_data(user_id, user_data)
            
            level_state = user_data['level_states'].get(str(level_num), {})
            
            try:
                # Validate the password with level state
                if level.is_valid(password, level_state):
                    passed_levels.append({
                        'level': level_num,
                        'name': f'Level {level_num}',
                        'description': level.level_desc if hasattr(level, 'level_desc') else ''
                    })
                    
                    # If this was the current level, update new_current_level
                    if level_num == current_level:
                        new_current_level = current_level + 1
                    
                    # Update level state if needed
                    if level_state:
                        user_data['level_states'][str(level_num)] = level_state
                        self._save_user_data(user_id, user_data)
                else:
                    # Only add to failed_levels if not already passed
                    if not any(lvl.get('level') == level_num for lvl in user_data.get('passed_levels', [])):
                        failed_levels.append({
                            'level': level_num,
                            'name': f'Level {level_num}',
                            'description': level.level_desc if hasattr(level, 'level_desc') else ''
                        })
            except Exception as e:
                print(f"Error validating level {level_num}: {e}")
                # Only add to failed_levels if not already passed
                if not any(lvl.get('level') == level_num for lvl in user_data.get('passed_levels', [])):
                    failed_levels.append({
                        'level': level_num,
                        'name': f'Level {level_num}',
                        'description': level.level_desc if hasattr(level, 'level_desc') else ''
                    })
        
        # Get newly passed levels from this attempt
        newly_passed = [
            level for level in passed_levels 
            if not any(lvl.get('level') == level['level'] for lvl in user_data.get('passed_levels', []))
        ]
        
        # Ensure all passed levels are included (both previously and newly passed)
        all_passed = user_data.get('passed_levels', []).copy()
        for level in passed_levels:
            if not any(lvl.get('level') == level['level'] for lvl in all_passed):
                all_passed.append(level)
        
        # Ensure all passed levels have the correct format
        formatted_passed = []
        for level in all_passed:
            if isinstance(level, dict):
                formatted_passed.append({
                    'level': level.get('level'),
                    'name': level.get('name', f'Level {level.get("level")}'),
                    'description': level.get('description', '')
                })
            else:
                level_num = int(level) if str(level).isdigit() else 0
                level_info = self.get_level_info(level_num) or {}
                formatted_passed.append({
                    'level': level_num,
                    'name': f'Level {level_num}',
                    'description': level_info.get('description', '')
                })
        
        # Sort by level number
        all_passed = sorted(formatted_passed, key=lambda x: x['level'])
        
        # For backward compatibility, also maintain a list of just level numbers
        all_passed_levels = [level['level'] for level in all_passed]
        
        # Ensure failed_levels is an array of level objects
        failed_levels = [
            level if isinstance(level, dict) else {
                'level': level,
                'name': f'Level {level}',
                'description': self.get_level_info(level).get('description', '') if level in self.levels else ''
            }
            for level in failed_levels
        ]
        
        return {
            'passed': all_passed,  # All levels that are passed (including previously passed) as level objects
            'passed_levels': all_passed_levels,  # For backward compatibility - list of level numbers
            'newly_passed': newly_passed,  # Only levels passed in this attempt as level objects
            'failed': failed_levels,  # Levels that failed in this attempt as level objects
            'current_level': new_current_level,  # Updated current level if level was completed
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
        
        # Safely get level description, defaulting to empty string if not found
        level_desc = ''
        if hasattr(level, 'level_desc'):
            level_desc = level.level_desc
        elif isinstance(level_data, dict) and 'level_desc' in level_data:
            level_desc = level_data['level_desc']
        
        # Build the response with safe attribute access
        result = {
            'level': level_num,
            'name': f'Level {level_num}',
            'description': level_desc,
            'has_state': bool(level_data.get('level_state')) if isinstance(level_data, dict) else False
        }
        
        # Add level_id if it exists
        if hasattr(level, 'level_id'):
            result['level_id'] = level.level_id
        elif isinstance(level_data, dict) and 'level_id' in level_data:
            result['level_id'] = level_data['level_id']
            
        return result
        
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
        """This method is kept for backward compatibility but always returns 0.
        
        Args:
            level: The level being attempted
            tries: Number of tries for this level
            
        Returns:
            float: Always returns 0 as scoring is disabled
        """
        return 0.0 

# Singleton instance
level_manager = LevelManager()
