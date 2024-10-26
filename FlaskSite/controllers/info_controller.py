from FlaskSite.services import info_service
from FlaskSite.utils.list_utils import get_unique_list_of_dictionaries


def create_info(user_id, search_key, topic_id, texts, links, files):
    info_id = info_service.get_info_id(
        user_id, search_key, topic_id, create_if_missing=True
    )
    if info_id is None:
        return False
    texts = cleanup_list(texts)
    links = cleanup_list(links)
    files = cleanup_list(files)
    info_service.add_info_data(info_id, texts, links, files)
    return True


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
    must_exist_values = ['headline', 'text', 'path', 'header', 'link']
    new_list = []

    for item in input_list:
        take_item = True
        for key in item:
            if key not in must_exist_values:
                continue
            if item[key] is None or item[key] == "":
                take_item = False
                break
        if take_item:
            new_list.append(item)
    return new_list