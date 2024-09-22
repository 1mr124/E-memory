import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

# from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()


def createDefaultConfig():
    """
        This will generate the config.py file if not found
    """
    with open("FlaskSite/config.py",'w') as f:
        f.write("import os\n")
        f.write("# Default configuration settings\n")
        f.write("DEBUG = False\n")
        f.write("SECRET_KEY = 'Make It Hard'\n")
        f.write("BASE_DIR = os.path.abspath(os.path.dirname(__file__))\n")
        f.write("SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, 'instance', 'site.db')\n")
        f.write("IMG_FOLDER = os.path.join(BASE_DIR, 'instance', 'uploads')\n")



def createApp():
    app = Flask(__name__)

    # Enable CORS (Adjust as needed)
    # CORS(app, resources={r"/*": {"origins": "*"}})

    # Load configurations
    if not os.path.exists('config.py'):
        createDefaultConfig()
        print(f"config.py created with default settings.")

    app.config.from_pyfile("config.py")

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
        os.makedirs(uploadsFolder, exist_ok=True)
        
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

    jwt = JWTManager(app)
    jwt.init_app(app)

    return app
