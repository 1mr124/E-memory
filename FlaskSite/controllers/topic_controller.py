from flask import jsonify
import logging

from FlaskSite.services.topic_service import (
    get_topic,
    add_topic,
    get_topic_by_name,
    get_topics,
    delete_topic as delete_topic_service,
)

logger = logging.getLogger(__name__)


def check_circular_reference(user_id, topic_id, parent_id):
    if parent_id is None:
        return False
    visited = set()
    current_id = parent_id
    while current_id is not None:
        if current_id == topic_id:
            return True
        if current_id in visited:
            break
        visited.add(current_id)
        parent_topic = get_topic(user_id, current_id)
        if parent_topic is None:
            break
        current_id = parent_topic.parent_topic_id
    return False


def add_new_topic(user_id, title, parent_id):
    try:
        logger.debug(
            f"add new topic with user: {user_id}, title: {title}, parent_id: {parent_id}"
        )
        if title is None:
            logger.debug("Title is required")
            return jsonify({"error": "Title is required"}), 400
        if get_topic_by_name(user_id, title) is not None:
            logger.debug(f"title {title} already exists")
            return jsonify({"error": "Title already exists"}), 400

        if parent_id is not None and get_topic(user_id, parent_id) is None:
            logger.debug(f"parent {parent_id} for user_id {user_id} does not exist")
            return jsonify({"error": "parent topic does not exist"}), 400

        if check_circular_reference(user_id, None, parent_id):
            return jsonify({"error": "Circular reference detected"}), 400

        add_topic(user_id, title, parent_id)
        topic = get_topic_by_name(user_id, title)
        logger.debug(f"topic {topic} added")
        return jsonify({"message": "topic created"}), 201
    except Exception as e:
        logger.error(f"exception during add new topic: {e}")
        return jsonify({"error": "failed to insert new topic"}), 500


def get_all_topics(user_id):
    try:
        logger.debug(f"get all topics for user: {user_id}")
        topics_list = [
            {"id": topic.id, "title": topic.name} for topic in get_topics(user_id)
        ]
        return jsonify({"topics": topics_list}), 200
    except Exception as e:
        logger.error(f"exception during get all topics: {e}")
        return jsonify({"error": "failed to get topics"}), 500


def delete_topic(user_id, topic_id):
    try:
        logger.debug(f"delete topic {topic_id} for user {user_id}")
        result = delete_topic_service(user_id, topic_id)
        if result is None:
            return jsonify({"message": "Topic not found"}), 404
        return jsonify({"message": "Topic deleted successfully"}), 200
    except Exception as e:
        logger.error(f"exception during delete topic: {e}")
        return jsonify({"error": "failed to delete topic"}), 500
