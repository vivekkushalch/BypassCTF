"""
User Scorecard Module

This module provides functionality to manage level-wise scorecards for users.
Each user has a scorecard that tracks their progress through different levels,
including completion status, number of attempts, and scores.
"""
import json
import os
from datetime import datetime
from typing import Dict, List, Optional, Any

class ScorecardManager:
    def __init__(self):
        self.db_path = os.path.join(os.path.dirname(__file__), 'db.json')
        self._ensure_db_exists()
    
    def _ensure_db_exists(self) -> None:
        """Ensure the database file exists with proper structure."""
        if not os.path.exists(self.db_path):
            with open(self.db_path, 'w') as f:
                json.dump({}, f)
    
    def _get_db(self) -> Dict[str, Any]:
        """Load the database from file."""
        try:
            with open(self.db_path, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {}
    
    def _save_db(self, data: Dict[str, Any]) -> None:
        """Save the database to file."""
        with open(self.db_path, 'w') as f:
            json.dump(data, f, indent=2)
    
    def _get_user_data(self, user_id: str) -> Dict[str, Any]:
        """Get user data from the database."""
        db = self._get_db()
        return db.get(user_id, {})
    
    def _save_user_data(self, user_id: str, data: Dict[str, Any]) -> None:
        """Save user data to the database."""
        db = self._get_db()
        db[user_id] = data
        self._save_db(db)
    
    def get_scorecard(self, user_id: str, total_levels: int = 10) -> List[Dict]:
        """
        Get or create a scorecard for the user.
        
        Args:
            user_id: Unique identifier for the user
            total_levels: Total number of levels in the game
            
        Returns:
            List[Dict]: The user's scorecard with entries for each level
        """
        user_data = self._get_user_data(user_id)
        
        # Initialize scorecard if it doesn't exist
        if 'scorecard' not in user_data:
            user_data['scorecard'] = [
                {
                    "level": level,
                    "completed_at": None,
                    "tries": 0,
                    "score": 0.0
                }
                for level in range(1, total_levels + 1)
            ]
            self._save_user_data(user_id, user_data)
        
        return user_data['scorecard']
    
    def record_attempt(self, user_id: str, level: int) -> None:
        """
        Record an attempt for a specific level.
        
        Args:
            user_id: Unique identifier for the user
            level: The level being attempted
        """
        user_data = self._get_user_data(user_id)
        scorecard = self.get_scorecard(user_id)
        
        for entry in scorecard:
            if entry["level"] == level and not entry["completed_at"]:
                entry["tries"] += 1
                user_data['scorecard'] = scorecard
                self._save_user_data(user_id, user_data)
                break
    
    def complete_level(self, user_id: str, level: int, score: float, completed_at: str = None) -> None:
        """
        Mark a level as completed and record the score.
        
        Args:
            user_id: Unique identifier for the user
            level: The level being completed
            score: The score achieved for this level
            completed_at: Optional ISO format timestamp of completion
        """
        user_data = self._get_user_data(user_id)
        scorecard = self.get_scorecard(user_id)
        
        for entry in scorecard:
            if entry["level"] == level:
                # If level is already completed, don't modify it
                if entry["completed_at"] is not None:
                    return
                    
                # Set completion time to now if not provided
                if completed_at is None:
                    completed_at = datetime.utcnow().isoformat()
                    
                entry.update({
                    "completed_at": completed_at,
                    "score": score
                })
                
                # Save the updated scorecard
                user_data['scorecard'] = scorecard
                self._save_user_data(user_id, user_data)
                break
    
    def get_level_stats(self, user_id: str, level: int) -> Optional[Dict]:
        """
        Get statistics for a specific level.
        
        Args:
            user_id: Unique identifier for the user
            level: The level to get stats for
            
        Returns:
            Optional[Dict]: Level statistics if found, None otherwise
        """
        scorecard = self.get_scorecard(user_id)
        for entry in scorecard:
            if entry["level"] == level:
                return entry.copy()
        return None
    
    def get_all_scores(self, user_id: str) -> List[Dict]:
        """
        Get the complete scorecard for a user.
        
        Args:
            user_id: Unique identifier for the user
            
        Returns:
            List[Dict]: The complete scorecard
        """
        return self.get_scorecard(user_id).copy()
    
    def get_total_score(self, user_id: str) -> float:
        """
        Calculate the total score across all levels.
        
        Args:
            user_id: Unique identifier for the user
            
        Returns:
            float: The total score
        """
        scorecard = self.get_scorecard(user_id)
        return sum(entry["score"] for entry in scorecard)
    
    def reset_scorecard(self, user_id: str) -> None:
        """
        Reset the scorecard for a user.
        
        Args:
            user_id: Unique identifier for the user
        """
        user_data = self._get_user_data(user_id)
        if 'scorecard' in user_data:
            # Reset all levels in the scorecard
            for entry in user_data['scorecard']:
                entry.update({
                    'completed_at': None,
                    'tries': 0,
                    'score': 0.0
                })
            self._save_user_data(user_id, user_data)


# Singleton instance
scorecard_manager = ScorecardManager()
