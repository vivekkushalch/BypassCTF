from .base_level import BaseLevel

class Level7(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=7,
            level_desc="The length of your password must be a prime number.",
        )
    
    def is_prime(self, n: int) -> bool:
        """
        Check if a number is prime.
        
        Args:
            n: The number to check
            
        Returns:
            bool: True if n is prime, False otherwise
        """
        if n < 2:
            return False
        if n == 2:
            return True
        if n % 2 == 0:
            return False
        for i in range(3, int(n ** 0.5) + 1, 2):
            if n % i == 0:
                return False
        return True
    
    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if password length is a prime number.
        Rule: The total length of the password must be a prime number.
        
        Args:
            password: The password to validate
            level_state: The state data for this level
            
        Returns:
            bool: True if password length is prime, False otherwise
        """
        return self.is_prime(len(password))

    def start(self):
        pass
# Create a singleton instance of the level
level = Level7()