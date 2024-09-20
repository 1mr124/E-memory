from FlaskSite.services import info_service


def create_info(user_id, search_key, topic_id, texts, links, files):
    info_id = info_service.get_info_id(
        search_key, topic_id, user_id, create_if_missing=True
    )
    if info_id is None:
        return False
    info_service.add_info_data(info_id, texts, links, files)
    return True


def get_info(search_key):
    info_list = info_service.get_info(search_key)

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
    return result


def update_info():
    pass


def delete_info():
    pass