from datetime import datetime, timezone
from FlaskSite import db


class Info(db.Model):
    """Model representing information related to a topic."""

    __tablename__ = "info"

    # Core fields
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    topic_id = db.Column(
        db.Integer,
        db.ForeignKey("topics.id"),
        nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    key = db.Column(db.String(50), nullable=False, index=True)

    __table_args__ = (
        db.UniqueConstraint(
            "key",
            "topic_id",
            "user_id",
            name="unique_key_topic_user"),
    )
    # Relationships
    texts = db.relationship(
        "Text", backref="info", lazy=True, cascade="all, delete-orphan"
    )
    pics = db.relationship(
        "Pic", backref="info", lazy=True, cascade="all, delete-orphan"
    )
    links = db.relationship(
        "Link", backref="info", lazy=True, cascade="all, delete-orphan"
    )
    voices = db.relationship(
        "Voice", backref="info", lazy=True, cascade="all, delete-orphan"
    )
    def to_dict(self):
        """Convert the Info instance to a dictionary."""
        return {
            "id": self.id,
            "timestamp": self.timestamp.isoformat(),  # Use isoformat for datetime
            "topic_id": self.topic_id,
            "user_id": self.user_id,
            "key": self.key,
            # Add any other fields you want to include
        }

    def __repr__(self):
        """Provide a string representation of the Info instance."""
        return f"<Info {self.key} (Topic ID: {self.topic_id})>"
