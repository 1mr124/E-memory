from flask import Blueprint, jsonify, request, flash
from FlaskSite.forms import RegisterForm, LoginForm
from FlaskSite.models import db, User

bp = Blueprint('auth', __name__)

@bp.route('/register', methods=['POST'])
def register():
    """Handle user registration."""
    form = RegisterForm(request.json)

    if form.validate():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        try:
            db.session.commit()
            return jsonify({"message": "User registered successfully"}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "An error occurred"}), 500
    else:
        return jsonify({"errors": form.errors}), 400

@bp.route('/login', methods=['POST'])
def login():
    """Handle user login."""
    form = LoginForm(request.json)

    if form.validate():
        username = form.username.data
        password = form.password.data
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            # Consider using JWT tokens for authentication
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"message": "Invalid username or password"}), 401
    else:
        return jsonify({"errors": form.errors}), 400
