from FlaskSite import db


class SearchKey(db.Model):
    """Model representing a search keyword used for indexing information."""

    # Renamed to be more descriptive and consistent with plural naming
    # conventions
    __tablename__ = "searchkeys"

    # Core fields
    # Changed to 'id' for consistency
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(50), nullable=False, unique=True, index=True)

    def __repr__(self):
        """Provide a string representation of the SearchKey instance."""
        return f"<SearchKey {self.key}>"
