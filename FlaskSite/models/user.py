from datetime import datetime, timezone
from FlaskSite import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


class User(UserMixin, db.Model):
    """User model representing application users."""

    __tablename__ = "users"

    # Core fields
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True, index=True, nullable=False)
    email = db.Column(db.String(120), unique=True, index=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    # Timestamps
    date_joined = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    last_login = db.Column(db.DateTime, nullable=True)

    # Optional profile fields
    first_name = db.Column(db.String(50), nullable=True)
    last_name = db.Column(db.String(50), nullable=True)
    profile_picture = db.Column(db.String(500), nullable=True)  # URL to profile picture
    bio = db.Column(db.String(500), nullable=True)

    # Status field (e.g., active, suspended)
    status = db.Column(db.String(20), default="active")

    # Relationships
    topics = db.relationship(
        "Topic", backref="owner", lazy=True, cascade="all, delete-orphan"
    )
    infos = db.relationship(
        "Info", backref="owner", lazy=True, cascade="all, delete-orphan"
    )

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.set_password(password)

    def set_password(self, password: str) -> None:
        """Hash and set the user's password."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        """Check if the provided password matches the stored hash."""
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        """Provide a string representation of the User instance."""
        return f"<User {self.username}>"
