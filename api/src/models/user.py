from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from api.src.models.listing import ListingTypes, Listing
from api import db

# User Model
class User(db.Model, UserMixin):

    # Columns
    id = db.Column(
        db.Integer,
        primary_key=True
    )
    username = db.Column(
        db.String(80),
        nullable=False
    )
    password = db.Column(
        db.Text,
        nullable=False
    )

    # Relations
    inbox = db.relationship(
      "Message",
      secondary=Listing.__table__,
      primaryjoin=f"and_(Listing.type=='{ListingTypes.inbox.name}', Listing.user_id==User.id)"
    )
    outbox = db.relationship(
      "Message",
      secondary=Listing.__table__,
      primaryjoin=f"and_(Listing.type=='{ListingTypes.outbox.name}', Listing.user_id==User.id)"
    )

    # Methods

    """ Hash a password and set it as the user's password """
    def set_password(self, password):
        self.password = generate_password_hash(
            password,
            method='sha256'
        )

    """ Check if password matched the hashed password """
    def check_password(self, password):
        return check_password_hash(self.password, password)

# User Schema
class UserSchema(SQLAlchemyAutoSchema):
  class Meta:
    fields = ("id", "username")

# Create refrence to the schema
user_schema = UserSchema()
users_schema = UserSchema(many=True)
