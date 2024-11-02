from flask import jsonify

from FlaskSite.services.topic_service import get_topic, add_topic, get_topic_by_name


def add_new_topic(user_id, title, parent_id):
    try:
        print(f'add new topic with user: {user_id}, title: {title}, parent_id: {parent_id}')
        if title is None:
            print ("Title is required")
            return jsonify({"error": "Title is required"}), 400
        if get_topic_by_name(user_id, title) is not None:
            print(f'title {title} already exists')
            return jsonify({"error": "Title already exists"}), 400

        if parent_id is not None and get_topic(user_id, parent_id) is None:
            print(f'parent {parent_id} for user_id {user_id} does not exist')
            # we can set parent id to None and continue, but the user won't know what happen
            # print(f'set parent_id to None')
            # parent_id = None
            return jsonify({"error": "parent_id does not exist"}), 400

        add_topic(user_id, title, parent_id)
        topic = get_topic_by_name(user_id, title)
        print(f'topic {topic} added')
        return jsonify({"Message": "topic created"}), 201
    except Exception as e:
        print(f'exception during add new topic: {e}')
        return jsonify({"error": "failed to insert new topic"}), 400
