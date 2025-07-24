"""
Level 16: Pi Password Validation

This level checks if the password contains the value of pi up to first 5 decimal places (3.14159).
"""
from .base_level import BaseLevel

class Level16(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=16,
            level_desc="Your password must contain the value of pi up to first 5 decimal places."
        )
    
    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if the password contains pi to 5 decimal places (3.14159).
        
        Args:
            password: The password to validate
            level_state: The state data for this level (not used in this level)
            
        Returns:
            bool: True if password contains 3.14159, False otherwise
        """
        pi_value = "3.14159"
        return pi_value in password
    
    def get_hint(self) -> str:
        """
        Get a hint for the current level.
        
        Returns:
            str: A hint about what pi value is needed
        """
        return "You need to include the mathematical constant π (pi) to 5 decimal places: 3.14159"

# Create a singleton instance of the level
level = Level16()
