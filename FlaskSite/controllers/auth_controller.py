from FlaskSite.services import auth_service
from FlaskSite.models import User
from flask import jsonify,current_app


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
        (valid, token, refresh_token) = auth_service.login(username, password)
        if not valid:
            return (
                jsonify({"message": "Invalid username or password", "token": ""}),
                200,
            )
        # Create a response object
        response = jsonify({"message": "Login successful", "access_token": token})
        secure_cookie = current_app.config['SECURE_COOKIE']

        # Set the refresh token as a secure cookie
        response.set_cookie('refresh_token', refresh_token, httponly=True, secure=secure_cookie, samesite='Lax', path='/')
        return response, 200
    except Exception as e:
        return jsonify({"message": f"An error occurred {e}"}), 500



def refresh_access_token(refresh_token):
    try:
        new_access_token = auth_service.refresh_access_token(refresh_token)
        return jsonify({"message": "Access token refreshed", "access_token": new_access_token}), 200
    except ValueError as e:
        # to-do log {e} errors
        print(e)
        return jsonify({"message": str(e)}), 401  # Unauthorized
    except Exception as e:
        print(e)
        return jsonify({"message": f"An error occurred"}), 500