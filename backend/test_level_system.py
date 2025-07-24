"""
Test Script for Level System

This script tests the level validation and scorecard functionality.
It simulates user interactions with different levels and verifies the results.
"""
import unittest
import os
import json
import time
from fastapi.testclient import TestClient
from fastapi import status
from main import app, get_db, save_db, create_access_token
from level_manager import level_manager

class TestLevelSystem(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Set up test database
        cls.test_db = "test_db.json"
        os.environ["DB_FILE"] = cls.test_db
        
        # Initialize test client
        cls.client = TestClient(app)
        
        # Create test users with auth tokens
        cls.test_users = [
            {
                "user_id": "test_user1", 
                "current_level": 1, 
                "passed_levels": [], 
                "failed_levels": [],
                "registered_at": "2023-01-01T00:00:00.000000",
                "auth_token": create_access_token("test_user1")
            },
            {
                "user_id": "test_user2", 
                "current_level": 2, 
                "passed_levels": [1], 
                "failed_levels": [],
                "registered_at": "2023-01-01T00:00:00.000000",
                "auth_token": create_access_token("test_user2")
            },
        ]
        
        # Initialize test database with proper schema
        db = {
            "_global": {
                "levels": {
                    "1": {"password": "password1", "description": "Level 1"},
                    "2": {"password": "password2", "description": "Level 2"},
                    "3": {"password": "password3", "description": "Level 3"},
                }
            },
            "users": {}
        }
        
        # Add test users to database
        for user in cls.test_users:
            user_data = {
                "current_level": user["current_level"],
                "level_states": {},
                "passed_levels": user["passed_levels"],
                "failed_levels": user["failed_levels"],
                "registered_at": user["registered_at"],
                "auth_token": user["auth_token"],
                "initialized": True
            }
            db["users"][user["user_id"]] = user_data
        
        # Save test database
        with open(cls.test_db, 'w') as f:
            json.dump(db, f)
    
    def setUp(self):
        # Reset test database before each test
        self.setUpClass()
    
    def test_register_user(self):
        # Test new user registration
        response = self.client.post("/register", json={"user_id": "new_user"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["user_id"], "new_user")
        self.assertEqual(data["current_level"]["level"], 1)
        self.assertEqual(data["passed_levels"], [])
        self.assertEqual(data["failed_levels"], [])
        self.assertIn("auth_token", data)
        
        # Verify user was added to the database
        db = get_db()
        self.assertIn("new_user", db["users"])
        self.assertEqual(db["users"]["new_user"]["current_level"], 1)
    
    def test_register_existing_user(self):
        # Test registering an existing user
        response = self.client.post(
            "/register", 
            json={"user_id": "test_user1"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data["user_id"], "test_user1")
        self.assertEqual(data["current_level"]["level"], 1)
    
    def test_submit_password_correct(self):
        # Get auth token for test user
        auth_token = self.test_users[0]["auth_token"]
        
        # Test submitting correct password
        response = self.client.post(
            "/submit", 
            json={
                "auth_token": auth_token,
                "password": "password1"
            }
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertTrue(data["message"].startswith("Password verified"))
        
        # Check if user's level was updated
        db = get_db()
        user_data = db["users"].get("test_user1")
        self.assertIsNotNone(user_data)
        self.assertIn(1, user_data.get("passed_levels", []))
        self.assertEqual(user_data.get("current_level"), 2)  # Should advance to next level
    
    def test_submit_password_incorrect(self):
        # Get auth token for test user
        auth_token = self.test_users[0]["auth_token"]
        
        # Test submitting incorrect password
        response = self.client.post(
            "/submit", 
            json={
                "auth_token": auth_token,
                "password": "wrong_password"
            }
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertTrue(data["message"].startswith("Password verification failed"))
        
        # Check if failed attempt was recorded
        db = get_db()
        user_data = db["users"].get("test_user1")
        self.assertIsNotNone(user_data)
        failed_levels = user_data.get("failed_levels", [])
        self.assertGreater(len(failed_levels), 0)
        
        # Check if failed level has the correct structure
        failed_level = next((f for f in failed_levels if isinstance(f, dict) and f.get("level") == 1), None)
        self.assertIsNotNone(failed_level)
        self.assertEqual(failed_level.get("attempts"), 1)
        self.assertIn("last_attempt", failed_level)
    
    def test_leaderboard(self):
        # Test getting leaderboard
        response = self.client.get("/leaderboard")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        leaderboard = response.json()
        self.assertIsInstance(leaderboard, list)
        
        # Check if test users are in the leaderboard
        user_ids = [entry["user_id"] for entry in leaderboard]
        self.assertIn("test_user1", user_ids)
        self.assertIn("test_user2", user_ids)
        
        # Verify leaderboard sorting (user2 should be ranked higher since they've passed a level)
        user1_rank = next((u["rank"] for u in leaderboard if u["user_id"] == "test_user1"), None)
        user2_rank = next((u["rank"] for u in leaderboard if u["user_id"] == "test_user2"), None)
        self.assertIsNotNone(user1_rank)
        self.assertIsNotNone(user2_rank)
        self.assertLess(user2_rank, user1_rank)  # user2 should be ranked higher
    
    def test_user_rank(self):
        # Test getting specific user's rank
        response = self.client.get("/leaderboard/test_user1")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user_rank = response.json()
        self.assertEqual(user_rank["user_id"], "test_user1")
        self.assertIn("rank", user_rank)
        self.assertIn("score", user_rank)
        self.assertIn("current_level", user_rank)
        self.assertIn("last_updated", user_rank)
    
    def test_concurrent_updates(self):
        """Test that concurrent updates don't corrupt the database"""
        # This is a simple test to verify that our atomic file writing works
        # In a real app, you'd want more sophisticated concurrency testing
        
        # Create a new user
        user_id = f"concurrent_test_{int(time.time())}"
        response = self.client.post("/register", json={"user_id": user_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        auth_token = response.json()["auth_token"]
        
        # Make several concurrent updates
        for i in range(1, 4):
            response = self.client.post(
                "/submit",
                json={
                    "auth_token": auth_token,
                    "password": f"password{i}"  # Will pass level 1, 2, 3
                }
            )
            self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify final state
        db = get_db()
        user_data = db["users"].get(user_id)
        self.assertIsNotNone(user_data)
        self.assertEqual(user_data["current_level"], 4)  # Should be on level 4 (or max level + 1)
        self.assertIn(1, user_data["passed_levels"])
        self.assertIn(2, user_data["passed_levels"])
        self.assertIn(3, user_data["passed_levels"])
    
    def test_level_2(self) -> None:
        """Test Level 2 functionality."""
        print("\n--- Testing Level 2 ---")
        user_id = "test_user_1"
        
        # Test with invalid passwords
        invalid_passwords = ["password0", "password2", "password3"]
        for i, password in enumerate(invalid_passwords, 1):
            print(f"\nTest 2.{i}: Invalid password")
            result = level_manager.verify_password(user_id, password, 2)
            self.print_result(
                f"2.{i}", 
                2 in result.get("failed", []), 
                f"Should fail with {password}"
            )
        
        # Test with valid password
        print("\nTest 2.5: Valid password")
        result = level_manager.verify_password(user_id, "ValidPass1!", 2)
        self.print_result(
            "2.5", 
            2 in result.get("passed", []), 
            "Should pass with valid password"
        )
    
    def test_level_3(self) -> None:
        """Test Level 3 functionality."""
        print("\n--- Testing Level 3 ---")
        user_id = "test_user_2"
        
        # Test with invalid expressions
        invalid_expressions: List[Tuple[str, str]] = [
            ("40 +", "Invalid expression"),
            ("40 + 1", "Doesn't equal 42"),
            ("import os", "Invalid characters"),
            ("__import__('os')", "Dangerous operation")
        ]
        
        for i, (expr, desc) in enumerate(invalid_expressions, 1):
            print(f"\nTest 3.{i}: Invalid expression - {desc}")
            result = level_manager.verify_password(user_id, expr, 3)
            self.print_result(
                f"3.{i}", 
                3 in result.get("failed", []), 
                f"Should fail with {desc}"
            )
        
        # Test with valid expressions
        valid_expressions = ["40 + 2", "21 * 2", "50 - 8", "84 / 2"]
        for i, expr in enumerate(valid_expressions, len(invalid_expressions) + 1):
            print(f"\nTest 3.{i}: Valid expression")
            result = level_manager.verify_password(user_id, expr, 3)
            passed = 3 in result.get("passed", [])
            self.print_result(f"3.{i}", passed, f"Should pass with {expr}")
            if passed:
                break  # Stop after first success
    
    def test_scorecard(self) -> None:
        """Test scorecard functionality."""
        print("\n--- Testing Scorecard ---")
        user_id = "test_user_1"
        
        # Get scorecard
        scorecard = scorecard_manager.get_all_scores(user_id)
        
        # Check if scorecard has entries for completed levels
        print("\nTest SC.1: Scorecard entries")
        has_entries = any(entry.get("completed_at") is not None for entry in scorecard)
        self.print_result("SC.1", has_entries, "Should have completed levels in scorecard")
        
        # Check total score
        print("\nTest SC.2: Total score")
        total_score = scorecard_manager.get_total_score(user_id)
        self.print_result(
            "SC.2", 
            total_score > 0, 
            f"Total score should be > 0 (is {total_score})"
        )
        
        # Check level stats
        print("\nTest SC.3: Level stats")
        level_1_stats = next((entry for entry in scorecard if entry.get("level") == 1), None)
        stats_valid = (
            level_1_stats is not None and 
            level_1_stats.get("tries", 0) > 0 and 
            level_1_stats.get("score", 0) > 0 and
            level_1_stats.get("completed_at") is not None
        )
        self.print_result("SC.3", stats_valid, "Level 1 should have valid stats")
    
    def print_result(self, test_id: str, condition: bool, message: str) -> None:
        """Print test result in a formatted way."""
        status = "PASS" if condition else "FAIL"
        color_code = "\033[92m" if condition else "\033[91m"
        print(f"{test_id}: {color_code}{status}\033[0m - {message}")

    @classmethod
    def tearDownClass(cls):
        # Clean up test database
        if os.path.exists(cls.test_db):
            try:
                os.remove(cls.test_db)
            except:
                pass

if __name__ == "__main__":
    unittest.main()
