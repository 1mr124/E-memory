from flask import Blueprint, jsonify, request, current_app, abort
from werkzeug.utils import secure_filename
from datetime import datetime
from FlaskSite.models import db, Text, Link, Pic, Info, Topic, SearchKey

bp = Blueprint('main', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'txt', 'py'}

def allowed_file(filename):
    """Check if a file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def store_text(info, texts):
    """Store text data in the database."""
    try:
        for text_data in texts:
            text = Text(
                text=text_data['text'],
                header=text_data.get('header'),
                comment=text_data.get('comment'),
                info_id=info.id
            )
            db.session.add(text)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        print(f"Error storing text: {e}")
        return False

def store_link(info, links):
    """Store link data in the database."""
    try:
        for link_data in links:
            link = Link(
                path=link_data['url'],
                header=link_data.get('header'),
                comment=link_data.get('comment'),
                info_id=info.id
            )
            db.session.add(link)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        print(f"Error storing link: {e}")
        return False

def store_pic(info, files):
    """Store picture data and save the files."""
    try:
        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filename = f"{info.key}-{datetime.now().strftime('%Y%m%d%H%M%S')}{filename[filename.rfind('.'):]}".replace(" ", "")
                file.save(current_app.root_path + current_app.config['IMG_FOLDER'] + filename)
                pic = Pic(
                    path=filename,
                    header=request.form.get("Pic-Head"),
                    comment=request.form.get("Pic-Comment"),
                    info_id=info.id
                )
                db.session.add(pic)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        print(f"Error storing picture: {e}")
        return False

def store_key(to_store_key):
    """Store a key in the database if it does not exist."""
    if not SearchKey.query.filter_by(key=to_store_key).first():
        key = SearchKey(key=to_store_key)
        db.session.add(key)
        db.session.commit()
    return True

@bp.route('/info', methods=['POST'])
def create_info():
    """Handle form submission for creating new info."""
    data = request.json
    texts = data.get('texts', [])
    links = data.get('links', [])
    files = request.files.getlist("Pic-File")

    try:
        info = Info()  # Create a new Info instance
        db.session.add(info)

        if store_text(info, texts) and store_link(info, links) and store_pic(info, files):
            db.session.commit()
            return jsonify({"message": "Info created successfully"}), 201
        else:
            return jsonify({"message": "Failed to create info"}), 500
    except Exception as e:
        db.session.rollback()
        print(f"Error handling form submission: {e}")
        return jsonify({"message": "Internal server error"}), 500

@bp.route('/info', methods=['GET'])
def get_info():
    """Retrieve information from the database."""
    try:
        info_list = Info.query.all()
        result = [
            {
                'id': info.id,
                'key': info.key,
                # Add other fields as needed
                'texts': [{'text': text.text, 'header': text.header, 'comment': text.comment} for text in info.texts],
                'links': [{'url': link.path, 'header': link.header, 'comment': link.comment} for link in info.links],
                'pics': [{'picPath': pic.path, 'picHead': pic.header, 'picComment': pic.comment} for pic in info.pics]
            }
            for info in info_list
        ]
        return jsonify(result), 200
    except Exception as e:
        print(f"Error fetching info: {e}")
        return jsonify({"message": "Internal server error"}), 500

@bp.route('/home', methods=['GET'])
def home():
    """Render the home page."""
    return jsonify({"message": "Welcome to the home page"}), 200
