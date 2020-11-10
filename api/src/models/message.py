from api import db
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, fields
from marshmallow import fields as marshmallow_fields
from api.src.models.user import UserSchema
import datetime

# Message Model
class Message(db.Model):

    # Columns
    id = db.Column(
        db.Integer,
        primary_key=True
    )
    subject = db.Column(
        db.String(225)
    )
    message = db.Column(
        db.Text
    )
    sender_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id'),
        nullable=False
    )
    receiver_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id'),
        nullable=False
    )
    created_at = db.Column(
        db.DateTime,
        default=datetime.datetime.utcnow,
        nullable=False
    )

    # Relations
    sender = db.relationship(
      "User",
      foreign_keys=sender_id,
      backref="sent_messages"
    )
    receiver = db.relationship(
      "User",
      foreign_keys=receiver_id,
      backref="received_messages"
    )

# Message Schema
class MessageSchema(SQLAlchemyAutoSchema):
  sender = fields.Nested(UserSchema)
  receiver = fields.Nested(UserSchema)
  created_at = marshmallow_fields.String(data_key="createdAt")

  class Meta:
    fields = ("id", "subject", "message", "created_at", "sender", "receiver")

# Create refrence to the schema
message_schema = MessageSchema()
messages_schema = MessageSchema(many=True)
