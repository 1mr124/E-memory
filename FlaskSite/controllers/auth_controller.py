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
        # Set the refresh token as a secure cookie should be: response.set_cookie('refresh_token', refresh_token, httponly=True, secure=secure_cookie, samesite='None', path='/')
        if secure_cookie:
                response.set_cookie(
                'refresh_token',
                refresh_token,
                httponly=True,
                secure=secure_cookie,  # Enforces HTTPS in production
                samesite='None' if secure_cookie else 'Lax',  # Use 'None' for cross-site requests in production
                path='/'
            )
            
        response.set_cookie('refresh_token', refresh_token)
        return response, 200
    except Exception as e:
        return jsonify({"message": f"An error occurred {e}"}), 500



def refresh_access_token(refresh_token):
    try:
        success, result = auth_service.refresh_access_token(refresh_token)
        if not success:
            if result == "Token expired":
                # Clear the expired refresh token in the response
                response = jsonify({"message": "Refresh token expired"})
                response.status_code = 401
                response.delete_cookie('refresh_token')  # Optional: clear cookie if used
                return response
            else:
                return jsonify({"message": result}), 401  # Other token-related errors

        # Return the new access token
        return jsonify({"message": "Access token refreshed", "access_token": result}), 200
    except Exception as e:
        # to-do mvoe Log the exception for debugging and return a generic error message
        return jsonify({"message": "An error occurred"}), 500
