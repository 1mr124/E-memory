from flask import jsonify
from werkzeug.datastructures import FileStorage
import logging

from FlaskSite.services import info_service
from FlaskSite.services.topic_service import get_topic, get_breadcrumb_path
from FlaskSite.utils.list_utils import get_unique_list_of_dictionaries

logger = logging.getLogger(__name__)


def create_info(user_id, search_key, topic_id, texts, links, files):
    logger.debug(
        f"create_info called for user_id={user_id}, search_key={search_key}, "
        f"topic_id={topic_id}, texts_count={len(texts) if texts else 0}, "
        f"links_count={len(links) if links else 0}, files_count={len(files) if files else 0}"
    )

    texts = cleanup_list(texts)
    links = cleanup_list(links)
    files = cleanup_list(files)
    if topic_id == "":
        topic_id = None

    if topic_id is None:
        return jsonify({"message": "Topic ID is required"}), 400

    if search_key is None:
        logger.debug("create_info failed: search key is None")
        return jsonify({"message": "Key is required"}), 400

    if len(texts) == 0 and len(links) == 0 and len(files) == 0:
        logger.debug("create_info failed: no content (texts, links, or files)")
        return jsonify(
            {
                "message": "Failed to create info, info does not contain at least any text, link or file"
            }
        ), 400

    if topic_id is not None and get_topic(user_id, topic_id) is None:
        logger.debug(f"create_info failed: topic_id {topic_id} is invalid for user {user_id}")
        return jsonify({"message": "Failed to create info, topic id is invalid"}), 400

    try:
        info_id = info_service.get_info_id(
            user_id, search_key, topic_id, create_if_missing=True
        )
        if info_id is None:
            return jsonify({"message": "Failed to create info"}), 400
        logger.debug(f"create_info: info_id={info_id}")
        info_service.add_info_data(info_id, texts, links, files)
        return jsonify({"message": "info created"}), 200
    except Exception as e:
        logger.error(f"exception during create_info: {e}")
        return jsonify({"message": "failed to insert a new info, try again"}), 500


def transform_info(info):
    """
    This will transform the data in the info model
    """
    return {
        "id": info.id,
        "key": info.key,
        "texts": [
            {"text": text.text, "header": text.header, "comment": text.comment}
            for text in info.texts
        ],
        "links": [
            {"path": link.path, "header": link.header, "comment": link.comment}
            for link in info.links
        ],
        "pics": [
            {"path": pic.path, "header": pic.header, "comment": pic.comment}
            for pic in info.pics
        ],
    }


def get_info(search_key, user_id):
    info_list = info_service.get_info(search_key, user_id)

    result = [
        {
            **transform_info(info),
            'breadcrumb': get_breadcrumb_path(user_id, info.topic_id)
        }
        for info in info_list
    ]
    return result


def update_info(info_id, user_id, key=None, texts=None, links=None, files=None):
    info = info_service.get_info_by_id(info_id, user_id)
    if info is None:
        return jsonify({"message": "Info not found or access denied"}), 404

    texts = cleanup_list(texts) if texts else None
    links = cleanup_list(links) if links else None

    if (
        texts is not None
        and len(texts) == 0
        and links is not None
        and len(links) == 0
        and (files is None or len(files) == 0)
    ):
        return jsonify({"message": "At least one content item is required"}), 400

    try:
        updated_info = info_service.update_info(
            info_id, user_id, key, texts, links, files
        )
        return jsonify({"message": "Info updated", "info_id": updated_info.id}), 200
    except Exception as e:
        return jsonify({"message": "Failed to update info"}), 500


def delete_info(info_id, user_id):
    deleted = info_service.delete_info(info_id, user_id)
    if not deleted:
        return jsonify({"message": "Info not found or access denied"}), 404
    return jsonify({"message": "Info deleted"}), 200


def cleanup_list(input_list):
    logger.debug(f"cleanup_list called with {len(input_list) if input_list else 0} items")
    logger.debug(f"Original input_list: {input_list}")

    # Check if input_list contains FileStorage objects (file uploads)
    if input_list and isinstance(input_list[0], FileStorage):
        # File uploads don't need deduplication, return as-is
        return input_list

    input_list = get_unique_list_of_dictionaries(input_list)
    input_list = remove_incomplete_input(input_list)
    return input_list


def remove_incomplete_input(input_list):
    """
    take a list of dictionaries,
    this method responsibility is to check for each dictionary in the list
    it contains a value for a predefined key from must_exist_values
    key = text
    if a dictionary contains key = text, so it must be not empty, spaces or None
    """
    must_exist_values = ["text", "path", "header", "link"]
    new_list = []
    logger.debug(f"remove_incomplete_input processing {len(input_list)} items")
    for current_dic in input_list:
        take_dic = True
        for key in must_exist_values:
            if key in current_dic and (
                current_dic[key] is None
                or current_dic[key].isspace()
                or not current_dic[key]
            ):
                take_dic = False
                break

        if take_dic:
            new_list.append(current_dic)
    return new_list
