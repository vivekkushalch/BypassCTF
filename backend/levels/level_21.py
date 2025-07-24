"""
Level 21: Simple Password Validation

This level checks if the password matches a specific string.
"""
from .base_level import BaseLevel

class Level21(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=21,
            level_desc="only the daring would follow, would you follow? https://dub.sh/yKK1XwV",
        )
    
    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if the password is correct for level 21.
        
        Args:
            password: The password to validate
            level_state: The state data for this level (not used in this level)
            
        Returns:
            bool: True if password is correct, False otherwise
        """
        # return password == "welcome123"
        return "bypass@)@%" in password

    def start(self):
        return {
            "level_state":{},
            "level_extras": {}            
        }
# Create a singleton instance of the level
level = Level21()
