import hashlib
from .base_level import BaseLevel

class Level11(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=11,
            level_desc="Your password must contain the SHA1 hash of its first 5 characters exactly once.",
        )
    
    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if password contains the SHA1 hash of its first 5 characters exactly once.
        
        Args:
            password: The password to validate
            level_state: The state data for this level
            
        Returns:
            bool: True if SHA1 hash of first 5 chars appears exactly once, False otherwise
        """
        if len(password) < 5:
            return False  # Not enough characters
        
        # Get first 5 characters
        prefix = password[:5]
        
        # Generate SHA1 hash of the prefix
        hash_value = hashlib.sha1(prefix.encode()).hexdigest()
        
        # Make sure the hash appears exactly once in the password
        return password.count(hash_value) == 1

    def start(self):
        pass
# Create a singleton instance of the level
level = Level11()