from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired, Length, EqualTo

class LoginForm(FlaskForm):
    UserName = StringField('Email', validators=[DataRequired()])
    Pass = PasswordField('Password', validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')

class RegisterForm(FlaskForm):
    UserName = StringField('Name', validators=[DataRequired(), Length(min=2, max=40)])
    Password = PasswordField("Password", validators=[DataRequired()])
    RepeatPassword = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('Password')])
    submit = SubmitField('Sign Up')
