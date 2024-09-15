from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField, EmailField
from wtforms.validators import DataRequired, Length, EqualTo, Email


class LoginForm(FlaskForm):
    userName = StringField('Name', validators=[DataRequired(), Length(min=2, max=40)])
    password = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')


class RegisterForm(FlaskForm):
    userName = StringField('Name', validators=[DataRequired(), Length(min=2, max=40)])
    password = PasswordField("Password", validators=[DataRequired()])
    repeatPassword = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('Password')])
    email = EmailField('Email', validators=[DataRequired(), Email()])
    submit = SubmitField('Sign Up')
