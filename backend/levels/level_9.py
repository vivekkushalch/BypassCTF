from .base_level import BaseLevel

class Level9(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=9,
            level_desc="Your password must include a Google Map Plus Code for GDGOCBIT.",
        )
    
    def __init_bit_codes(self):
        """Initialize the valid BIT Plus Codes."""
        return {"GFC6+H8", "GFC6+J7", "GFF2+VJ"}
    
    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if password contains a valid BIT Plus Code.
        
        Args:
            password: The password to validate
            level_state: The state data for this level
            
        Returns:
            bool: True if password contains any valid BIT Plus Code, False otherwise
        """
        bit_plus_codes = self.__init_bit_codes()
        return any(code in password for code in bit_plus_codes)

    def start(self):
        pass
# Create a singleton instance of the level
level = Level9()