from FlaskSite import db


class Voice(db.Model):
    """Model representing a voice recording associated with an information entry."""

    __tablename__ = "voices"

    # Core fields
    id = db.Column(db.Integer, primary_key=True)
    header = db.Column(db.String(200), nullable=True)
    comment = db.Column(db.String(200), nullable=True)
    path = db.Column(db.String(500), nullable=True)
    info_id = db.Column(db.Integer, db.ForeignKey("info.id"), nullable=False)

    def __repr__(self):
        """Provide a string representation of the Voice instance."""
        return f"<Voice Header: {self.header} (ID: {self.id})>"
