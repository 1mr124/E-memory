from FlaskSite import db  # Import the db instance from FlaskSite

# Import your models after db initialization
from FlaskSite.models.user import User
from FlaskSite.models.topic import Topic
from FlaskSite.models.info import Info
from FlaskSite.models.text import Text
from FlaskSite.models.voice import Voice
from FlaskSite.models.pic import Pic
from FlaskSite.models.link import Link
from FlaskSite.models.file import File
from FlaskSite.models.searchKey import SearchKey

__all__ = ['User', 'Topic', 'Info', 'Text', 'Voice', 'Pic', 'Link', 'File', 'SearchKey']
