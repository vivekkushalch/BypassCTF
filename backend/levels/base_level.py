"""
Base Level Module

This module provides a base class for all level validators.
Each level should extend this class and implement the required methods.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class BaseLevel(ABC):
    """Base class for all level validators.
    
    Each level should extend this class and implement the required methods.
    The level_state is stored in the user's data and passed to is_valid()
    when validating passwords.
    
    Child classes should call super().__init__() with level_id and level_desc.
    """
    
    def __init__(self, level_id: int = 0, level_desc: str = ""):
        """Initialize the level with its ID and description.
        
        Args:
            level_id: The unique identifier for the level
            level_desc: Description of the level shown to the user
        """
        self.level_id = level_id
        self.level_desc = level_desc
    
    @abstractmethod
    def is_valid(self, password: str, level_state: Dict[str, Any]) -> bool:
        """Validate the password based on the current level state.
        
        Args:
            password: The password to validate
            level_state: The state data for this level
            
        Returns:
            bool: True if the password is valid, False otherwise
        """
        pass
    
    def start(self) -> Dict[str, Any]:
        """Initialize the level and return its initial state.
        
        Returns:
            Dict containing the initial level state
        """
        return {}
    
    def get_level_state(self, user_data: Dict[str, Any], level_id: int) -> Dict[str, Any]:
        """Get the level state for a specific user and level.
        
        Args:
            user_data: The user's data dictionary
            level_id: The level ID to get state for
            
        Returns:
            Dict containing the level state, or empty dict if not found
        """
        if "level_states" not in user_data:
            user_data["level_states"] = {}
        if str(level_id) not in user_data["level_states"]:
            # Initialize level state if it doesn't exist
            level_data = self.start(self)
            user_data["level_states"][str(level_id)] = level_data["level_state"]
        return user_data["level_states"].get(str(level_id), {})
