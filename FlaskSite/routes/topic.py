from flask import Blueprint, render_template, redirect, request, url_for
from FlaskSite.forms import NewTopic
from FlaskSite.models import db, Topic, SearchKey, Info

topicBp = Blueprint('topic', __name__)

@topicBp.route('/topic', methods=['GET', 'POST'])
def topic():
    """Handle topic creation, deletion, and search."""
    form = NewTopic()
    topics_value = {x.name: x.id for x in Topic.query.all()}

    if form.validate_on_submit():
        if form.Name.data:
            topic = Topic(name=form.Name.data)
            db.session.add(topic)
            db.session.commit()
            return redirect(url_for("topic.topic"))
        elif request.form.get("TopicId", ""):
            topic_id = request.form.get("TopicId", "")
            if topic_id:
                topic_id = topics_value.get(topic_id)
                to_delete = Topic.query.filter_by(id=topic_id).first()
                db.session.delete(to_delete)
                db.session.commit()
                return redirect(url_for("topic.topic"))
        elif request.form.get("SearchTopic", ""):
            search_topic = request.form.get("SearchTopic", "")
            if topics_value.get(search_topic, ''):
                topic_id = topics_value.get(search_topic)
                search_keys = [i.key for i in SearchKey.query.all()]
                all_info = Info.query.filter_by(topic_id=topic_id).all()
                return render_template("Search.html", all_info=all_info, t=True, search_keys="")
    else:
        print(form.errors)

    return render_template('Topic.html', form=form, topics_value=topics_value.keys())
