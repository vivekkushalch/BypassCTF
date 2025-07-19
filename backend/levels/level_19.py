"""
Level 19: Guess the Country Challenge

This level requires users to identify a country from a 3D map view and include its name in their password.
"""
from .base_level import BaseLevel

class Level19(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=19,
            level_desc="Your password must include the name of this country."
        )
        # The correct country name
        self.correct_country = "Indonesia"

    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if the password contains the name of the correct country.

        Args:
            password: The password to validate
            level_state: The state data for this level (not used in this level)

        Returns:
            bool: True if password contains the country name, False otherwise
        """
        return self.correct_country.lower() in password.lower()

    def get_hint(self) -> str:
        """
        Get a hint for the current level.

        Returns:
            str: A hint about the country to guess
        """
        return "These traditional houses with large curved roofs are from Southeast Asia. Look closely at the style!"

    def start(self):
        """
        Initialize the level.

        Returns:
            dict: Level initialization data
        """
        # Embedded 3D map iframe
        iframe_html = """
        <iframe
            src="https://www.google.com/maps/embed?pb=!4v1596371489650!6m8!1m7!1sCAoSLEFGMVFpcE5pVm5rQUp1SFluVnpXODJ0a0tpa2JXbnlUcEN3V25ub1VXM0N3!2m2!1d2.9760731!2d99.0698462!3f90!4f0!5f0.7820865974627469"
            width="450"
            height="534"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
        ></iframe>
        """
        return {
            'level_state': {},
            'level_desc': self.level_desc,
            'level_id': self.level_id,
            'iframe_url': "https://www.google.com/maps/embed?pb=!4v1596371489650!6m8!1m7!1sCAoSLEFGMVFpcE5pVm5rQUp1SFluVnpXODJ0a0tpa2JXbnlUcEN3V25ub1VXM0N3!2m2!1d2.9760731!2d99.0698462!3f90!4f0!5f0.7820865974627469"
        }

# Create a singleton instance of the level
level = Level19()
