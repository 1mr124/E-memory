from FlaskSite.api.v1 import auth, info, topic, search
from flask import Blueprint

# Create a Blueprint instance for the API
bp = Blueprint('api_v1', __name__)

# Import and register blueprints

# Register individual blueprints
bp.register_blueprint(auth.bp)
bp.register_blueprint(info.bp)
bp.register_blueprint(topic.bp)
bp.register_blueprint(search.bp)
