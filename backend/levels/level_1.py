"""
Level 1: Simple Password Validation

This level checks if the password matches a specific string.
"""
from .base_level import BaseLevel

class Level1(BaseLevel):
    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if the password is correct for level 1.
        
        Args:
            password: The password to validate
            level_state: The state data for this level (not used in this level)
            
        Returns:
            bool: True if password is correct, False otherwise
        """

        return password == "welcome123"
    
    def start(self) -> dict:
        """
        Initialize the level and return its metadata and initial state.
        
        Returns:
            Dict containing level metadata and initial state
        """
        return {
            "level_id": 1,
            "level_desc": "Enter the correct password to proceed.",
            "level_state": {}  # No state needed for this simple level
        }

# Create a singleton instance of the level
level = Level1()