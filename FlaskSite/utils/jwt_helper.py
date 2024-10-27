from flask_jwt_extended import create_access_token, create_refresh_token


def generate_token(user_id):
    access_token = create_access_token(identity=user_id)
    return access_token

def generate_refresh_token(user_id):
    return create_refresh_token(identity=user_id)