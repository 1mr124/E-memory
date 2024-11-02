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

def get_topic_by_name(user_id, topic_name):
    return db.session.query(Topic).filter_by(user_id=user_id, name=topic_name).one_or_none()