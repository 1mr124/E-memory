from flask import jsonify
from werkzeug.datastructures import FileStorage

from FlaskSite.services import info_service
from FlaskSite.services.topic_service import get_topic
from FlaskSite.utils.list_utils import get_unique_list_of_dictionaries


def create_info(user_id, search_key, topic_id, texts, links, files):
    # todo: move to using logger
    print("start the method of create_info in info_controller.py for user_id", user_id)
    print("texts", texts, len(texts))
    print("links", links, len(links))
    print("files", files, len(files))
    print("search_key", search_key)
    print("topic_id", topic_id)

    texts = cleanup_list(texts)
    links = cleanup_list(links)
    #files = cleanup_list(files)

    # Validate files (check if they are valid FileStorage objects)
    valid_files = [file for file in files if file and isinstance(file, FileStorage)]

    if topic_id == '':
        topic_id = None

    if search_key is None:
        print("failed to create info, search key is None")
        return jsonify({"message": "Key is required"}), 400


    if len(texts) == 0 and len(links) == 0 and len(files) == 0:
        print("failed to create info, no text or no links or no files")
        return jsonify({"message": "Failed to create info, info does not contain at least any text, link or file"}), 400

    if topic_id is not None and get_topic(user_id, topic_id) is None:
        print("failed to create info, topic id is invalid")
        return jsonify({"message": "Failed to create info, topic id is invalid"}), 400

    try:
        info_id = info_service.get_info_id(user_id, search_key, topic_id, create_if_missing=True)
        if info_id is None:
            return jsonify({"message": "Failed to create info"}), 400
        print("info_id", info_id)
        info_service.add_info_data(info_id, texts, links, valid_files)
        return jsonify({"message": "info created"}), 200
    except Exception as e:
        print("exception during insert new info", e)
        return jsonify({"message": "failed to insert a new info, try again"}), 500


def transform_info(info):
    """
        This will transform the data in the info model 
    """
    return {
        'id': info.id,
        'key': info.key,
        'texts': [{'text': text.text, 'header': text.header, 'comment': text.comment} for text in info.texts],
        'links': [{'path': link.path, 'header': link.header, 'comment': link.comment} for link in info.links],
        'pics': [{'path': pic.path, 'header': pic.header, 'comment': pic.comment} for pic in info.pics],
    }


def get_info(search_key, user_id):
    info_list = info_service.get_info(search_key,user_id)

    result = [transform_info(info) for info in info_list]
    return result



def update_info():
    pass


def delete_info():
    pass

def cleanup_list(input_list):
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
    must_exist_values = ['text', 'path', 'header', 'link']
    new_list = []
    print(input_list)
    for current_dic in input_list:
        take_dic = True
        for key in must_exist_values:
            if key in current_dic and (current_dic[key] is None or current_dic[key].isspace() or not current_dic[key]):
                take_dic = False
                break

        if take_dic:
            new_list.append(current_dic)
    return new_list