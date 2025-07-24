"""
Level 17: Complex Maze Challenge

This level requires completing a maze game through the frontend.
The level validates that the user has completed the maze by checking the password for a special completion code.
"""
from .base_level import BaseLevel

class Level17(BaseLevel):
    def __init__(self):
        super().__init__(
            level_id=17,
            level_desc="Complete the complex maze game to unlock this level."
        )
        
        # The completion code that needs to be in the password
        self.completion_code = "MAZE_COMPLETED"
    
    def start(self):
        """
        Initialize the level.
        
        Returns:
            dict: Level initialization data
        """
        return {
            'level_state': {
                'attempts': 0,
                'show_maze': True,
                'instructions': self.get_instructions()
            },
            'level_desc': self.level_desc,
            'level_id': self.level_id
        }
    
    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if the password contains the maze completion code.
        
        Args:
            password: The password to validate
            level_state: The state data for this level
            
        Returns:
            bool: True if password contains the completion code, False otherwise
        """
        # Check if the password contains the maze completion code
        return self.completion_code in password.upper()
    
    def get_hint(self) -> str:
        """
        Get a hint for the current level.
        
        Returns:
            str: A hint about completing the maze
        """
        return f"Complete the interactive maze game, then enter the completion code: {self.completion_code}"
    
    def get_instructions(self) -> str:
        """
        Get detailed instructions for this level.
        
        Returns:
            str: Instructions for the maze game
        """
        return """
        Welcome to Level 17: Complex Maze Challenge!
        """

# Create a singleton instance of the level
level = Level17()