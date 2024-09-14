from flask import Blueprint, render_template, redirect, request, url_for, current_app
from werkzeug.utils import secure_filename
from datetime import datetime
from FlaskSite.forms import InfoF
from FlaskSite.models import db, Text, Link, Pic, Info, Topic, SearchKey

mainBp = Blueprint('main', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'txt', 'py'}

def allowed_file(filename):
    """Check if a file has an allowed extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def store_text(info):
    """Store text data in the database."""
    try:
        new_data = request.form.getlist("Text-TextData")
        new_head = request.form.getlist("Text-Head")
        new_comment = request.form.getlist("Text-Comment")
        for i in range(len(new_data)):
            if new_data[i]:
                text = Text(text=new_data[i], info_id=info.id)
                text.header = new_head[i] if new_head[i] else None
                text.comment = new_comment[i] if new_comment[i] else None
                db.session.add(text)
        db.session.commit()  # Commit the transaction after adding the text data
        return True
    except Exception as e:
        db.session.rollback()  # Rollback the transaction in case of an error
        print(f"Error storing text: {e}")
        return False

def store_link(info):
    """Store link data in the database."""
    try:
        new_data = request.form.getlist("Link-Url")
        new_head = request.form.getlist("Link-Head")
        new_comment = request.form.getlist("Link-Comment")
        for i in range(len(new_data)):
            if new_data[i]:
                link = Link(path=new_data[i], info_id=info.id)
                link.header = new_head[i] if new_head[i] else None
                link.comment = new_comment[i] if new_comment[i] else None
                db.session.add(link)
        db.session.commit()  # Commit the transaction after adding the link data
        return True
    except Exception as e:
        db.session.rollback()  # Rollback the transaction in case of an error
        print(f"Error storing link: {e}")
        return False

def store_pic(info, list_of_files):
    """Store picture data and save the files."""
    try:
        new_head = request.form.get("Pic-Head")
        new_comment = request.form.get("Pic-Comment")
        for file in list_of_files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filename = f"{info.key}-{datetime.now().strftime('%Y%m%d%H%M%S')}{filename[filename.rfind('.'):]}".replace(" ", "")
                file.save(current_app.root_path + current_app.config['IMG_FOLDER'] + filename)
                pic = Pic(path=filename, info_id=info.id)
                pic.header = new_head if new_head else None
                pic.comment = new_comment if new_comment else None
                db.session.add(pic)
        db.session.commit()  # Commit the transaction after adding the picture data
        return True
    except Exception as e:
        db.session.rollback()  # Rollback the transaction in case of an error
        print(f"Error storing picture: {e}")
        return False

def store_key(to_store_key):
    """Store a key in the database if it does not exist."""
    if SearchKey.query.filter_by(key=to_store_key).first():
        return True
    else:
        key = SearchKey(key=to_store_key)
        db.session.add(key)
        db.session.commit()  # Commit the transaction after adding the key
        return True

@mainBp.route('/FirstLook', methods=['GET'])
def home():
    """Render the home page."""
    return render_template('Home.html')

@mainBp.route('/', methods=['GET', 'POST'])
def info_page():
    """Handle form submission and render the info page."""
    form = InfoF()
    topics_value = {x.name: x.id for x in Topic.query.all()}

    if form.validate_on_submit():
        try:
            # Example code to process the form data
            info = Info()  # Assuming Info() is a model that you need to instantiate
            db.session.add(info)  # Add the new info to the session
            
            # Process text, link, picture data
            if store_text(info):
                if store_link(info):
                    if store_pic(info, request.files.getlist("Pic-File")):
                        db.session.commit()  # Commit if all storage operations are successful
                        return redirect(url_for('main.home'))
        except Exception as e:
            db.session.rollback()  # Rollback the transaction in case of an error
            print(f"Error handling form submission: {e}")
    
    # If the form is not submitted or there is an error, render the page with the form
    return render_template('InfoPage.html', form=form, topics=topics_value)
