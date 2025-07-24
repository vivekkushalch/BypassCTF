"""
Level 20: Basic Password Challenge

This is a simple level that requires a specific password to pass.
"""
from .base_level import BaseLevel

class Level20(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=20,
            level_desc="only the daring would follow, would you follow? https://dub.sh/yKK1XwV and which ride would you choose?"
        )
    
    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if the password matches the expected value.
        
        Args:
            password: The password to validate
            level_state: The state data for this level (not used)
            
        Returns:
            bool: True if password is correct, False otherwise
        """
        normalized = password.lower().strip()
        return "zerodayctf" in normalized or "return0" in normalized
    
    def start(self):
        """
        Initialize the level.
        
        Returns:
            dict: Level initialization data
        """
        return {
            'level_state': {},
            'level_desc': self.level_desc,
            'hint': 'The password is literally given in the level description.'
        }

# Create a singleton instance of the level
level = Level20()
