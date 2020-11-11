from flask import abort, jsonify, request
from flask_restful import reqparse, Resource
from flask_login import current_user
from api.src.models import Message, User
from api.src.models.listing import ListingTypes, Listing
from api.src.models.message import messages_schema, message_schema
from api import db, api, Config

# Set the accepted arguments
parser = reqparse.RequestParser()
parser.add_argument('subject')
parser.add_argument('message')
parser.add_argument('sender_id', type=int)
parser.add_argument('receiver_id', type=int)

# Messages Resource
class MessageResource(Resource):

  # GET Request
  def get(self):

    # Check if the user has logged in
    if not current_user.is_authenticated:
      abort(404)

    # Retrieve the user inbox and outbox
    return jsonify(
      inbox = messages_schema.dump(current_user.inbox),
      outbox = messages_schema.dump(current_user.outbox)
    )

  # POST Request
  def post(self):

    # Assign the aguments to local variables
    args = parser.parse_args()
    subject = args['subject'],
    message = args['message'],
    sender_id = current_user.id if current_user.is_authenticated else args['sender_id'],
    receiver_id = args['receiver_id']

    # Makes sure the message has a subject
    if not subject:
      abort(400, 'Missing subject')

    # Makes sure the message has a content
    if not message:
      abort(400, 'Missing message')

    # Make sure the assigned sender exists
    if not sender_id or User.query.get(sender_id) is None:
      abort(400, 'Sending user does not exist or wasn\'t selected')

    # Make sure the assigned receiver exists
    if not receiver_id or User.query.get(receiver_id) is None:
        abort(400, 'Receiving user does not exist or wasn\'t selected')

    # Create the message & get it's reference
    message = Message(
      subject = subject,
      message = message,
      sender_id = sender_id,
      receiver_id = receiver_id,
    )
    db.session.add(message)
    db.session.flush()

    # Create a listing of the message in the inbox of the recipient
    db.session.add(Listing(
      type = ListingTypes.inbox,
      user_id = receiver_id,
      message_id = message.id
    ))

    # Create a listing of the message in the outbox of the sender
    db.session.add(Listing(
      type = ListingTypes.outbox,
      user_id = sender_id,
      message_id = message.id
    ))

    # Commit changes
    db.session.commit()

    return message_schema.dump(message), 200

  # DELETE Request
  def delete(self, id: int):
    listing_type = request.args.get('listing_type')

    # Make sure the listing type is specified
    if not listing_type:
      abort(400, "The message listing type must be specified")

    # Get the relevant message listing
    listing = Listing.query\
      .filter(Listing.message_id == id)\
      .filter(Listing.user_id == current_user.id) \
      .filter(Listing.type.like(listing_type))\
      .first()

    # Make sure the listing exists
    if listing is None:
      abort(404)

    # Delete the listing
    db.session.delete(listing)
    db.session.commit()

    return "", 204

# Add resource
api.add_resource(MessageResource, f'{Config.RESOURCES_ROUTE}/messages', f'{Config.RESOURCES_ROUTE}/messages/<int:id>')
