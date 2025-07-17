import time
from .base_level import BaseLevel

class Level13(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=13,
            level_desc="Your password must contain the current time in 24-hour format (HH:MM).",
        )
    
    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if the password contains the current time in 24-hour format (HH:MM).
        
        Args:
            password: The password to validate
            level_state: The state data for this level
            
        Returns:
            bool: True if password contains current time in HH:MM format, False otherwise
        """
        # Get current time in 24-hour format (HH:MM)
        current_time = time.strftime("%H:%M")
        
        # Check if the current time is contained anywhere in the password
        return current_time in password.strip()

    def start(self):
        pass
# Create a singleton instance of the level
level = Level13()