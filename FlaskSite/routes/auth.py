from flask import Blueprint, render_template, redirect, request, url_for, flash

authBp = Blueprint('auth', __name__)

@authBp.route('/register', methods=['GET', 'POST'])
def register():
    """Handle user registration."""
    from FlaskSite.forms import RegisterForm  # Import inside the function to avoid circular imports
    from FlaskSite.models import db, User     # Import inside the function to avoid circular imports

    form = RegisterForm()

    if form.validate_on_submit():
        user = User(username=form.UserName.data, email=form.Email.data)
        user.set_password(form.Password.data)
        db.session.add(user)
        try:
            db.session.commit()
            return render_template("success.html", title="Welcome", type="success")
        except Exception as e:
            print(e)
            return render_template("success.html", title="Error", type="error")
    else:
        if form.errors:
            flash("Form Error", form.errors)

    return render_template('register.html', title='Register', form=form)

@authBp.route('/login', methods=['GET', 'POST'])
def login():
    """Handle user login."""
    from FlaskSite.forms import LoginForm  # Import inside the function to avoid circular imports
    from FlaskSite.models import User      # Import inside the function to avoid circular imports

    form = LoginForm()

    if form.validate_on_submit():
        username = form.UserName.data
        password = form.Pass.data
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            return redirect(url_for("main.info_page"))
        else:
            return render_template("success.html", title="Error", type="error")

    return render_template("login.html", title="Login", form=form)
