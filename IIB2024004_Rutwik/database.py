"""
Database initialization and management for Web Server Security SQL Injection Demo.
Handles SQLite setup and seeding with realistic user records.
"""

import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "vulnerable_app.db")

def get_db_connection():
    """Returns a SQLite connection with row dictionary access."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the database schema and populates sample records."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Drop old tables if re-initializing
    cursor.execute("DROP TABLE IF EXISTS users")
    cursor.execute("DROP TABLE IF EXISTS audit_logs")

    # Create users table
    cursor.execute("""
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            full_name TEXT NOT NULL,
            role TEXT NOT NULL,
            email TEXT NOT NULL,
            confidential_data TEXT
        )
    """)

    # Create audit logs table to record login attempts
    cursor.execute("""
        CREATE TABLE audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            mode TEXT NOT NULL,
            input_username TEXT NOT NULL,
            executed_query TEXT NOT NULL,
            status TEXT NOT NULL
        )
    """)

    # Seed users
    users_data = [
        (
            "admin",
            "S3cur3!Adm1n#2026_Uncrackable",
            "System Administrator",
            "admin",
            "admin@iiita.ac.in",
            "CONFIDENTIAL: Root server SSH private key at /root/.ssh/id_ed25519; Final exam papers encrypted key: KEY-9842X-IT30001"
        ),
        (
            "dr_soumyadev",
            "CyberSec#Prof2026!Key",
            "Dr. Soumyadev Maity",
            "instructor",
            "soumyadev@iiita.ac.in",
            "Instructor private notes: Viva evaluation rubric and grading threshold curve for IT-30001."
        ),
        (
            "student_alice",
            "alicepass2026",
            "Alice Sharma",
            "student",
            "alice@iiita.ac.in",
            "Student Roll: IIT2023001 | Current Grade: A"
        ),
        (
            "student_bob",
            "bobpass2026",
            "Bob Verma",
            "student",
            "bob@iiita.ac.in",
            "Student Roll: IIT2023002 | Current Grade: B+"
        )
    ]

    cursor.executemany("""
        INSERT INTO users (username, password, full_name, role, email, confidential_data)
        VALUES (?, ?, ?, ?, ?, ?)
    """, users_data)

    conn.commit()
    conn.close()
    print(f"Database successfully initialized at {DB_PATH}")

if __name__ == "__main__":
    init_db()
