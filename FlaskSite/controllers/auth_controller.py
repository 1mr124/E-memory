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
        success, result = auth_service.refresh_access_token(refresh_token)
        
        if not success:
            if result == "Token expired":
                return jsonify({"message": "Refresh token expired"}), 401  
            else:
                return jsonify({"message": result}), 401  # Other token-related errors

        # Return the new access token
        return jsonify({"message": "Access token refreshed", "access_token": result}), 200
    except Exception as e:
        # Log the exception for debugging and return a generic error message
        print(e)
        return jsonify({"message": "An error occurred"}), 500
