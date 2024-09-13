import datetime
from FlaskSite import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


class User(UserMixin, db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True, index=True, nullable=False)
    email = db.Column(db.String(120), unique=True, index=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    date_joined = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)
    
    # Optional profile fields
    first_name = db.Column(db.String(50), nullable=True)
    last_name = db.Column(db.String(50), nullable=True)
    profile_picture = db.Column(db.String(500), nullable=True)  # URL to profile picture
    bio = db.Column(db.String(500), nullable=True)

    # Account status (active, suspended, etc.)
    status = db.Column(db.String(20), default="active")

    # Methods to set and check password
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    '''
    from werkzeug.security import generate_password_hash, check_password_hash

    # Example password handling
    hashed_password = generate_password_hash("password123")
    check_password_hash(hashed_password, "password123")  # Returns True if matches

    '''
    
    topics = db.relationship("Topic", backref="owner", lazy=True, cascade="all, delete")
    infos = db.relationship("Info", backref="owner", lazy=True, cascade="all, delete")


class Topic(db.Model):
    __tablename__ = "topics"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False, index=True)
    parent_topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Self-referential relationship for nested topics
    subtopics = db.relationship("Topic", backref=db.backref("parent", remote_side=[id]), lazy='dynamic')
    infos = db.relationship("Info", backref="topic", lazy=True, cascade="all, delete")

class Info(db.Model):
    __tablename__ = "info"
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc))
    topic_id = db.Column(db.Integer, db.ForeignKey("topics.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    key = db.Column(db.String(50), nullable=False, index=True, default="other")

    # Relationships to different content types
    texts = db.relationship("Text", backref="info", lazy=True, cascade="all, delete")
    pics = db.relationship("Pic", backref="info", lazy=True, cascade="all, delete")
    links = db.relationship("Link", backref="info", lazy=True, cascade="all, delete")
    voices = db.relationship("Voice", backref="info", lazy=True, cascade="all, delete")

class Text(db.Model):
    __tablename__ = "texts"
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=True)
    header = db.Column(db.String(200), nullable=True)
    comment = db.Column(db.String(200), nullable=True)
    info_id = db.Column(db.Integer, db.ForeignKey("info.id"), nullable=False)

class Voice(db.Model):
    __tablename__ = "voices"
    id = db.Column(db.Integer, primary_key=True)
    header = db.Column(db.String(200), nullable=True)
    comment = db.Column(db.String(200), nullable=True)
    path = db.Column(db.String(500), nullable=True)
    info_id = db.Column(db.Integer, db.ForeignKey("info.id"), nullable=False)

class Pic(db.Model):
    __tablename__ = "pics"
    id = db.Column(db.Integer, primary_key=True)
    header = db.Column(db.String(200), nullable=True)
    comment = db.Column(db.String(200), nullable=True)
    path = db.Column(db.String(500), nullable=True)
    info_id = db.Column(db.Integer, db.ForeignKey("info.id"), nullable=False)

class Link(db.Model):
    __tablename__ = "links"
    id = db.Column(db.Integer, primary_key=True)
    header = db.Column(db.String(200), nullable=True)
    comment = db.Column(db.String(200), nullable=True)
    path = db.Column(db.String(500), nullable=True)
    info_id = db.Column(db.Integer, db.ForeignKey("info.id"), nullable=False)


class File(db.Model):
    __tablename__ = "files"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    file_url = db.Column(db.String(500), nullable=False)
    file_type = db.Column(db.String(50), nullable=False)  # e.g., "image", "voice"



# future-proof the design
'''


___________________________________________________________________________________________



tagging system for more flexible organization and search

class Tag(db.Model):
    __tablename__ = "tags"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True, nullable=False)

class InfoTag(db.Model):
    __tablename__ = "info_tag"
    info_id = db.Column(db.Integer, db.ForeignKey("info.id"), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey("tags.id"), primary_key=True)

class Info(db.Model):
    # existing fields
    tags = db.relationship("Tag", secondary="info_tag", backref="infos", lazy=True)

    

    
___________________________________________________________________________________________

versioning for Info, Text, Links, etc. This will track changes over time

class InfoVersion(db.Model):
    __tablename__ = "info_versions"
    id = db.Column(db.Integer, primary_key=True)
    info_id = db.Column(db.Integer, db.ForeignKey("info.id"))
    version_number = db.Column(db.Integer, nullable=False)
    content_snapshot = db.Column(db.Text, nullable=False)  # Could store JSON or snapshot of the info content
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

___________________________________________________________________________________________



Info content, so you don't need to create new tables for every content type.


class ContentType(db.Model):
    __tablename__ = "content_types"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)  # e.g., "text", "link", "image", "voice", "video"

class InfoContent(db.Model):
    __tablename__ = "info_content"
    id = db.Column(db.Integer, primary_key=True)
    info_id = db.Column(db.Integer, db.ForeignKey("info.id"), nullable=False)
    content_type_id = db.Column(db.Integer, db.ForeignKey("content_types.id"), nullable=False)
    content_data = db.Column(db.Text, nullable=True)  # Stores the actual content (e.g., text, link, etc.)
___________________________________________________________________________________________
Info to Info Relationship:

class InfoRelation(db.Model):
    __tablename__ = "info_relation"
    ParentInfoId = db.Column(db.Integer, db.ForeignKey("info.InfoId"), primary_key=True)
    ChildInfoId = db.Column(db.Integer, db.ForeignKey("info.InfoId"), primary_key=True)
    RelationshipType = db.Column(db.String(50), nullable=True)  # Optional: e.g., 'related', 'cause-effect'


Topic-Info Relationship:

class TopicInfoRelation(db.Model):
    __tablename__ = "topic_info_relation"
    TopicId = db.Column(db.Integer, db.ForeignKey("topic.TopicId"), primary_key=True)
    InfoId = db.Column(db.Integer, db.ForeignKey("info.InfoId"), primary_key=True)
    RelationshipType = db.Column(db.String(50), nullable=True)  # Optional: define the relation

Topic-Topic Relationship 
class TopicRelation(db.Model):
    __tablename__ = "topic_relation"
    ParentTopicId = db.Column(db.Integer, db.ForeignKey("topic.TopicId"), primary_key=True)
    ChildTopicId = db.Column(db.Integer, db.ForeignKey("topic.TopicId"), primary key=True)
    RelationshipType = db.Column(db.String(50), nullable=True)  # Optional: e.g., 'dependency', 'similar'


___________________________________________________________________________________________



Notifications and Activity Tracking
Notifications: Inform users about updates or changes to topics they are following.

class Notification(db.Model):
    __tablename__ = "notifications"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    


class UsageStatistics(db.Model):
    __tablename__ = "usage_statistics"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), nullable=True)
    action_type = db.Column(db.String(50), nullable=False)  # e.g., "view", "edit"
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    

Shared Topics: Allow users to share topics or information with others.

class SharedTopic(db.Model):
    __tablename__ = "shared_topics"
    id = db.Column(db.Integer, primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    shared_with_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    shared_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

Collaboration: Enable multiple users to collaborate on the same topic or piece of information.


class Collaboration(db.Model):
    __tablename__ = "collaborations"
    id = db.Column(db.Integer, primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # e.g., "editor", "viewer"

    


'''