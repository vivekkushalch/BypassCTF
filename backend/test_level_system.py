"""
Test Script for Level System

This script tests the level validation and scorecard functionality.
It simulates user interactions with different levels and verifies the results.
"""
import sys
import os
import json
from typing import Dict, Any, List, Tuple

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the level manager
from level_manager import level_manager
from user_scorecard import scorecard_manager

class TestRunner:
    """Test runner for the level system."""
    
    def __init__(self):
        """Initialize test runner with test users."""
        self.test_users = {
            "test_user_1": {
                "current_level": {"level": 1, "extras": {}},
                "passed_levels": [],
                "failed_levels": []
            },
            "test_user_2": {
                "current_level": {"level": 1, "extras": {}},
                "passed_levels": [],
                "failed_levels": []
            }
        }
        self.setup_test_environment()
    
    def setup_test_environment(self) -> None:
        """Set up the test environment by saving test users to the database."""
        db_path = os.path.join(os.path.dirname(__file__), 'db.json')
        with open(db_path, 'w', encoding='utf-8') as f:
            json.dump(self.test_users, f, indent=2)
    
    def run_tests(self) -> None:
        """Run all test cases."""
        print("=== Starting Level System Tests ===\n")
        
        tests = [
            self.test_level_1,
            self.test_level_2,
            self.test_level_3,
            self.test_scorecard
        ]
        
        for test in tests:
            test()
        
        print("\n=== All Tests Completed ===")
    
    def test_level_1(self) -> None:
        """Test Level 1 functionality."""
        print("\n--- Testing Level 1 ---")
        user_id = "test_user_1"
        
        # Test with wrong password
        print("\nTest 1.1: Wrong password")
        result = level_manager.verify_password(user_id, "wrongpass", 1)
        self.print_result(
            "1.1", 
            not result["passed"] and 1 in result["failed"], 
            "Should fail with wrong password"
        )
        
        # Test with correct password
        print("\nTest 1.2: Correct password")
        result = level_manager.verify_password(user_id, "welcome123", 1)
        self.print_result(
            "1.2", 
            1 in result["passed"], 
            "Should pass with correct password"
        )
        
        # Verify level progression
        print("\nTest 1.3: Level progression")
        user_data = level_manager._get_user_data(user_id)
        self.print_result(
            "1.3",
            user_data["current_level"]["level"] == 2 and 1 in user_data["passed_levels"],
            "Should progress to level 2 after passing level 1"
        )
    
    def test_level_2(self) -> None:
        """Test Level 2 functionality."""
        print("\n--- Testing Level 2 ---")
        user_id = "test_user_1"
        
        # Test with invalid passwords
        invalid_passwords: List[Tuple[str, str]] = [
            ("short", "Too short"),
            ("nouppercase1!", "No uppercase"),
            ("NOLOWERCASE1!", "No lowercase"),
            ("NoSpecialChar1", "No special character")
        ]
        
        for i, (pwd, desc) in enumerate(invalid_passwords, 1):
            print(f"\nTest 2.{i}: Invalid password - {desc}")
            result = level_manager.verify_password(user_id, pwd, 2)
            self.print_result(
                f"2.{i}", 
                2 in result.get("failed", []), 
                f"Should fail with {desc}"
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

def main() -> None:
    """Main function to run the tests."""
    # Clear any existing test data
    if os.path.exists('db.json'):
        os.remove('db.json')
    
    # Run tests
    test_runner = TestRunner()
    test_runner.run_tests()

if __name__ == "__main__":
    main()
