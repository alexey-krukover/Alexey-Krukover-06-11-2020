from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from api import db
import enum

# Listing type enum
class ListingTypes(enum.Enum):
  inbox = 1
  outbox = 2

# Listing Model
class Listing(db.Model):

    # Columns
    type = db.Column(
      db.Enum(ListingTypes),
      nullable=False,
      primary_key=True
    )
    user_id = db.Column(
      db.Integer,
      db.ForeignKey('user.id'),
      nullable=False,
      primary_key=True
    )
    message_id = db.Column(
      db.Integer,
      db.ForeignKey('message.id'),
      nullable=False,
      primary_key=True
    )

    # Relations
    user = db.relationship(
      "User",
      foreign_keys=user_id,
      backref='listings'
    )
    message = db.relationship(
      "Message",
      foreign_keys=message_id,
      backref='listings'
    )

# Listing Schema
class ListingSchema(SQLAlchemyAutoSchema):
  class Meta:
    fields = ("listing_type", "user_id", "message_id")

# CReate refrence to the schema
listing_schema = ListingSchema()
listings_schema = ListingSchema(many=True)
