from .base_level import BaseLevel

class Level2(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=2,
            level_desc="Password must include a number",
        )
    
    def is_valid(self, password: str, level_state: dict) -> bool:
        if not any(char.isdigit() for char in password):
            return False
        return True     


    def start(self):
        pass
# Create a singleton instance of the level
level = Level2()

