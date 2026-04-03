from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename
from datetime import datetime, timezone
from FlaskSite.models import db, Text, Link, Pic, Info
import os
import json
import logging
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from FlaskSite.controllers import info_controller

logger = logging.getLogger(__name__)

bp = Blueprint("main", __name__)


@bp.route("/info", methods=["POST"])
@jwt_required()
def create_info():
    user_id = get_jwt_identity()
    texts = json.loads(request.form.get("texts", "[]"))
    links = json.loads(request.form.get("links", "[]"))
    files = request.files.getlist("Pic-File")
    search_key = request.form.get("key")
    topic_id = request.form.get("topic_id")

    return info_controller.create_info(
        user_id, search_key, topic_id, texts, links, files
    )


@bp.route("/info", methods=["GET"])
@jwt_required()
def get_info():
    """Retrieve info from the database based on a search key."""
    user_id = get_jwt_identity()
    search_key = request.args.get("key")  # Get the search key from query parameters

    if search_key is None:
        return jsonify({"message": "Search key is required"}), 400

    try:
        result = info_controller.get_info(search_key, user_id)
        return jsonify(result), 200

    except Exception as e:
        # Handle errors
        logger.error(f"Error searching info by key: {e}")
        return jsonify({"message": "Internal server error"}), 500


@bp.route("/info/<int:info_id>", methods=["PUT"])
@jwt_required()
def update_info(info_id):
    user_id = get_jwt_identity()
    texts = (
        json.loads(request.form.get("texts", "[]"))
        if request.form.get("texts")
        else None
    )
    links = (
        json.loads(request.form.get("links", "[]"))
        if request.form.get("links")
        else None
    )
    files = request.files.getlist("Pic-File") if request.files else None
    key = request.form.get("key")

    return info_controller.update_info(info_id, user_id, key, texts, links, files)


@bp.route("/info/<int:info_id>", methods=["DELETE"])
@jwt_required()
def delete_info(info_id):
    user_id = get_jwt_identity()
    return info_controller.delete_info(info_id, user_id)
