from FlaskSite.models import db, Info, Text, Link
from flask import jsonify
from FlaskSite.services import info_service
from FlaskSite.utils.file_utils import allowed_file
from werkzeug.utils import secure_filename
from datetime import datetime, timezone
from flask import Blueprint, jsonify, request, current_app
from werkzeug.utils import secure_filename
from datetime import datetime, timezone
from FlaskSite.models import db, Text, Link, Pic, Info
import os,json


def create_info(user_id, search_key, topic_id, texts, links, files):
    info_id = info_service.get_info_id(search_key, topic_id, user_id, create_if_missing=True)
    if info_id is None:
        return False
    info_service.add_info_data(info_id, texts, links, files)
    return True


def update_info():
    pass


def delete_info():
    pass


def get_info():
    pass
