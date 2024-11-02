from flask import Blueprint, jsonify, request
from FlaskSite.forms import RegisterForm, LoginForm
from FlaskSite.controllers import auth_controller
bp = Blueprint('auth', __name__)


@bp.route('/register', methods=['POST'])
def register():
    # todo add form validation
    # if not form.validate():
    #    return jsonify({"errors": form.errors}), 400

    form = RegisterForm(request.form)
    username = form.userName.data
    password = form.password.data
    email = form.email.data
    return auth_controller.register(username, password, email)


@bp.route('/login', methods=['POST'])
def login():
    form = LoginForm(request.form)
    # todo add form validation
    # if not form.validate():
    #    return jsonify({"errors": form.errors}), 400

    username = form.userName.data
    password = form.password.data
    return auth_controller.login(username, password)



@bp.route('/auth/refresh', methods=['POST'])
def refresh_token():
    # validate if the cookie has the refresh token
    refresh_token = request.cookies.get('refresh_token')

    if not refresh_token:
        return jsonify({"msg": "Missing refresh token"}), 401

    return auth_controller.refresh_access_token(refresh_token)
