from .base_level import BaseLevel
from typing import Dict, Any

class Level3(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=3,
            level_desc="Password must include an uppercase letter",
        )
    
    def is_valid(self, password: str, level_state: Dict[str, Any]) -> bool:
        # Check if password contains at least one uppercase letter
        return any(char.isupper() for char in password)

    def start(self):
        pass
# Create a singleton instance of the level
level = Level3()




