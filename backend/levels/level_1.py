"""
Level 1: Simple Password Validation

This level checks if the password matches a specific string.
"""
from .base_level import BaseLevel

class Level1(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=1,
            level_desc="Enter welcome123",
        )
    
    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if the password is correct for level 1.
        
        Args:
            password: The password to validate
            level_state: The state data for this level (not used in this level)
            
        Returns:
            bool: True if password is correct, False otherwise
        """
        # return password == "welcome123"
        return "welcome123" in password

    def start(self):
        return {
            "level_state":{},
            "level_extras": {}            
        }
# Create a singleton instance of the level
level = Level1()
