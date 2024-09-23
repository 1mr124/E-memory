import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()


def createApp():
    app = Flask(__name__)

    # Enable CORS (Adjust as needed)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}) # restrict it to specific origins React deafult clinet 

    # Load configurations
    app.config.from_pyfile("config.py")

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    from FlaskSite.api.v1 import bp as api_v1_bp

    app.register_blueprint(api_v1_bp, url_prefix="/api/v1")

    # Ensure database tables are created (use migrations for production)
    with app.app_context():
        # This is typically handled by migrations; use this only for initial
        # setup
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
