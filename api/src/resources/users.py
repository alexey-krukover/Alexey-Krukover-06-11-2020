from flask import request, jsonify, abort
from flask_restful import Resource
from api.src.models import User
from api import api, Config

# Messages Resource
from api.src.models.user import users_schema


class UserResource(Resource):

    # GET Request
    def get(self):
      search = request.args.get('q')

      # CHeck if a search query was submitted
      if not search:
        abort(400, "A search parameter must be specified")

      # Return the result od the search
      return users_schema.dump(
        User.query.filter(
          User.username.contains(search)
        ).all()
      )

# Add resource
api.add_resource(UserResource, f'{Config.RESOURCES_ROUTE}/users')
