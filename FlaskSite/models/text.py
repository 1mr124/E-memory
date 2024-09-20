from FlaskSite import db


class Text(db.Model):
    """Model representing a textual content associated with an info entry."""
    __tablename__ = "texts"

    # Core fields
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=True)
    header = db.Column(db.String(200), nullable=True)
    comment = db.Column(db.String(200), nullable=True)
    info_id = db.Column(db.Integer, db.ForeignKey("info.id"), nullable=False)

    def __repr__(self):
        """Provide a string representation of the Text instance."""
        return f"<Text {self.header or 'No Header'} (ID: {self.id})>"
