import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS


db = SQLAlchemy()
migrate = Migrate()

def createApp():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes


    # Load configurations
    app.config.from_pyfile('config.py')  # Load sensitive configurations from a separate file
    app.config['IMG_FOLDER'] = '/static/Files/imgs/'

    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    from FlaskSite.api.v1 import bp as api_v1_bp
    app.register_blueprint(api_v1_bp, url_prefix='/api/v1')

    
    # Ensure database tables are created (use migrations for production)
    with app.app_context():
        if not os.path.exists(app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', '')):
            print(app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', ''))
            db.create_all()

    return app