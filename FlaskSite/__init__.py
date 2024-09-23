import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from FlaskSite.utils.file_utils import writeToFile, createNewFolder  # Import utilities


# from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()


def createApp():
    app = Flask(__name__)

    # Enable CORS (Adjust as needed)
    # CORS(app, resources={r"/*": {"origins": "*"}})

    configPath = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'config.py')
    # Load configurations
    if not os.path.exists(configPath):
        print("config is not found")
        content = (
        "import os\n"
        "# Default configuration settings\n"
        "DEBUG = False\n"
        "SECRET_KEY = 'Make It Hard'\n"
        "BASE_DIR = os.path.abspath(os.path.dirname(__file__))\n"
        "SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'instance', 'site.db')\n"
        "IMG_FOLDER = os.path.join(BASE_DIR, 'instance', 'uploads')\n"
            )
        
        writeToFile(configPath, content)
        print(f"config.py created with default settings.")

    app.config.from_pyfile(configPath)

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
        if not os.path.exists(uploadsFolder):
            createNewFolder(uploadsFolder)

        if not os.path.exists(
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
