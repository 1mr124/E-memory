from flask import jsonify
import logging

from FlaskSite.services.topic_service import (
    get_topic,
    add_topic,
    get_topic_by_name,
    get_topics,
    delete_topic as delete_topic_service,
    get_root_topics as get_root_topics_service,
    move_topic as move_topic_service,
    has_children,
    get_children as get_children_service,
    get_breadcrumb_path,
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

        if parent_id is not None:
            try:
                parent_id = int(parent_id)
            except (ValueError, TypeError):
                logger.debug(f"invalid parent_id: {parent_id}")
                return jsonify({"error": "Invalid parent topic ID"}), 400
            if get_topic(user_id, parent_id) is None:
                logger.debug(f"parent {parent_id} for user_id {user_id} does not exist")
                return jsonify({"error": "parent topic does not exist"}), 400
            if check_circular_reference(user_id, None, parent_id):
                return jsonify({"error": "Circular reference detected"}), 400

        add_topic(user_id, title, int(parent_id) if parent_id is not None else None)
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


def delete_topic(user_id, topic_id, delete_mode="cascade"):
    try:
        logger.debug(
            f"delete topic {topic_id} for user {user_id} with mode {delete_mode}"
        )
        result = delete_topic_service(user_id, topic_id, delete_mode)
        if result is None:
            return jsonify({"message": "Topic not found"}), 404
        return jsonify({"message": "Topic deleted successfully"}), 200
    except Exception as e:
        logger.error(f"exception during delete topic: {e}")
        return jsonify({"error": "failed to delete topic"}), 500


def get_root_topics(user_id):
    """Get all root topics for a user, with has_children flag."""
    try:
        logger.debug(f"get root topics for user: {user_id}")
        root_topics = get_root_topics_service(user_id)
        topics_list = [
            {"id": topic.id, "name": topic.name, "has_children": has_children(topic)}
            for topic in root_topics
        ]
        return jsonify({"topics": topics_list}), 200
    except Exception as e:
        logger.error(f"exception during get root topics: {e}")
        return jsonify({"error": "failed to get root topics"}), 500


def move_topic(user_id, topic_id, new_parent_id):
    """Move a topic to a new parent with validation."""
    try:
        logger.debug(
            f"move topic {topic_id} to parent {new_parent_id} for user {user_id}"
        )
        result = move_topic_service(user_id, topic_id, new_parent_id)

        if not result["success"]:
            if "Circular reference" in result.get("error", ""):
                return jsonify({"error": result["error"]}), 400
            return jsonify({"error": result["error"]}), 404

        return jsonify({"message": result["message"]}), 200
    except Exception as e:
        logger.error(f"exception during move topic: {e}")
        return jsonify({"error": "failed to move topic"}), 500


def get_topic_children(user_id, topic_id):
    """Get children (subtopics and infos) for a topic with breadcrumb."""
    try:
        logger.debug(f"get children for topic {topic_id} for user {user_id}")
        topic = get_topic(user_id, topic_id)
        if topic is None:
            return jsonify({"error": "Topic not found"}), 404

        children = get_children_service(user_id, topic_id)
        if children is None:
            return jsonify({"error": "Topic not found"}), 404

        breadcrumb = get_breadcrumb_path(user_id, topic_id)

        subtopics_list = [
            {"id": st.id, "name": st.name, "has_children": has_children(st)}
            for st in children["subtopics"]
        ]

        infos_list = [{"id": info.id, "key": info.key} for info in children["infos"]]

        response = {
            "topic": {"id": topic.id, "name": topic.name},
            "breadcrumb": breadcrumb,
            "subtopics": subtopics_list,
            "infos": infos_list,
        }

        return jsonify(response), 200
    except Exception as e:
        logger.error(f"exception during get topic children: {e}")
        return jsonify({"error": "failed to get topic children"}), 500


def get_breadcrumb(user_id, topic_id):
    """Get breadcrumb path for a topic."""
    try:
        logger.debug(f"get breadcrumb for topic {topic_id} for user {user_id}")
        topic = get_topic(user_id, topic_id)
        if topic is None:
            return jsonify({"error": "Topic not found"}), 404

        breadcrumb = get_breadcrumb_path(user_id, topic_id)
        return jsonify({"breadcrumb": breadcrumb}), 200
    except Exception as e:
        logger.error(f"exception during get breadcrumb: {e}")
        return jsonify({"error": "failed to get breadcrumb"}), 500
