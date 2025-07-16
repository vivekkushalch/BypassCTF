"""
User Scorecard Module

This module provides functionality to manage level-wise scorecards for users.
Each user has a scorecard that tracks their progress through different levels,
including completion status, number of attempts, and scores.
"""
from datetime import datetime
from typing import Dict, List, Optional


class ScorecardManager:
    def __init__(self):
        self._scorecards: Dict[str, List[Dict]] = {}
    
    def get_scorecard(self, user_id: str, total_levels: int = 10) -> List[Dict]:
        """
        Get or create a scorecard for the user.
        
        Args:
            user_id: Unique identifier for the user
            total_levels: Total number of levels in the game
            
        Returns:
            List[Dict]: The user's scorecard with entries for each level
        """
        if user_id not in self._scorecards:
            self._scorecards[user_id] = [
                {
                    "level": level,
                    "completed_at": None,
                    "tries": 0,
                    "score": 0.0
                }
                for level in range(1, total_levels + 1)
            ]
        return self._scorecards[user_id]
    
    def record_attempt(self, user_id: str, level: int) -> None:
        """
        Record an attempt for a specific level.
        
        Args:
            user_id: Unique identifier for the user
            level: The level being attempted
        """
        scorecard = self.get_scorecard(user_id)
        for entry in scorecard:
            if entry["level"] == level and not entry["completed_at"]:
                entry["tries"] += 1
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
        if user_id in self._scorecards:
            del self._scorecards[user_id]


# Singleton instance
scorecard_manager = ScorecardManager()
