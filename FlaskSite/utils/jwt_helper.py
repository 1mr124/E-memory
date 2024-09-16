import jwt as pyjwt
from datetime import datetime, timezone, timedelta

# Secret key for encoding and decoding the JWT token
# move it to config.py 
SECRET_KEY = "your_secret_key"


def generate_token(user_id):
    """
    Generates a JWT token with the user_id as payload
    """
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + datetime.datetime.timedelta(hours=1),  # Token expiration
        'iat': datetime.now(timezone.utc)  # Issued at time
    }
    token = pyjwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token


def decode_token(token):
    """
    Decodes a JWT token and returns the payload (user_id)
    """
    try:
        payload = pyjwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except pyjwt.ExpiredSignatureError:
        return "Token expired. Please log in again."
    except pyjwt.InvalidTokenError:
        return "Invalid token. Please log in again."
