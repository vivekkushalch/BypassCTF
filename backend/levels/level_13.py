import time
import pytz
from datetime import datetime
from .base_level import BaseLevel

class Level13(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=13,
            level_desc="Your password must contain the current time in 24-hour format (HH:MM).",
        )
    
    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if the password contains the current time in 24-hour format (HH:MM)
        for India/Kolkata timezone.
        
        Args:
            password: The password to validate
            level_state: The state data for this level
            
        Returns:
            bool: True if password contains current time in HH:MM format for India/Kolkata, False otherwise
        """
        # Get current time in India/Kolkata timezone
        kolkata_tz = pytz.timezone('Asia/Kolkata')
        current_time = datetime.now(kolkata_tz).strftime("%H:%M")
        
        # Check if the current time is contained anywhere in the password
        return current_time in password.strip()

    def start(self):
        """
        Initialize the level.
        
        Returns:
            dict: Level initialization data
        """
        # Get current time in India/Kolkata timezone for the hint
        kolkata_tz = pytz.timezone('Asia/Kolkata')
        current_time = datetime.now(kolkata_tz).strftime("%H:%M")
        
        return {
            'level_state': {},
            'hint': f'Current time in Kolkata is {current_time}. Include this in your password.'
        }
# Create a singleton instance of the level
level = Level13()