"""
Level 2: Password with Requirements

This level checks if the password meets specific requirements:
- At least 8 characters long
- Contains at least one digit
- Contains at least one uppercase letter
- Contains at least one special character (!@#$%^&*)
"""
import re
from .base_level import BaseLevel

class Level2(BaseLevel):
    
    def is_valid(password: str) -> bool:
        # Rule 2: Password must include a number
        if not any(char.isdigit() for char in password):
            return False
        return True     

    def start(self) -> dict:
        """
        Initialize the level and return its metadata and initial state.
        
        Returns:
            Dict containing level metadata and initial state
        """
        return {
            "level_id": 2,
            "level_desc": "Password must include a number",
            "level_state": {}  # No state needed for this level
        }

# Create a singleton instance of the level
level = Level2()