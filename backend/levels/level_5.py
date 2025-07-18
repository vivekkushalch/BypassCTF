from .base_level import BaseLevel

class Level5(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=5,
            level_desc="Digits in the password must add up to 250",
        )
    
    def is_valid(self, password: str, level_state: dict) -> bool:
        # Rule 5: Digits in the password must add up to 250
        digit_sum = sum(int(char) for char in password if char.isdigit())
        if digit_sum != 250:
            return False
        return True
        
    def start(self):
        pass
# Create a singleton instance of the level
level = Level5()



