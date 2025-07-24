#!/usr/bin/env python3
"""
Database Backup Script

This script periodically backs up the database by fetching it from the /exportdb endpoint.
It saves each backup with a timestamp in the filename.
"""

import os
import time
import json
import requests
from datetime import datetime
from typing import Optional
from pathlib import Path

# Configuration
BACKUP_DIR = "db_backups"
BACKUP_INTERVAL = 60  # seconds
API_BASE_URL = "http://localhost:8000"  # Update this if your API is running on a different URL
DB_EXPORT_PASSWORD = os.getenv("DB_PWD")  # Get password from environment variable

# Ensure backup directory exists
os.makedirs(BACKUP_DIR, exist_ok=True)

def fetch_database() -> Optional[dict]:
    """Fetch the database from the /exportdb endpoint."""
    if not DB_EXPORT_PASSWORD:
        print("Error: DB_PWD environment variable is not set")
        return None
    
    try:
        response = requests.get(
            f"{API_BASE_URL}/exportdb",
            params={"password": DB_EXPORT_PASSWORD},
            timeout=10
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching database: {e}")
        return None

def save_backup(data: dict) -> str:
    """Save the database to a JSON file with a timestamp."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"db_backup_{timestamp}.json"
    filepath = os.path.join(BACKUP_DIR, filename)
    
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return filepath
    except Exception as e:
        print(f"Error saving backup: {e}")
        return ""

def main():
    print(f"Starting database backup service. Backing up every {BACKUP_INTERVAL} seconds.")
    print(f"Backups will be saved to: {os.path.abspath(BACKUP_DIR)}")
    
    if not DB_EXPORT_PASSWORD:
        print("Warning: DB_PWD environment variable is not set. Backups will fail.")
    
    try:
        while True:
            print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Fetching database...")
            db_data = fetch_database()
            
            if db_data:
                backup_path = save_backup(db_data)
                if backup_path:
                    print(f"Backup saved to: {backup_path}")
                else:
                    print("Failed to save backup")
            else:
                print("Failed to fetch database")
            
            # Wait for the next backup interval
            time.sleep(BACKUP_INTERVAL)
    except KeyboardInterrupt:
        print("\nBackup service stopped by user")
    except Exception as e:
        print(f"\nFatal error: {e}")

if __name__ == "__main__":
    main()
