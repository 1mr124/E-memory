from FlaskSite import db


class Pic(db.Model):
    """Model representing a picture associated with an info entry."""

    __tablename__ = "pics"

    # Core fields
    id = db.Column(db.Integer, primary_key=True)
    header = db.Column(db.String(200), nullable=True)
    comment = db.Column(db.String(200), nullable=True)
    path = db.Column(db.String(500), nullable=True)
    info_id = db.Column(db.Integer, db.ForeignKey("info.id"), nullable=False)

    def __repr__(self):
        """Provide a string representation of the Pic instance."""
        return f"<Pic {self.header or 'No Header'} (Path: {self.path})>"
