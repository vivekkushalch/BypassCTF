"""
Level 18: Time Emoji Password Validation

This level checks if the password contains the current time as emoji (nearest half hour).
The time should be represented using clock face emojis (🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🕛🕧🕜🕝🕞🕟🕠🕡🕢🕣🕤🕥🕦).
"""
from .base_level import BaseLevel
from datetime import datetime

class Level18(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=18,
            level_desc="Your password must contain the current time as emoji (nearest half hour). eg. if it is 09:15, then the emoji should be 🕤. Hint: Time is all we have, Time is all we need, look to find the right time that YOU need!"
        )
    
    def _get_current_time_emoji(self) -> str:
        """
        Get the current time emoji (nearest half hour).
        
        Returns:
            str: The emoji representing the current time
        """
        now = datetime.now()
        hour = now.hour % 12  # Convert to 12-hour format
        minute = now.minute
        
        # Clock face emojis mapping
        # Full hours: 🕐🕑🕒🕓🕔🕕🕖🕗🕘🕙🕚🕛
        # Half hours: 🕜🕝🕞🕟🕠🕡🕢🕣🕤🕥🕦🕧
        full_hour_emojis = ["🕛", "🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚"]
        half_hour_emojis = ["🕧", "🕜", "🕝", "🕞", "🕟", "🕠", "🕡", "🕢", "🕣", "🕤", "🕥", "🕦"]
        
        # Determine if we're closer to the hour or half hour
        if minute < 15:
            # Closer to the full hour
            return full_hour_emojis[hour]
        elif minute < 45:
            # Closer to the half hour
            return half_hour_emojis[hour]
        else:
            # Closer to the next hour
            next_hour = (hour + 1) % 12
            return full_hour_emojis[next_hour]
    
    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if the password contains the correct time emoji for level 18.
        
        Args:
            password: The password to validate
            level_state: The state data for this level (not used in this level)
            
        Returns:
            bool: True if password contains the correct time emoji, False otherwise
        """
        current_time_emoji = self._get_current_time_emoji()
        return current_time_emoji in password
    
    def get_hint(self) -> str:
        """
        Get a hint for the current level.
        
        Returns:
            str: A hint showing the current time emoji
        """
        current_time_emoji = self._get_current_time_emoji()
        now = datetime.now()
        time_str = now.strftime("%H:%M")
        return f"Current time is around {time_str}. The emoji you need is: {current_time_emoji}"

# Create a singleton instance of the level
level = Level18()
