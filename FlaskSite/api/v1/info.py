from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename
from datetime import datetime, timezone
from FlaskSite.models import db, Text, Link, Pic, Info
import os,json
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from FlaskSite.controllers import info_controller

bp = Blueprint('main', __name__)


@bp.route('/info', methods=['POST'])
@jwt_required()
def create_info():
    try:
        user_id = get_jwt_identity()
        texts = json.loads(request.form.get('texts', '[]'))
        links = json.loads(request.form.get('links', '[]'))
        files = request.files.getlist('Pic-File')
        search_key = request.form.get('key')
        topic_id = request.form.get('topic_id')
        if search_key is None:
            return jsonify({"message": "Key is required"}), 400

        if info_controller.create_info(user_id, search_key, topic_id, texts, links, files):
            return jsonify({"message": "Info created successfully"}), 200
        return jsonify({"message": "Failed to create info"}), 200
    except Exception as e:
        return jsonify({"message": f"Failed to create info due to {e}"}), 500


@bp.route('/info', methods=['GET'])
@jwt_required()
def get_info():
    """Retrieve info from the database based on a search key."""
    searchKey = request.args.get('key')  # Get the search key from query parameters

    if not searchKey:
        return jsonify({"message": "Search key is required"}), 400

    try:
        # Query info objects that match the search key
        info_list = Info.query.filter(Info.key.ilike(f"%{searchKey}%")).all()

        # Prepare the response data
        result = [
            {
                'id': info.id,
                'key': info.key,
                'texts': [{'text': text.text, 'header': text.header, 'comment': text.comment} for text in info.texts],
                'links': [{'path': link.path, 'header': link.header, 'comment': link.comment} for link in info.links],
                'pics': [{'path': pic.path, 'header': pic.header, 'comment': pic.comment} for pic in info.pics]
            }
            for info in info_list
        ]

        # Return the result as JSON
        return jsonify(result), 200
    
    except Exception as e:
        # Handle errors
        print(f"Error searching info by key: {e}")
        return jsonify({"message": "Internal server error"}), 500
