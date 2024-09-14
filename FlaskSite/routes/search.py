from flask import Blueprint, render_template, request, redirect, url_for
from FlaskSite.models import db, Info, SearchKey

searchBp = Blueprint('search', __name__)

@searchBp.route('/Search', methods=['GET', 'POST'])
def search():
    """Handle search and edit operations."""
    search_keys = [i.key for i in SearchKey.query.all()]

    if request.method == "POST":
        search_key = request.form.get("SearchKey")
        edit_id = request.form.get("InfoId")
        edit_text = request.form.get("Text-TextData")

        if search_key:
            all_info = Info.query.filter_by(key=search_key).all()
            return render_template("Search.html", all_info=all_info, search_keys=search_keys)
        elif edit_id:
            info = Info.query.filter_by(id=edit_id).first()
            info.texts[0].text = edit_text
            db.session.add(info)
            db.session.commit()
            return redirect(url_for("search.search"))
    
    return render_template("Search.html", all_info="", t=False, search_keys=search_keys)
