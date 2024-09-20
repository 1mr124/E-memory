from FlaskSite.utils.file_utils import allowed_file
from flask import request, current_app
from FlaskSite.models import db, Text, Link, Pic, Info
from FlaskSite.utils import file_utils
import uuid


def create_info(user_id, search_key, topic_id):
    try:
        info = Info(user_id=user_id, key=search_key, topic_id=topic_id)
        db.session.add(info)
        db.session.commit()
        print("info created")
    except Exception as e:
        print(e)
        return False


def get_info_id(user_id, search_key, topic_id, create_if_missing=False):
    info_model = Info.query.filter_by(
        user_id=user_id, key=search_key, topic_id=topic_id
    ).first()
    if info_model is None and create_if_missing:
        create_info(user_id, search_key, topic_id)
        return get_info_id(user_id, search_key, topic_id)
    return info_model.id if info_model is not None else None


def add_info_data(info_id, texts, links, files):
    texts_to_add = prepare_texts(texts)
    links_to_add = prepare_links(links)
    pics_to_add = prepare_pics(files)
    store_items(texts_to_add, Text, info_id)
    store_items(links_to_add, Link, info_id)
    store_items(pics_to_add, Pic, info_id)


def prepare_texts(texts):
    items = []
    for text_data in texts:
        item = {
            "text": text_data.get("text"),
            "header": text_data.get("header"),
            "comment": text_data.get("comment"),
        }
        items.append(item)
    return items


def prepare_links(links):
    items = []
    for link_data in links:
        item = {
            "path": link_data.get("url"),
            "header": link_data.get("header"),
            "comment": link_data.get("comment"),
        }
        items.append(item)
    return items


def prepare_pics(files):
    try:
        items = []
        for file in files:
            if file and allowed_file(file.filename):
                filename = uuid.uuid4() + file.filename.split(".")[1]
                file_utils.save_file(current_app.config["IMG_FOLDER"], filename, file)
                item = {
                    "path": filename,
                    "header": request.form.get("Pic-Head"),
                    "comment": request.form.get("Pic-Comment"),
                }
                items.append(item)

        return items
    except Exception as e:
        print(f"Error storing picture: {e}")
        return items


def store_items(items, db_model_class, info_id):
    try:
        for itemData in items:
            item = db_model_class(
                **{
                    key: itemData.get(key)
                    for key in db_model_class.__table__.columns.keys()
                    if key in itemData
                },
                info_id=info_id,
            )
            db.session.add(item)

        db.session.commit()
        return True
    except Exception as e:
        print(f"failed to store items {items} due to {e} rolling back")
        db.session.rollback()
        return False
