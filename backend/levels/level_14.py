"""
Level 14: Powerhouse of the Cell Password Validation

This level checks if the password contains "mitochondria" - the powerhouse of the cell.
"""
from .base_level import BaseLevel

class Level14(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=14,
            level_desc='Your password must include the name of "The power house of the cell". 🦠'
        )
    
    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if the password contains "mitochondria" (case-insensitive).
        
        Args:
            password: The password to validate
            level_state: The state data for this level (not used in this level)
            
        Returns:
            bool: True if password contains mitochondria, False otherwise
        """
        # Case-insensitive search for mitochondria
        return "mitochondria" in password.lower()
    
    def get_hint(self) -> str:
        """
        Get a hint for the current level.
        
        Returns:
            str: A hint about the powerhouse of the cell
        """
        return "Think biology! What organelle is known as 'the powerhouse of the cell'? It starts with 'mito...' 🧬"

# Create a singleton instance of the level
level = Level14()
