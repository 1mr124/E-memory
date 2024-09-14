from FlaskSite import db

class Topic(db.Model):
    """Model representing a topic, which can have nested subtopics and associated information."""
    __tablename__ = "topics"

    # Core fields
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False, index=True)
    parent_topic_id = db.Column(db.Integer, db.ForeignKey('topics.id'), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Self-referential relationship for nested topics
    subtopics = db.relationship(
        "Topic",
        backref=db.backref("parent", remote_side=[id]),
        lazy='dynamic'
    )

    # Relationship with Info
    infos = db.relationship(
        "Info",
        backref="topic",
        lazy=True,
        cascade="all, delete"
    )

    def __repr__(self):
        """Provide a string representation of the Topic instance."""
        return f"<Topic {self.name} (ID: {self.id})>"
