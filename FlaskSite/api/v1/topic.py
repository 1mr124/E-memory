from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from FlaskSite.controllers.topic_controller import (
    add_new_topic,
    get_all_topics,
    delete_topic as delete_topic_controller,
    get_root_topics as get_root_topics_controller,
    move_topic as move_topic_controller,
    get_topic_children as get_topic_children_controller,
    get_breadcrumb as get_breadcrumb_controller,
)
from FlaskSite.forms import NewTopic
from FlaskSite.models import db, Topic, SearchKey, Info


bp = Blueprint("topic", __name__)


@bp.route("/topic/create", methods=["POST"])
@jwt_required()
def create_topic():
    user_id = get_jwt_identity()
    json = request.get_json()

    title = format_text(json["title"])
    parent_id = format_text(json["parent"])

    return add_new_topic(user_id=user_id, title=title, parent_id=parent_id)


@bp.route("/topic/all", methods=["GET"])
@jwt_required()
def get_topics():
    user_id = get_jwt_identity()
    return get_all_topics(user_id=user_id)


@bp.route("/delete", methods=["POST"])
@jwt_required()
def delete_topic():
    user_id = get_jwt_identity()
    json_data = request.get_json()
    topic_id = json_data.get("topic_id")
    delete_mode = json_data.get("delete_mode", "cascade")
    return delete_topic_controller(
        user_id=user_id, topic_id=topic_id, delete_mode=delete_mode
    )


@bp.route("/search", methods=["POST"])
def search_topic():
    """Handle topic search."""
    search_topic_name = request.json.get("search_topic")
    topic = Topic.query.filter_by(name=search_topic_name).first()

    if topic:
        topic_id = topic.id
        search_keys = [i.key for i in SearchKey.query.all()]
        all_info = Info.query.filter_by(topic_id=topic_id).all()
        info_list = [
            {"id": info.id, "data": info.data} for info in all_info
        ]  # Adjust based on Info model fields
        return jsonify({"info": info_list, "search_keys": search_keys}), 200
    else:
        return jsonify({"message": "Topic not found"}), 404


@bp.route("/topic/roots", methods=["GET"])
@jwt_required()
def get_root_topics():
    """Get all root topics for the current user."""
    user_id = get_jwt_identity()
    return get_root_topics_controller(user_id=user_id)


@bp.route("/topic/<int:topic_id>/move", methods=["PUT"])
@jwt_required()
def move_topic(topic_id):
    """Move a topic to a new parent."""
    user_id = get_jwt_identity()
    json_data = request.get_json()
    new_parent_id = json_data.get("new_parent_id")

    return move_topic_controller(
        user_id=user_id, topic_id=topic_id, new_parent_id=new_parent_id
    )


@bp.route("/topic/<int:topic_id>/children", methods=["GET"])
@jwt_required()
def get_topic_children(topic_id):
    """Get children (subtopics and infos) for a topic."""
    user_id = get_jwt_identity()
    return get_topic_children_controller(user_id=user_id, topic_id=topic_id)


@bp.route("/topic/<int:topic_id>/breadcrumb", methods=["GET"])
@jwt_required()
def get_breadcrumb(topic_id):
    """Get breadcrumb path for a topic."""
    user_id = get_jwt_identity()
    return get_breadcrumb_controller(user_id=user_id, topic_id=topic_id)


def format_text(text):
    if text is None:
        return None
    text = str(text).strip()
    if text == "":
        text = None
    return text
