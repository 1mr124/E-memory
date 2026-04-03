from FlaskSite.utils.file_utils import allowed_file
from flask import request, current_app
from FlaskSite.models import db, Text, Link, Pic, Info
from FlaskSite.utils import file_utils
import uuid
import logging

logger = logging.getLogger(__name__)


def create_info(user_id, search_key, topic_id):
    info = Info(user_id=user_id, key=search_key, topic_id=topic_id)
    db.session.add(info)
    db.session.commit()
    logger.debug("info created")


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
            "header": text_data.get("headline"),
            "comment": text_data.get("comment"),
        }
        items.append(item)
    return items


def prepare_links(links):
    items = []
    for link_data in links:
        item = {
            "path": link_data.get("link"),
            "header": link_data.get("headline"),
            "comment": link_data.get("comment"),
        }
        items.append(item)
    return items


def prepare_pics(files):
    items = []
    try:
        for file in files:
            if file and allowed_file(file.filename):
                filename = str(uuid.uuid4()) + file.filename.split(".")[1]
                file_utils.save_file(current_app.config["IMG_FOLDER"], filename, file)
                item = {
                    "path": filename,
                    "header": request.form.get("headline"),
                    "comment": request.form.get("comment"),
                }
                items.append(item)

        return items
    except Exception as e:
        logger.error(f"Error storing picture: {e}")
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
        logger.error(f"failed to store items {items} due to {e} rolling back")
        db.session.rollback()
        return False


def get_info(search_key, user_id):
    return Info.query.filter(
        Info.key.ilike(f"%{search_key}%"), Info.user_id == user_id
    ).all()


def get_info_by_id(info_id, user_id):
    return Info.query.filter_by(id=info_id, user_id=user_id).first()


def update_info(info_id, user_id, key=None, texts=None, links=None, files=None):
    info = get_info_by_id(info_id, user_id)
    if info is None:
        return None

    if key is not None:
        info.key = key

    if texts is not None or links is not None or files is not None:
        Text.query.filter_by(info_id=info_id).delete()
        Link.query.filter_by(info_id=info_id).delete()
        Pic.query.filter_by(info_id=info_id).delete()

        if texts:
            texts_to_add = prepare_texts(texts)
            store_items(texts_to_add, Text, info_id)
        if links:
            links_to_add = prepare_links(links)
            store_items(links_to_add, Link, info_id)
        if files:
            pics_to_add = prepare_pics(files)
            store_items(pics_to_add, Pic, info_id)

    db.session.commit()
    logger.debug(f"Updated info {info_id} for user {user_id}")
    return info


def delete_info(info_id, user_id):
    info = get_info_by_id(info_id, user_id)
    if info is None:
        return False

    db.session.delete(info)
    db.session.commit()
    logger.debug(f"Deleted info {info_id} for user {user_id}")
    return True
