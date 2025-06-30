import sqlite3
from datetime import datetime

def init_database():
    conn = sqlite3.connect('detections.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS detections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            detected_classes TEXT,
            threat_level TEXT,
            confidence REAL,
            image_path TEXT
        )
    ''')
    
    conn.commit()
    conn.close()
