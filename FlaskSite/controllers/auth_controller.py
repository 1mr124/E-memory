from FlaskSite.services import auth_service
from FlaskSite.models import User
from flask import jsonify


def register(username, password, email):
    user = User(username=username, password=password, email=email)
    try:
        if auth_service.register(user):
            return jsonify({"message": "User registered successfully"}), 200
        return jsonify({"message": "Failed to create new user"}), 200
    except Exception as e:
        return jsonify({"message": f"An error occurred {e}"}), 500


def login(username, password):
    try:
        (valid, token) = auth_service.login(username, password)
        if not valid:
            return jsonify(
                {"message": "Invalid username or password", "token": ""}), 200

        return jsonify({"message": "Login successful", "token": token}), 200
    except Exception as e:
        return jsonify({"message": f"An error occurred {e}"}), 500
