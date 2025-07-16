"""
Level 3: Mathematical Password Validation

This level requires the password to be a mathematical expression that equals 42.
The expression can use basic arithmetic operators: +, -, *, /
Example valid passwords: "40 + 2", "21 * 2", "50 - 8"
"""
import re
import ast
import operator
from .base_level import BaseLevel

class Level3(BaseLevel):
    def is_valid(self, password: str, level_state: dict) -> bool:
        """
        Check if the password is a valid mathematical expression that equals 42.
        
        Args:
            password: The password to validate (should be a mathematical expression)
            level_state: The state data for this level (not used in this level)
            
        Returns:
            bool: True if the expression equals 42, False otherwise
        """
        # Basic safety check - only allow numbers, spaces, and basic arithmetic operators
        if not re.match(r'^[\d\s+\-*/.()]+$', password):
            return False
        
        try:
            # Use ast.literal_eval for safe evaluation
            node = ast.parse(password, mode='eval')
            
            # Ensure only basic operations are used
            for n in ast.walk(node):
                if isinstance(n, (ast.Call, ast.Attribute, ast.Subscript, ast.Name)):
                    return False
                    
            # Evaluate the expression
            result = eval(compile(node, '<string>', 'eval'), {"__builtins__": {}}, {})
            
            # Check if the result is 42
            return result == 42
            
        except (SyntaxError, ValueError, TypeError, ZeroDivisionError):
            return False
    
    def start(self) -> dict:
        """
        Initialize the level and return its metadata and initial state.
        
        Returns:
            Dict containing level metadata and initial state
        """
        return {
            "level_id": 3,
            "level_desc": "Enter a mathematical expression that equals 42. You can use numbers and basic arithmetic operators (+, -, *, /). Example: 40 + 2",
            "level_state": {}  # No state needed for this level
        }

# Create a singleton instance of the level
level = Level3()