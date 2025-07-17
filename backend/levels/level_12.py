import random
import requests
from .base_level import BaseLevel

class Level12(BaseLevel):
    def __init__(self):
        # Get random Pokemon from API
        self.pokemon_name, self.pokemon_image = self._get_random_pokemon()
        
        super().__init__(
            level_id=12,
            level_desc=f"Your password must be exactly the Pokemon name '{self.pokemon_name}'.",
        )
    
    def _get_random_pokemon(self):
        """
        Fetch a random Pokemon from the PokeAPI.
        
        Returns:
            tuple: (pokemon_name, pokemon_image_url)
        """
        pokemon_id = random.randint(1, 898)  # up to Gen 8
        url = f"https://pokeapi.co/api/v2/pokemon/{pokemon_id}"
        response = requests.get(url)
        data = response.json()

        name = data['name']
        image_url = data['sprites']['other']['official-artwork']['front_default']

        return name, image_url
    
    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if password exactly matches the Pokemon name from level state.
        
        Args:
            password: The password to validate
            level_state: The state data for this level containing Pokemon info
            
        Returns:
            bool: True if password exactly matches the Pokemon name, False otherwise
        """
        if 'pokemon_name' not in level_state:
            return False
        
        # Case-insensitive exact match comparison
        return password.lower().strip() == level_state['pokemon_name'].lower().strip()

    def start(self):
        return{
            "level_state" : {
                "pokemon_name": self.pokemon_name
            },
            "level_extras" : {
                "hint": "enter the exact pokemon name shown in the image",
                "image_url": self.pokemon_image,
                "pokemon_name": self.pokemon_name,
                "description": "password must match the pokemon name exactly (case-insensitive)"
            }
            
        }
# Create a singleton instance of the level

level = Level12()