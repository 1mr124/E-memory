from flask import Blueprint, jsonify, request
from FlaskSite.forms import NewTopic
from FlaskSite.models import db, Topic, SearchKey, Info

bp = Blueprint('topic', __name__)


@bp.route('/topic/create', methods=['POST'])
def create_topic():
    data = request.get_json()

    # Validate data
    if not data or 'title' not in data or 'parent' not in data:
        return jsonify({"error": "Title and parent fields are required"}), 400

    title = data['title']
    parent = data['parent']

    try:
        # Assume we have a function `add_topic_to_db` to handle database logic
        print("Topic added",title,"Parent: ",parent)
        return jsonify({
            "message": "Topic added successfully",
        }), 201
    except Exception as e:
        print(f"Error adding topic to database: {e}")
        return jsonify({"error": "Failed to add topic"}), 500


@bp.route('/delete', methods=['POST'])
def delete_topic():
    """Handle topic deletion."""
    topic_id = request.json.get('topic_id')
    topic_to_delete = Topic.query.get(topic_id)

    if topic_to_delete:
        db.session.delete(topic_to_delete)
        try:
            db.session.commit()
            return jsonify({"message": "Topic deleted successfully"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "An error occurred"}), 500
    else:
        return jsonify({"message": "Topic not found"}), 404


@bp.route('/search', methods=['POST'])
def search_topic():
    """Handle topic search."""
    search_topic_name = request.json.get('search_topic')
    topic = Topic.query.filter_by(name=search_topic_name).first()

    if topic:
        topic_id = topic.id
        search_keys = [i.key for i in SearchKey.query.all()]
        all_info = Info.query.filter_by(topic_id=topic_id).all()
        info_list = [{"id": info.id, "data": info.data}
                     for info in all_info]  # Adjust based on Info model fields
        return jsonify({"info": info_list, "search_keys": search_keys}), 200
    else:
        return jsonify({"message": "Topic not found"}), 404
