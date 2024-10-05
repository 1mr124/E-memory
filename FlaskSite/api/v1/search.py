from flask import Blueprint, jsonify, request, abort
from FlaskSite.controllers import info_controller
from flask_jwt_extended import get_jwt_identity

bp = Blueprint('search', __name__)


@bp.route('/search', methods=['GET'])
def search():
    """Handle search operations."""
    # Extract query parameters
    search_key = request.args.get('search_key')
    user_id = get_jwt_identity()

    print(search_key,user_id)
    input("stoped")

    if not search_key or not user_id:
        return jsonify({'error': 'search_key and user_id are required'}), 400

    # Call the controller to get the result
    try:
        result = info_controller.get_info(search_key, user_id)
        if not result:
            return jsonify({'message': 'No results found'}), 404
        return jsonify(result), 200
    except Exception as e:
        # Handle unexpected errors
        return jsonify({'error': str(e)}), 500