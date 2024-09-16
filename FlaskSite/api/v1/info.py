from flask import Blueprint, jsonify, request, current_app
from werkzeug.utils import secure_filename
from datetime import datetime, timezone
from FlaskSite.models import db, Text, Link, Pic, Info
import os,json

bp = Blueprint('main', __name__)


class StorageManager:
    def __init__(self, dbSession):
        '''Manage info operations.'''
        self.dbSession = dbSession

    def storeItems(self, items, dbModelClass, infoId):
        """ 
            Store generic items in the database. DRY
        """
        try:
            for itemData in items:
                # Create the database item with the given data
                item = dbModelClass(
                    **{key: itemData.get(key) for key in dbModelClass.__table__.columns.keys() if key in itemData},
                    info_id=infoId
                )
                self.dbSession.add(item)
                
            self.dbSession.commit()
            return True
        except Exception as e:
            self.dbSession.rollback()
            print(f"Error storing items: {e}")
            return False


class InfoManager:
    def __init__(self, dbSession):
        '''Uses the StorageManager to handle Text, Link, and Pic storing operations.'''
        self.dbSession = dbSession
        self.storageManager = StorageManager(dbSession)
    
    def storeText(self, info, texts):
        """Store text data with headers and comments."""
        items = []
        for text_data in texts:
            item = {
                'text': text_data.get('text'),
                'header': text_data.get('header'),
                'comment': text_data.get('comment')
            }
            items.append(item)
        
        return self.storageManager.storeItems(items, Text, info.id)

    def storeLink(self, info, links):
        """Store link data with headers and comments."""
        items = []
        for link_data in links:
            item = {
                'path': link_data.get('url'),
                'header': link_data.get('header'),
                'comment': link_data.get('comment')
            }
            items.append(item)
        
        return self.storageManager.storeItems(items, Link, info.id)


    def allowed_file(self, filename):
        """Check if a file has an allowed extension."""
        ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp'}
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
    
    def storePic(self, info, files):
        """Store picture data and save the files."""
        try:
            items = []
            for file in files:
                if file and self.allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    filename = f"{info.key}-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}{filename[filename.rfind('.'):]}".replace(" ", "")
                    # Construct the absolute file path
                    file_path = os.path.join(current_app.root_path, current_app.config['IMG_FOLDER'], filename)
                
                    # Ensure the directory exists
                    os.makedirs(os.path.dirname(file_path), exist_ok=True)
                    
                    # Save the file
                    file.save(file_path)
                    item = {
                        'path': filename,
                        'header': request.form.get("Pic-Head"),
                        'comment': request.form.get("Pic-Comment")
                    }
                    items.append(item)

            return self.storageManager.storeItems(items, Pic, info.id)

        except Exception as e:
            self.dbSession.rollback()
            print(f"Error storing picture: {e}")
            return False




@bp.route('/info', methods=['POST'])
def createInfo():
    """Handle form submission for creating new info."""
    try:
        # Extract form data
        texts = json.loads(request.form.get('texts', '[]'))  # Read and parse JSON-formatted texts
        links = json.loads(request.form.get('links', '[]'))  # Read and parse JSON-formatted links
        files = request.files.getlist('Pic-File')  # Read file uploads
        
        # Extract other required fields
        key = request.form.get('key')
        topic_id = request.form.get('topic_id')
        user_id = request.form.get('user_id')
        
        if not key:
            return jsonify({"message": "Key is required"}), 400
        
        # Check for existing Info with the same key in the same topic
        existingInfo = Info.query.filter_by(key=key, topic_id=topic_id, user_id=user_id).first()
        if existingInfo:
            info = existingInfo
        else:
            info = Info(key=key, topic_id=topic_id, user_id=user_id)
            db.session.add(info)
            db.session.commit()  # Commit here to get the info ID for relationships

        infoManager = InfoManager(db.session)

        # Store data
        if (infoManager.storeText(info, texts) and
            infoManager.storeLink(info, links) and
            infoManager.storePic(info, files)):
            db.session.commit()
            return jsonify({"message": "Info created successfully"}), 201
        else:
            return jsonify({"message": "Failed to create info"}), 500
    except Exception as e:
        db.session.rollback()
        print(f"Error handling form submission: {e}")
        return jsonify({"message": "Internal server error"}), 500
    
    
@bp.route('/info', methods=['GET'])
def getInfo():
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

