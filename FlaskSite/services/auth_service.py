from FlaskSite.models import User, db
from FlaskSite.utils.jwt_helper import generate_token, generate_refresh_token, decode_jwt_token
import datetime

def register(user: User):
    try:
        print(user)
        db.session.add(user)
        db.session.commit()
        return True
    except Exception as e:
        print(f"exception during registration of user: {e}")
        db.session.rollback()
        return False


def login(username, password):
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        access_token = generate_token(user.id)
        refresh_token = generate_refresh_token(user.id)
        return True, access_token, refresh_token
    return False, None, None


def refresh_access_token(refresh_token):
    try:
        # Decode the refresh token
        decoded_token = decode_jwt_token(refresh_token)
        
        # Check if the token is expired 
        exp_timestamp = decoded_token.get("exp")
        
        # Convert it to a datetime object in UTC
        exp_datetime = datetime.datetime.fromtimestamp(exp_timestamp, tz=datetime.timezone.utc)

        current_time = datetime.datetime.now(datetime.timezone.utc)

        if exp_datetime < current_time:
            return False, "Token expired" 
        
        # If token is valid, generate a new access token
        identity = decoded_token.get("sub")
        if not identity:
            return False, "Invalid Token Identity"
        
        new_access_token = generate_token(identity)
        return True, new_access_token
    except Exception as e:
        # To-do log the Exception
        return False, "An error occurred while processing the token"