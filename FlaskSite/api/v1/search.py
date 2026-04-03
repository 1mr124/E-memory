from flask import Blueprint, jsonify, request, abort
import logging
from FlaskSite.controllers import info_controller
from flask_jwt_extended import get_jwt_identity,jwt_required

logger = logging.getLogger(__name__)
bp = Blueprint('search', __name__)


@bp.route('/search', methods=['GET'])
@jwt_required()
def search():
    """Handle search operations."""
    # Extract query parameters
    search_key = request.args.get('searchKey')  # Ensure the query parameter matches what you're sending from the frontend
    user_id = get_jwt_identity()

    if not search_key or not user_id:
        return jsonify({'error': 'searchKey and user_id are required'}), 400

    # Call the controller to get the result
    try:
        result = info_controller.get_info(search_key, user_id)
        logger.debug(f"search endpoint found {len(result)} results for search_key={search_key}")

        return jsonify(result), 200  # Return the result (empty list if no results found)
        
    except Exception as e:
        # Handle unexpected errors
        return jsonify({'error': str(e)}), 500
