from .base_level import BaseLevel

class Level3(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=3,
            level_desc="Password must include an uppercase letter",
        )
    
    def is_valid(password: str) -> bool:
    # Rule 3: Password must include an uppercase letter
     if not any(char.isupper() for char in password):
        return False
     return True 

    def start(self):
        pass
# Create a singleton instance of the level
level = Level3()




