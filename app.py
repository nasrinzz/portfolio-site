from flask import Flask, render_template, request, flash, redirect
import sqlite3

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Required for flash messages

# HOME PAGE
@app.route('/')
def home():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, message FROM contacts ORDER BY id DESC")
    entries = cursor.fetchall()
    conn.close()
    return render_template('index.html', entries=entries)

# CONTACT PAGE
@app.route('/contact')
def contact():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, message FROM contacts ORDER BY id DESC")
    entries = cursor.fetchall()
    conn.close()
    return render_template('contact.html', entries=entries)

# ENTRIES PAGE
@app.route('/entries')
def entries():
    return redirect('/contact')

# FORM SUBMIT
@app.route('/submit', methods=['POST'])
def submit():
    name = request.form['name']
    email = request.form['email']
    message = request.form['message']

    # CONNECT DATABASE
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()

    # CREATE TABLE IF NOT EXISTS
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            message TEXT
        )
    ''')

    # INSERT DATA
    cursor.execute(
        "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
        (name, email, message)
    )

    conn.commit()
    conn.close()

    flash('Message sent successfully!')
    return redirect('/')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)