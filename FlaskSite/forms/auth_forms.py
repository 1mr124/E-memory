from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, EmailField
from wtforms.validators import DataRequired, Length, EqualTo, Email


class LoginForm(FlaskForm):
    class Meta:
        csrf = False

    userName = StringField(
        "Name", validators=[
            DataRequired(), Length(
                min=2, max=40)])
    password = PasswordField("Password", validators=[DataRequired()])
    remember = BooleanField("Remember Me")
    submit = SubmitField("Login")


class RegisterForm(FlaskForm):
    # by passing Meta class with csrf = False, we disable CSRF protection for this form
    class Meta:
        csrf = False

    userName = StringField(
        "Name", validators=[
            DataRequired(), Length(
                min=2, max=40)])
    password = PasswordField("Password", validators=[DataRequired()])
    email = EmailField("Email", validators=[DataRequired(), Email()])
    submit = SubmitField("Sign Up")
