from .base_level import BaseLevel

class Level4(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=4,
            level_desc="Password must include a special character",
        )
    
    def is_valid(self, password: str, level_state: dict) -> bool:

        # Rule 4: Password must include a special character
        special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/"
        if not any(char in special_chars for char in password):
             return False
        return True

    def start(self):
        pass
# Create a singleton instance of the level
level = Level4()


