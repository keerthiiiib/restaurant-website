from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
CORS(app)

# MySQL connection configuration
db_config = {
    'host': 'localhost',
    'user': 'root',  # your MySQL username
    'password': 'keerthilbangera',  # your MySQL password
    'database': 'restaurant_db'  # your database name
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
        print(f"Error: {err}")  # Print the detailed error
        return jsonify({"error": f"Error retrieving reservation: {str(err)}"}), 500

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()
            
                 
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

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"success": False, "message": "Username and password are required"}), 400

    try:
        connection = create_connection()
        if connection is None:
            return jsonify({"success": False, "message": "Could not connect to the database"}), 500

        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM users WHERE username = %s AND password = %s"
        cursor.execute(query, (username, password))
        user = cursor.fetchone()

        if user:
            return jsonify({"success": True, "message": "Login successful"})
        else:
            return jsonify({"success": False, "message": "Invalid username or password"}), 401

    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return jsonify({"success": False, "message": "An error occurred"}), 500

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()

            
if __name__ == '__main__':
    app.run(port=3000, debug=True)
