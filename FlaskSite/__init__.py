from flask import Flask
from flask_sqlalchemy import SQLAlchemy
#from flask_migrate import Migrate


app = Flask(__name__)
app.config['SECRET_KEY'] = "HARD TO KNOW"
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////home/mr124/Documents/Projects/E-memory/instance/site.db'

db = SQLAlchemy(app)
#migrate = Migrate(app, db)

# when you first create the db file u opens python and import app,db and type this 
# with app.app_context():
#    db.create_all()

from FlaskSite import routes
