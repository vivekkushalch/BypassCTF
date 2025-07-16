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
    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if the password meets level 2 requirements.
        
        Args:
            password: The password to validate
            level_state: The state data for this level (not used in this level)
            
        Returns:
            bool: True if password meets all requirements, False otherwise
        """
        # Check length
        if len(password) < 8:
            return False
            
        # Check for at least one digit
        if not re.search(r"\d", password):
            return False
            
        # Check for at least one uppercase letter
        if not re.search(r"[A-Z]", password):
            return False
            
        # Check for at least one special character
        if not re.search(r"[!@#$%^&*]", password):
            return False
            
        # Example valid password: "Secure1!"
        return True
    
    def start(self) -> dict:
        """
        Initialize the level and return its metadata and initial state.
        
        Returns:
            Dict containing level metadata and initial state
        """
        return {
            "level_id": 2,
            "level_desc": "Create a password that is at least 8 characters long, contains at least one digit, one uppercase letter, and one special character (!@#$%^&*).",
            "level_state": {}  # No state needed for this level
        }

# Create a singleton instance of the level
level = Level2()