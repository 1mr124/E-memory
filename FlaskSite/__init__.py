from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SECRET_KEY'] = "HARD TO KNOW"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////home/mr124/Documents/E-memory-main/instance/site.db'

db = SQLAlchemy(app)

# when you first create the db file u opens python and import app,db and type this 
# with app.app_context():
#    db.create_all()

from FlaskSite import routes
