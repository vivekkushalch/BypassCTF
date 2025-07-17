from .base_level import BaseLevel

class Level6(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=6,
            level_desc="Your password must contain exactly one skull emoji (💀) for every 10 characters in length",
        )
    
    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if password contains the correct number of skull emojis.
        Rule: Password must have exactly 1 skull emoji (💀) for every 10 characters.
        
        Args:
            password: The password to validate
            level_state: The state data for this level
            
        Returns:
            bool: True if skull count matches requirement, False otherwise
        """
        skull = '💀'
        length = len(password)
        required_skulls = length // 10
        actual_skulls = password.count(skull)
        verification = actual_skulls == required_skulls
        print(actual_skulls, required_skulls)
        print(verification)
        return actual_skulls == required_skulls

    def start(self):
        pass
# Create a singleton instance of the level
level = Level6()