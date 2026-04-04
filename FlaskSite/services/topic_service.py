from FlaskSite.utils.file_utils import allowed_file
from flask import request, current_app
from FlaskSite.models import db, Text, Link, Pic, Info, Topic
from FlaskSite.utils import file_utils
import uuid


def add_topic(user_id, name, parent_id):
    db.session.add(Topic(user_id=user_id, name=name, parent_topic_id=parent_id))
    db.session.commit()


def get_topic(user_id, topic_id):
    return db.session.query(Topic).filter_by(user_id=user_id, id=topic_id).one_or_none()


def get_topics(user_id):
    return db.session.query(Topic).filter_by(user_id=user_id).all()


def get_topic_by_name(user_id, topic_name):
    return (
        db.session.query(Topic)
        .filter_by(user_id=user_id, name=topic_name)
        .one_or_none()
    )


def delete_topic(user_id, topic_id, delete_mode="cascade"):
    """Delete a topic with choice of cascade or promote children.

    Args:
        user_id: The ID of the user
        topic_id: The ID of the topic to delete
        delete_mode: "cascade" or "promote"

    Returns:
        True if successful, None if topic not found.
    """
    topic = (
        db.session.query(Topic).filter_by(id=topic_id, user_id=user_id).one_or_none()
    )
    if topic is None:
        return None

    if delete_mode == "promote":
        return delete_topic_promote(user_id, topic_id)
    else:
        return delete_topic_cascade(user_id, topic_id)


def delete_topic_promote(user_id, topic_id):
    """Delete a topic and promote its children to the parent level.

    Args:
        user_id: The ID of the user
        topic_id: The ID of the topic to delete

    Returns:
        True if successful, None if topic not found.
    """
    topic = (
        db.session.query(Topic).filter_by(id=topic_id, user_id=user_id).one_or_none()
    )
    if topic is None:
        return None

    parent_id = topic.parent_topic_id

    db.session.query(Topic).filter_by(
        parent_topic_id=topic_id, user_id=user_id
    ).update({Topic.parent_topic_id: parent_id})

    db.session.delete(topic)
    db.session.commit()
    return True


def delete_topic_cascade(user_id, topic_id):
    """Delete a topic and all its descendants recursively.

    Args:
        user_id: The ID of the user
        topic_id: The ID of the topic to delete

    Returns:
        True if successful, None if topic not found.
    """
    topic = (
        db.session.query(Topic).filter_by(id=topic_id, user_id=user_id).one_or_none()
    )
    if topic is None:
        return None

    children = db.session.query(Topic).filter_by(
        parent_topic_id=topic_id, user_id=user_id
    ).all()

    for child in children:
        delete_topic_cascade(user_id, child.id)

    db.session.delete(topic)
    db.session.commit()
    return True


def get_breadcrumb_path(user_id, topic_id):
    """Walk the parent chain and return an ordered list of {id, name} ancestors (root-first).

    Args:
        user_id: The ID of the user who owns the topic
        topic_id: The ID of the topic to get the breadcrumb path for

    Returns:
        A list of dicts [{id, name}, ...] from root to the given topic (inclusive).
        Returns an empty list if the topic is not found or doesn't belong to the user.
    """
    topic = db.session.query(Topic).filter_by(id=topic_id, user_id=user_id).one_or_none()
    if topic is None:
        return []

    breadcrumb = []
    current = topic
    while current is not None:
        breadcrumb.append({"id": current.id, "name": current.name})
        current = current.parent

    breadcrumb.reverse()
    return breadcrumb


def has_children(topic):
    """Check if a topic has any child topics or info entries.

    Args:
        topic: The Topic object to check

    Returns:
        True if the topic has child topics or info entries, False otherwise.
    """
    if topic is None:
        return False

    child_topics_count = topic.subtopics.count()
    child_infos_count = db.session.query(Info).filter_by(topic_id=topic.id).count()

    return child_topics_count > 0 or child_infos_count > 0


def get_root_topics(user_id):
    """Get all root topics (topics with no parent) for a user, sorted alphabetically.

    Args:
        user_id: The ID of the user

    Returns:
        A list of Topic objects with parent_topic_id=None, sorted by name.
    """
    return db.session.query(Topic).filter_by(
        user_id=user_id, parent_topic_id=None
    ).order_by(Topic.name).all()


def check_circular_reference(user_id, topic_id, parent_id):
    """Check if assigning parent_id as a parent to topic_id would create a circular reference.

    Args:
        user_id: The ID of the user
        topic_id: The ID of the topic being moved
        parent_id: The ID of the proposed parent (None is allowed — means root)

    Returns:
        True if a circular reference would be created, False otherwise.
    """
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


def move_topic(user_id, topic_id, new_parent_id):
    """Move a topic to a new parent, with validation and circular reference checking.

    Args:
        user_id: The ID of the user
        topic_id: The ID of the topic to move
        new_parent_id: The ID of the new parent topic (None moves to root)

    Returns:
        A dict with 'success' (bool), 'message' (str), and optionally 'error' (str).
    """
    topic = get_topic(user_id, topic_id)
    if topic is None:
        return {"success": False, "error": "Topic not found"}

    if new_parent_id is not None:
        new_parent = get_topic(user_id, new_parent_id)
        if new_parent is None:
            return {"success": False, "error": "New parent topic not found"}

    if check_circular_reference(user_id, topic_id, new_parent_id):
        return {"success": False, "error": "Circular reference detected"}

    topic.parent_topic_id = new_parent_id
    db.session.commit()
    return {"success": True, "message": "Topic moved successfully"}


def get_children(user_id, topic_id):
    """Get child topics and child info entries for a parent topic.

    Args:
        user_id: The ID of the user
        topic_id: The ID of the parent topic

    Returns:
        A dict with 'subtopics' (list of Topic dicts) and 'infos' (list of Info dicts),
        or None if the topic is not found or doesn't belong to the user.
    """
    topic = get_topic(user_id, topic_id)
    if topic is None:
        return None

    subtopics = db.session.query(Topic).filter_by(
        parent_topic_id=topic_id, user_id=user_id
    ).order_by(Topic.name).all()

    infos = db.session.query(Info).filter_by(
        topic_id=topic_id, user_id=user_id
    ).order_by(Info.key).all()

    return {
        "subtopics": subtopics,
        "infos": infos
    }
