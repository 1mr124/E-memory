from flask import Blueprint

# Create a Blueprint instance for the API
bp = Blueprint('api_v1', __name__)

from FlaskSite.api.v1 import auth, main, topic, search

# Register blueprints with the main API blueprint
bp.register_blueprint(auth.bp)
bp.register_blueprint(main.bp)
bp.register_blueprint(topic.bp)
bp.register_blueprint(search.bp)

