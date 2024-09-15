from FlaskSite.utils import jwt_helper
from FlaskSite.models import User, db
from FlaskSite.utils.jwt_helper import generate_token


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
        return True, generate_token(user.id)
    return False, None
