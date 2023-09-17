from flask import Flask
from flask_sqlalchemy import SQLAlchemy
#from flask_login import LoginManager
#login_manager = LoginManager()
#login_manager.login_view = 'auth.login'
#def create_app(config_name):
    # ...
#    login_manager.init_app(app)
    # ...

app = Flask(__name__)
app.config['SECRET_KEY'] = "HARD TO KNOW"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////home/mr124/Documents/E-memory-main/instance/site.db'

db = SQLAlchemy(app)
#with app.app_context():
#    db.create_all()

from FlaskSite import routes
