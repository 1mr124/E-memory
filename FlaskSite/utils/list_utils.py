def get_unique_list_of_dictionaries(list_of_dictionaries):
    taken = set()
    unique_list = []

    for dictionary in list_of_dictionaries:
        dic_key = ''
        for key in dictionary:
            dic_key += str(dictionary[key])
            dic_key += '[#]'
        if dic_key not in taken:
            unique_list.append(dictionary)
            taken.add(dic_key)

    return unique_list