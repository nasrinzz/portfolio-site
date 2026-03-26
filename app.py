from flask import Flask, render_template, request, jsonify
import sqlite3
import os

app = Flask(__name__)

# Database configuration - using your 'contacts.db' file
DB_FILE = 'contacts.db'

def init_db():
    with sqlite3.connect(DB_FILE) as conn:
        # Using the table name 'contacts' from your screenshot
        conn.execute('''
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')

init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/messages', methods=['GET'])
def get_messages():
    try:
        with sqlite3.connect(DB_FILE) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            # Fetching from 'contacts' table
            cursor.execute('SELECT * FROM contacts ORDER BY id DESC')
            messages = [dict(row) for row in cursor.fetchall()]
        return jsonify(messages)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')
    
    if not name or not email or not message:
        return jsonify({"error": "Missing fields"}), 400

    try:
        with sqlite3.connect(DB_FILE) as conn:
            # Inserting into 'contacts' table
            conn.execute('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
                         (name, email, message))
        return jsonify({"status": "success"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)