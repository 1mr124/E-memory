from flask_wtf import FlaskForm
from wtforms import (
    StringField,
    TextAreaField,
    SubmitField,
    MultipleFileField,
    FormField,
)
from wtforms.validators import DataRequired, Length, URL, Optional


class Text(FlaskForm):
    Head = StringField(validators=[Length(max=200)])
    TextData = TextAreaField("Text")
    Comment = StringField("comment", validators=[Length(max=200)])


class Pics(FlaskForm):
    Head = StringField(validators=[Length(max=200)])
    Pic = MultipleFileField("Pics")
    Comment = StringField("comment", validators=[Length(max=200)])


class Links(FlaskForm):
    Head = StringField(validators=[Length(max=200)])
    Url = StringField("Link", validators=[Optional(), URL()])
    Comment = StringField("comment", validators=[Length(max=200)])


class InfoF(FlaskForm):
    Text = FormField(Text)
    Pic = FormField(Pics)
    Link = FormField(Links)
    Key = StringField("Key", validators=[Length(max=200), DataRequired()])
    Submit = SubmitField()


class NewTopic(FlaskForm):
    Name = StringField("TopicName", validators=[Length(max=40)])
    Submit = SubmitField()
