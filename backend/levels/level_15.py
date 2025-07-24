"""
Level 15: Binary Code Challenge

This level requires understanding binary code.
Your password must contain the binary representation of a specific number.
"""
from .base_level import BaseLevel

class Level15(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=15,
            level_desc="Your password must contain the binary representation of the number 69."
        )
    
    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if the password contains the binary representation of 69.
        
        Args:
            password: The password to validate
            level_state: The state data for this level (not used in this level)
            
        Returns:
            bool: True if password contains the binary code, False otherwise
        """
        # Binary representation of 69 is 1000101
        binary_code = "1000101"
        return binary_code in password
    
    def get_hint(self) -> str:
        """
        Get a hint for the current level.
        
        Returns:
            str: A hint about the binary code
        """
        return "Convert the number 69 to binary and include it in your password. Remember: 69 in binary is 1000101"

    def start(self):
        """
        Initialize the level.
        
        Returns:
            dict: Level initialization data
        """
        return {
            'level_state': {},
            'level_desc': self.level_desc,
            'level_id': self.level_id
        }

# Create a singleton instance of the level
level = Level15()
