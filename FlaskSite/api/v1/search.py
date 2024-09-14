from flask import Blueprint, jsonify, request, abort
from FlaskSite.models import db, Info, SearchKey

bp = Blueprint('search', __name__)

@bp.route('/search', methods=['GET'])
def search():
    """Handle search operations."""
    search_key = request.args.get("searchKey")
    
    if search_key:
        all_info = Info.query.filter_by(key=search_key).all()
        search_keys = [key.key for key in SearchKey.query.all()]
        return jsonify({
            "all_info": [info.to_dict() for info in all_info],
            "search_keys": search_keys
        }), 200
    else:
        abort(400, description="Search key is required")

@bp.route('/edit', methods=['POST'])
def edit_info():
    """Handle edit operations."""
    data = request.json
    edit_id = data.get("infoId")
    edit_text = data.get("textTextData")

    if edit_id and edit_text:
        info = Info.query.get(edit_id)
        if info:
            info.texts[0].text = edit_text
            db.session.commit()
            return jsonify({"message": "Info updated successfully"}), 200
        else:
            return jsonify({"message": "Info not found"}), 404
    else:
        abort(400, description="Info ID and text are required")
