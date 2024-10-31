def get_unique_list_of_dictionaries(list_of_dictionaries):
    """
    remove duplicates from a list and return a new list of all unique dictionaries.
    """
    seen = set()
    unique_list = []

    for dictionary in list_of_dictionaries:
        dic_key = ''
        for key in dictionary:
            dic_key += str(dictionary[key])
            dic_key += '[#]'
        if dic_key not in seen:
            unique_list.append(dictionary)
            seen.add(dic_key)

    return unique_list