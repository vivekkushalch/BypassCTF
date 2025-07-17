from .base_level import BaseLevel

class Level10(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=10,
            level_desc="Your password must include the Bitcoin Genesis Block hash.",
        )
    
    def __init_genesis_hash(self):
        """Initialize the Bitcoin Genesis Block hash."""
        return "000000000019d6689c085ae165831e93"
    
    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if password contains the Bitcoin Genesis Block hash.
        
        Args:
            password: The password to validate
            level_state: The state data for this level
            
        Returns:
            bool: True if password contains the Genesis Block hash, False otherwise
        """
        genesis_hash = self.__init_genesis_hash()
        return genesis_hash in password

# Create a singleton instance of the level
    def start(self):
        pass
level = Level10()