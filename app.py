from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import hashlib

app = Flask(__name__)
CORS(app)

# MySQL connection configuration
db_config = {
    'host': 'localhost',
    'user': 'root',  # Replace with your MySQL username
    'password': 'keerthilbangera',  # Replace with your MySQL password
    'database': 'restaurant_db'  # Replace with your database name
}

def create_connection():
    """Create a database connection."""
    connection = None
    try:
        connection = mysql.connector.connect(**db_config)
        print("Connection to MySQL DB successful")
    except Error as e:
        print(f"Error '{e}' occurred while connecting to MySQL database")
    return connection

@app.route('/send_message', methods=['POST'])
def send_message():
    """Receive a message and store it in the MySQL database."""
    data = request.json  # Get JSON data from request
    message = data.get('content')  # Extract 'content' field

    if not message:
        return jsonify({"error": "Message content is required."}), 400

    try:
        connection = create_connection()
        if connection is None:
            return jsonify({"error": "Could not connect to the database."}), 500

        cursor = connection.cursor()
        query = "INSERT INTO message (content) VALUES (%s)"
        cursor.execute(query, (message,))
        connection.commit()

        return jsonify({"message": "Message sent successfully!"}), 201

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({"error": "Could not save the message."}), 500

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    password = data.get('password')
    contact = data.get('contact')

    print("Received signup request")
    if not all([name, password, contact]):
        print("Missing fields in signup")
        return jsonify({"error": "All fields are required."}), 400

    # Hash the password
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    print(f"Hashed password: {hashed_password}")

    try:
        connection = create_connection()
        if connection is None:
            print("Database connection failed")
            return jsonify({"error": "Could not connect to the database."}), 500

        cursor = connection.cursor()
        # Check if contact already exists in the database
        cursor.execute("SELECT * FROM users WHERE contact = %s", (contact,))
        if cursor.fetchone():
            print("Contact already exists")
            return jsonify({"error": "Contact already exists."}), 409

        # Insert user into the database
        query = "INSERT INTO users (name, password, contact) VALUES (%s, %s, %s)"
        cursor.execute(query, (name, hashed_password, contact))
        connection.commit()
        print("User inserted into database")

        return jsonify({"message": "Signup successful!"}), 201

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return jsonify({"error": "Could not complete signup."}), 500

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()


# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    contact = data.get('contact')
    password = data.get('password')

    if not all([contact, password]):
        return jsonify({"error": "Both contact and password are required."}), 400

    # Hash the password to compare it with the one in the database
    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    try:
        connection = create_connection()
        if connection is None:
            return jsonify({"error": "Could not connect to the database."}), 500

        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM users WHERE contact = %s AND password = %s"
        cursor.execute(query, (contact, hashed_password))
        user = cursor.fetchone()

        if user:
            return jsonify({"message": "Login successful!", "user": user}), 200
        else:
            return jsonify({"error": "Invalid contact or password."}), 401

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({"error": "Could not complete login."}), 500

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

# Table reservation route
@app.route('/reserve', methods=['POST'])
def reserve_table():
    data = request.json
    name = data.get('name')
    contact = data.get('contact')
    date = data.get('date')
    seats = data.get('seats')

    if not all([name, contact, date, seats]):
        return jsonify({"error": "All fields are required."}), 400

    if not isinstance(seats, int) or seats < 1:
        return jsonify({"error": "Number of seats must be a positive integer."}), 400

    try:
        connection = create_connection()
        if connection is None:
            return jsonify({"error": "Could not connect to the database."}), 500

        cursor = connection.cursor()
        query = "INSERT INTO reservations (name, contact, date, seats) VALUES (%s, %s, %s, %s)"
        values = (name, contact, date, seats)
        cursor.execute(query, values)
        connection.commit()

        return jsonify({"message": "Table reserved successfully!"}), 201

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({"error": "Could not reserve table."}), 500

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

# Fetch reservation by contact route
@app.route('/reservations/<string:contact>', methods=['GET'])
def get_reservation(contact):
    try:
        connection = create_connection()
        if connection is None:
            return jsonify({"error": "Could not connect to the database."}), 500

        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM reservations WHERE contact = %s"
        cursor.execute(query, (contact,))
        reservation = cursor.fetchone()

        if reservation:
            return jsonify(reservation), 200
        else:
            return jsonify({"error": "No reservation found for this contact number."}), 404

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({"error": f"Error retrieving reservation: {str(err)}"}), 500

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == '__main__':
    app.run(port=3000, debug=True)
