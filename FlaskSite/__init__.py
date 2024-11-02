import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from FlaskSite.utils.file_utils import writeToFile, createNewFolder, fileExists  # Import utilities
from flask_cors import CORS
from config import config



db = SQLAlchemy()
migrate = Migrate()

def get_config():
    """Determine and retrieve the configuration based on the environment."""
    env = os.environ.get('FLASK_ENV', 'default')  # Default to 'default' if FLASK_ENV is not set Hint: FLASK_ENV=development && flask run
    return config[env]


def createApp():
    app = Flask(__name__)

    # Enable CORS (Adjust as needed)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True) # restrict it to specific origins React deafult clinet 

    # Load configurations based on the environment
    app.config.from_object(get_config())

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    from FlaskSite.api.v1 import bp as api_v1_bp

    app.register_blueprint(api_v1_bp, url_prefix="/api/v1")

    # Ensure database tables are created (use migrations for production)
    with app.app_context():
        # This is typically handled by migrations; use this only for initial setup
        
        # Create uploads folder if it doesn't exist
        uploadsFolder = app.config["IMG_FOLDER"]
        if not fileExists(uploadsFolder):
            createNewFolder(uploadsFolder)

        if not fileExists(
            app.config["SQLALCHEMY_DATABASE_URI"].replace("sqlite:///", "")
        ):
            os.makedirs(
                os.path.dirname(
                    app.config["SQLALCHEMY_DATABASE_URI"].replace(
                        "sqlite:///",
                        "")),
                exist_ok=True,
            )
            db.create_all()

    jwt = JWTManager() # Initialize the JWT manager object, istated of initializing JWTManager twice
    jwt.init_app(app) # Then bind it to the app

    return app
