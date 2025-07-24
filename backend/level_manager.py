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
        # Initialize database path first
        self.db_path = os.path.join(os.path.dirname(__file__), 'db.json')
        self._ensure_db_exists()
        
        # Then load levels and validators
        self.levels: Dict[int, BaseLevel] = {}
        self._load_validators()
        
    def _ensure_db_exists(self) -> None:
        """Ensure the database file exists with proper structure."""
        if not os.path.exists(self.db_path):
            with open(self.db_path, 'w') as f:
                json.dump({
                    '_global': {
                        'levels': {}
                    },
                    'users': {}
                }, f, indent=2)
        else:
            # Ensure the database has the correct structure
            try:
                with open(self.db_path, 'r+') as f:
                    try:
                        db = json.load(f)
                        updated = False
                        
                        # Add _global.levels if it doesn't exist
                        if '_global' not in db:
                            db['_global'] = {'levels': {}}
                            updated = True
                        elif 'levels' not in db['_global']:
                            db['_global']['levels'] = {}
                            updated = True
                            
                        # Ensure users object exists
                        if 'users' not in db:
                            db['users'] = {}
                            updated = True
                        
                        # Migrate old users to the new structure if needed
                        if not isinstance(db.get('users'), dict):
                            db['users'] = {}
                            updated = True
                            
                        # Move any top-level users into the users object
                        for key in list(db.keys()):
                            if key not in ['_global', 'users'] and isinstance(db[key], dict):
                                if 'current_level' in db[key]:  # Likely a user
                                    db['users'][key] = db[key]
                                    del db[key]
                                    updated = True
                            
                        # Save back if updated
                        if updated:
                            f.seek(0)
                            json.dump(db, f, indent=2)
                            f.truncate()
                            
                    except json.JSONDecodeError:
                        # If file is corrupted, recreate it
                        db = {
                            '_global': {
                                'levels': {}
                            },
                            'users': {}
                        }
                        f.seek(0)
                        json.dump(db, f, indent=2)
                        f.truncate()
            except Exception as e:
                print(f"Error ensuring database structure: {e}")
                # If we can't read/write, create a new file
                with open(self.db_path, 'w') as f:
                    json.dump({
                        '_global': {
                            'levels': {}
                        },
                        'users': {}
                    }, f, indent=2)
                
    def _get_user_data(self, user_id: str) -> Dict[str, Any]:
        """Get user data from the database."""
        if not os.path.exists(self.db_path):
            self._ensure_db_exists()
            
        try:
            with open(self.db_path, 'r') as f:
                db = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            db = {'users': {}}
            
        # Ensure users object exists and is a dictionary
        if 'users' not in db or not isinstance(db['users'], dict):
            db['users'] = {}
            
        # Initialize user data if it doesn't exist
        if user_id not in db['users'] or not isinstance(db['users'][user_id], dict):
            db['users'][user_id] = {
                'current_level': 1,
                'passed_levels': [],
                'failed_levels': [],
                'level_states': {},
                'previous_passed_levels': [],
                'initialized': True
            }
            self._save_db(db)
                
        return db['users'][user_id]

    def _get_global_data(self) -> Dict[str, Any]:
        """Get global data from the database."""
        try:
            with open(self.db_path, 'r') as f:
                db = json.load(f)
                # Ensure _global exists and has the correct structure
                if '_global' not in db or not isinstance(db['_global'], dict):
                    db['_global'] = {'levels': {}}
                    self._save_db(db)
                return db['_global']
        except (FileNotFoundError, json.JSONDecodeError):
            return {'levels': {}}
            
    def get_max_level(self) -> int:
        """
        Get the maximum level number that exists in the system.
        
        Returns:
            int: The highest level number available, or 0 if no levels exist.
        """
        if not self.levels:
            return 0
        return max(self.levels.keys()) if self.levels else 0
            
    def _load_db(self) -> Dict[str, Any]:
        """Load the entire database from disk."""
        if not os.path.exists(self.db_path):
            return {'_global': {'levels': {}}, 'users': {}}
            
        try:
            with open(self.db_path, 'r') as f:
                db = json.load(f)
                # Ensure basic structure
                if not isinstance(db, dict):
                    return {'_global': {'levels': {}}, 'users': {}}
                return db
        except (json.JSONDecodeError, FileNotFoundError):
            return {'_global': {'levels': {}}, 'users': {}}
            
    def _save_db(self, db: Dict[str, Any]) -> None:
        """Save the entire database to disk."""
        # Ensure the directory exists
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        
        # Write to a temporary file first, then rename (atomic write)
        temp_path = f"{self.db_path}.tmp"
        with open(temp_path, 'w') as f:
            json.dump(db, f, indent=2)
            
        # On Windows, we need to remove the destination file first
        if os.path.exists(self.db_path):
            os.remove(self.db_path)
        os.rename(temp_path, self.db_path)
    
    def _save_global_data(self, data: Dict[str, Any]) -> None:
        """Save global data to the database.
        
        Args:
            data: The global data to save, must include 'levels' key
        """
        try:
            db = self._load_db()
            if '_global' not in db or not isinstance(db['_global'], dict):
                db['_global'] = {'levels': {}}
            
            # Ensure levels data is properly structured
            if 'levels' not in data or not isinstance(data['levels'], dict):
                data['levels'] = {}
            
            # Preserve existing global data while updating levels
            db['_global'].update(data)
            
            # Ensure levels is a dictionary with string keys
            if not isinstance(db['_global']['levels'], dict):
                db['_global']['levels'] = {}
                
            self._save_db(db)
            print("Successfully saved global levels to database")
        except Exception as e:
            print(f"Error saving global data: {e}")
            raise
    
    def _save_user_data(self, user_id: str, data: Dict[str, Any]) -> None:
        """Save user data to the database."""
        try:
            # Read existing data or initialize new database
            db = self._load_db()
            
            # Ensure users object exists and is a dictionary
            if 'users' not in db or not isinstance(db['users'], dict):
                db['users'] = {}
                
            # Update user data
            db['users'][user_id] = data
            
            # Write back to file
            self._save_db(db)
                
        except Exception as e:
            print(f"Error saving user data: {e}")
            # Try to create a fresh database if something went wrong
            with open(self.db_path, 'w') as f:
                json.dump({
                    '_global': {'levels': {}},
                    'users': {user_id: data}
                }, f, indent=2)
    
    def _load_validators(self) -> None:
        """Dynamically load all level validators from the levels directory and update global levels.
        
        This method:
        1. Scans the levels directory for level modules
        2. Loads each level validator
        3. Updates the global levels in the database
        4. Ensures all levels are properly registered
        """
        print("\n--- Loading level validators ---")
        levels_dir = os.path.join(os.path.dirname(__file__), 'levels')
        print(f"Looking for levels in: {levels_dir}")
        
        if not os.path.exists(levels_dir):
            raise FileNotFoundError(f"Levels directory not found at: {levels_dir}")
        
        # Get existing global data to preserve any custom level info
        global_data = self._get_global_data()
        if 'levels' not in global_data or not isinstance(global_data['levels'], dict):
            global_data['levels'] = {}
            
        updated_levels = global_data['levels'].copy()
        
        # List all files in the levels directory
        try:
            files = [f for f in os.listdir(levels_dir) 
                    if os.path.isfile(os.path.join(levels_dir, f))]
            print(f"Found {len(files)} files in levels directory")
        except Exception as e:
            print(f"Error reading levels directory: {e}")
            files = []
        
        # Track which levels we've processed
        processed_levels = set()
        
        for filename in sorted(files):  # Sort for consistent processing
            if not (filename.startswith('level_') and filename.endswith('.py')):
                continue
                
            if filename == 'base_level.py':
                continue
                
            try:
                # Extract level number from filename (level_X.py -> X)
                level_num = int(filename[6:-3])
                processed_levels.add(level_num)
                
                module_name = f"levels.level_{level_num}"
                print(f"\nLoading level {level_num} from {filename}")
                
                # Import the level module
                try:
                    module = importlib.import_module(module_name)
                    level_instance = getattr(module, 'level', None)
                    
                    if level_instance is None:
                        print(f"Warning: {filename} does not export a 'level' instance")
                        continue
                        
                    if not isinstance(level_instance, BaseLevel):
                        print(f"Warning: {filename} exports a level that doesn't inherit from BaseLevel")
                        continue
                        
                    # Initialize the level and get its data
                    level_data = level_instance.start() or {}
                    level_desc = getattr(level_instance, 'level_desc', '')
                    level_id = getattr(level_instance, 'level_id', f'level_{level_num}')
                    
                    print(f"Loaded level {level_num}: {level_id} - {level_desc[:50]}...")
                    
                    # Store the level instance
                    self.levels[level_num] = level_instance
                    
                    # Prepare level info for global storage
                    level_info = {
                        'level': level_num,
                        'name': f'Level {level_num}',
                        'description': level_desc,
                        'level_id': level_id,
                        'has_state': bool(level_data.get('level_state')),
                        'last_updated': datetime.utcnow().isoformat()
                    }
                    
                    # Update if level doesn't exist or has changed
                    level_str = str(level_num)
                    if level_str not in updated_levels or \
                       updated_levels[level_str].get('description') != level_desc or \
                       updated_levels[level_str].get('level_id') != level_id:
                        
                        updated_levels[level_str] = level_info
                        print(f"Updated level {level_num} in global levels")
                    
                except ImportError as e:
                    print(f"Error importing {module_name}: {e}")
                    continue
                    
            except (ValueError, IndexError) as e:
                print(f"Skipping invalid level file: {filename} - {e}")
                continue
            except Exception as e:
                print(f"Unexpected error processing {filename}: {e}")
                continue
        
        # Save updated levels back to global data if anything changed
        if updated_levels != global_data.get('levels', {}):
            try:
                print(f"Saving {len(updated_levels)} levels to global data...")
                self._save_global_data({'levels': updated_levels})
                print("Successfully saved global levels")
            except Exception as e:
                print(f"Error saving global levels: {e}")
        else:
            print("No changes to global levels")
            
        # Ensure we have at least one level loaded
        if not self.levels:
            raise RuntimeError("No valid level modules found in levels directory")
    
    def verify_password(self, user_id: str, password: str, current_level: int) -> Dict[str, Any]:
        """Verify a password against all levels up to the current level.

        Args:
            user_id: Unique identifier for the user
            password: The password to verify
            current_level: The user's current level

        Returns:
            dict: Dictionary containing verification results with full level information
        """
        print(f"\n--- Starting password validation for user {user_id} ---")
        print(f"Current level from request: {current_level}")

        # Load or initialize user data
        user_data = self._get_user_data(user_id) or {
            'current_level': 1,
            'passed_levels': [],
            'failed_levels': [],
            'level_states': {}
        }

        # Ensure data structure integrity
        user_data.setdefault('level_states', {})
        user_data.setdefault('passed_levels', [])
        user_data.setdefault('failed_levels', [])

        # Normalize level lists
        user_data['passed_levels'] = [
            level.get('level', level) if isinstance(level, dict) else level
            for level in user_data['passed_levels']
        ]
        user_data['failed_levels'] = [
            level.get('level', level) if isinstance(level, dict) else level
            for level in user_data['failed_levels']
        ]

        previous_passed = set(user_data['passed_levels'])
        previous_failed = set(user_data['failed_levels'])

        # Level references
        global_levels = self._get_global_data().get('levels', {})
        passed_levels = []
        failed_levels = []

        print(f"Validating levels 1 to {current_level}")

        for level_num in range(1, current_level + 1):
            level_str = str(level_num)
            level = self.levels.get(level_num)

            if not level:
                print(f"Warning: No validator found for level {level_num}")
                continue

            # Initialize or update level state
            level_state = user_data['level_states'].setdefault(level_str, {
                'attempts': 0,
                'last_attempt': None
            })

            level_state['attempts'] += 1
            level_state['last_attempt'] = datetime.utcnow().isoformat()

            try:
                is_valid = level.is_valid(password, level_state)
                level_info = {
                    'level': level_num,
                    'name': f'Level {level_num}',
                    'description': getattr(level, 'level_desc', ''),
                    'attempts': level_state['attempts'],
                    'last_attempt': level_state['last_attempt']
                }

                if is_valid:
                    print(f"Level {level_num} passed validation")
                    passed_levels.append(level_info)
                else:
                    print(f"Level {level_num} failed validation (attempt {level_state['attempts']})")
                    failed_levels.append(level_info)

            except Exception as e:
                print(f"Error validating level {level_num}: {e}")
                failed_levels.append({
                    'level': level_num,
                    'name': f'Level {level_num}',
                    'description': getattr(level, 'level_desc', '')
                })

        # Get the actual passed levels from current validation
        current_passed = {lvl['level'] for lvl in passed_levels}
        current_failed = {lvl['level'] for lvl in failed_levels}

        # Update user data with current validation results (overwrite, don't merge)
        user_data['passed_levels'] = sorted(current_passed)
        user_data['failed_levels'] = sorted(current_failed - current_passed)

        # Only update current_level if the current level was passed
        if current_level in user_data['passed_levels']:
            # Find the next unpassed level
            new_current_level = current_level + 1
            # Don't exceed the maximum level
            max_level = self.get_max_level()
            if new_current_level > max_level:
                new_current_level = max_level
            user_data['current_level'] = new_current_level
        else:
            # Keep the same current level if not passed
            new_current_level = current_level

        # Identify newly passed levels (before overwriting!)
        newly_passed = [
            level for level in passed_levels
            if level['level'] not in previous_passed
        ]

        # Save user data
        self._save_user_data(user_id, user_data)

        # Sort response consistently
        passed_levels_sorted = sorted(passed_levels, key=lambda x: x['level'])
        failed_levels_sorted = sorted(failed_levels, key=lambda x: x['level'])

        # Debug output
        print("\n--- Validation Results ---")
        print(f"Passed levels: {[l['level'] for l in passed_levels_sorted]}")
        print(f"Newly passed: {[l['level'] for l in newly_passed]}")
        print(f"Failed levels: {[l['level'] for l in failed_levels_sorted]}")
        print(f"New current level: {new_current_level}")


        return {
            'passed': passed_levels_sorted,
            'failed': failed_levels_sorted,
            'current_level': new_current_level,
            'newly_passed': newly_passed
        }


    def get_level_info(self, level_num: int) -> Optional[Dict[str, Any]]:
        """Get information about a specific level.
        
        Args:
            level_num: The level number to get info for
            
        Returns:
            Dict containing level information or a default dict if level doesn't exist
        """
        try:
            # First try to get from global levels
            global_levels = self._get_global_data().get('levels', {})
            level_info = global_levels.get(str(level_num))
            
            if level_info:
                return level_info
                
            # Fall back to dynamic generation if not in global levels
            if level_num not in self.levels:
                print(f"Warning: Level {level_num} not found in loaded levels")
                return {
                    'level': level_num,
                    'name': f'Level {level_num}',
                    'description': '',
                    'level_id': f'level_{level_num}',
                    'has_state': False
                }
                
            level = self.levels[level_num]
            level_data = level.start() or {}
            
            # Build the level info
            result = {
                'level': level_num,
                'name': f'Level {level_num}',
                'description': getattr(level, 'level_desc', ''),
                'level_id': getattr(level, 'level_id', f'level_{level_num}'),
                'has_state': bool(level_data.get('level_state'))
            }
            
            # Cache this info in global levels for future use
            try:
                db = self._load_db()
                if '_global' not in db:
                    db['_global'] = {'levels': {}}
                
                if 'levels' not in db['_global']:
                    db['_global']['levels'] = {}
                
                db['_global']['levels'][str(level_num)] = result
                self._save_db(db)
            except Exception as e:
                print(f"Error caching level info: {e}")
                
            return result
            
        except Exception as e:
            print(f"Error in get_level_info for level {level_num}: {e}")
            return {
                'level': level_num,
                'name': f'Level {level_num}',
                'description': '',
                'level_id': f'level_{level_num}',
                'has_state': False
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
        
        # If the level state doesn't exist, initialize it
        level_states = user_data.setdefault('level_states', {})
        level_str = str(level_num)
        
        if level_str not in level_states and level_num in self.levels:
            level = self.levels[level_num]
            level_data = level.start() or {}
            level_states[level_str] = level_data.get('level_state', {})
            
            # Save the updated states back to the database
            user_data['level_states'] = level_states
            self._save_user_data(user_id, user_data)
        
        return level_states.get(level_str, {})
        
    def reset_user_level(self, user_id: str, level_num: int) -> bool:
        """Reset a user's progress on a specific level.
        
        Args:
            user_id: The user's ID
            level_num: The level number to reset
            
        Returns:
            bool: True if reset was successful, False otherwise
        """
        user_data = self._get_user_data(user_id)
        level_str = str(level_num)
        
        # Remove from passed levels if it's there
        if 'passed_levels' in user_data and level_num in user_data['passed_levels']:
            user_data['passed_levels'].remove(level_num)
            
        # Reset level state
        if 'level_states' in user_data and level_str in user_data['level_states']:
            del user_data['level_states'][level_str]
        
        # Save the changes
        self._save_user_data(user_id, user_data)
        return True
    
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
