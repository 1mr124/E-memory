from flask import Blueprint, render_template, redirect, request, url_for, current_app
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

from FlaskSite.forms import LoginForm, RegisterForm, InfoF, NewTopic
from FlaskSite.models import db, Text, Link, Pic, SearchKey, Info, Topics, User

# Define blueprint
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
                text = Text(Text=new_data[i], Info=info)
                text.TextHead = new_head[i] if new_head[i] else None
                text.TextComment = new_comment[i] if new_comment[i] else None
                db.session.add(text)
        return True
    except Exception as e:
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
                link = Link(LinkPath=new_data[i], Info=info)
                link.LinkHead = new_head[i] if new_head[i] else None
                link.LinkComment = new_comment[i] if new_comment[i] else None
                db.session.add(link)
        return True
    except Exception as e:
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
                filename = f"{info.Key}-{datetime.now().strftime('%Y%m%d%H%M%S')}{filename[filename.rfind('.'):]}".replace(" ", "")
                file.save(current_app.root_path + current_app.config['IMG_FOLDER'] + filename)
                pic = Pic(PicPath=filename, Info=info)
                pic.PicHead = new_head if new_head else None
                pic.PicComment = new_comment if new_comment else None
                db.session.add(pic)
        return True
    except Exception as e:
        print(f"Error storing picture: {e}")
        return False

def store_key(to_store_key):
    """Store a key in the database if it does not exist."""
    if SearchKey.query.filter_by(Key=to_store_key).first():
        return True
    else:
        key = SearchKey(Key=to_store_key)
        db.session.add(key)
        return True

@mainBp.route('/FirstLook', methods=['GET', 'POST'])
def home():
    """Render the home page."""
    return render_template('Home.html')

@mainBp.route('/', methods=['GET', 'POST'])
def info_page():
    """Handle form submission and render the info page."""
    form = InfoF()
    topics_value = {x.TopicName: x.TopicId for x in Topics.query.all()}

    if form.validate_on_submit():
        to_store_key = request.form.get("Key")
        topic_id = request.form.get("TopicId", "other")
        topic_id = topics_value.get(topic_id, 1)

        info = Info(TopicId=topic_id, Key=to_store_key)
        text_list = store_text(info)
        link_list = store_link(info)
        files = request.files.getlist("Pic-Pic")
        pic_list = store_pic(info, files)
        store_key_result = store_key(to_store_key)

        if text_list and link_list and pic_list and store_key_result:
            db.session.add(info)
            db.session.commit()
            return redirect(url_for("main.info_page"))
    else:
        print(form.errors)
    
    return render_template('InfoPage.html', form=form, topics_value=topics_value.keys())

@mainBp.route('/topic', methods=['GET', 'POST'])
def topic():
    """Handle topic creation, deletion, and search."""
    form = NewTopic()
    topics_value = {x.TopicName: x.TopicId for x in Topics.query.all()}

    if form.validate_on_submit():
        if form.Name.data:
            topic = Topics(TopicName=form.Name.data)
            db.session.add(topic)
            db.session.commit()
            return redirect(url_for("main.topic"))
        elif request.form.get("TopicId", ""):
            topic_id = request.form.get("TopicId", "")
            if topic_id:
                topic_id = topics_value.get(topic_id)
                to_delete = Topics.query.filter_by(TopicId=topic_id).first()
                db.session.delete(to_delete)
                db.session.commit()
                return redirect(url_for("main.topic"))
        elif request.form.get("SearchTopic", ""):
            search_topic = request.form.get("SearchTopic", "")
            if topics_value.get(search_topic, ''):
                topic_id = topics_value.get(search_topic)
                search_keys = [i.Key for i in SearchKey.query.all()]
                all_info = Info.query.filter_by(TopicId=topic_id).all()
                return render_template("Search.html", all_info=all_info, t=True, search_keys="")
    else:
        print(form.errors)

    return render_template('Topic.html', form=form, topics_value=topics_value.keys())

@mainBp.route('/Search', methods=['GET', 'POST'])
def search():
    """Handle search and edit operations."""
    search_keys = [i.Key for i in SearchKey.query.all()]

    if request.method == "POST":
        search_key = request.form.get("SearchKey")
        edit_id = request.form.get("InfoId")
        edit_text = request.form.get("Text-TextData")

        if search_key:
            all_info = Info.query.filter_by(Key=search_key).all()
            return render_template("Search.html", all_info=all_info, search_keys=search_keys)
        elif edit_id:
            info = Info.query.filter_by(InfoId=edit_id).first()
            info.Text[0].Text = edit_text
            db.session.add(info)
            db.session.commit()
            return redirect(url_for("main.search"))
    
    return render_template("Search.html", all_info="", t=False, search_keys=search_keys)

@mainBp.route('/New', methods=['GET', 'POST'])
def register():
    """Handle user registration."""
    form = RegisterForm()

    if form.validate_on_submit():
        user = User(UserName=form.UserName.data, password=form.Password.data)
        db.session.add(user)
        try:
            db.session.commit()
            return render_template("success.html", title="Welcome", type="success")
        except Exception as e:
            print(e)
            return render_template("success.html", title="Error", type="error")
    else:
        if form.errors:
            flash("Form Error", form.errors)

    return render_template('register.html', title='Register', form=form)

@mainBp.route('/Login', methods=['GET', 'POST'])
def login():
    """Handle user login."""
    form = LoginForm()

    if form.validate_on_submit():
        username = form.UserName.data
        password = form.Pass.data
        user = User.query.filter_by(UserName=username, password=password).first()
        if user:
            return redirect(url_for("main.info_page"))
        else:
            return render_template("success.html", title="Error", type="error")

    return render_template("login.html", title="Login", form=form)
