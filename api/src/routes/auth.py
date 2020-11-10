from flask import request, abort
from flask_login import login_user, logout_user, current_user
from api import app, Config, db
from api.src.models.user import User, user_schema


# User registration route
@app.route(f'{Config.AUTHENTICATION_ROUTE}/register', methods = ['POST'])
def register():
    username = request.get_json()['username']
    password = request.get_json()['password']

    # Check if the data is valid
    if len(password) < 6 or len(username) < 2:
      abort(400)

    # Check if user with the same name already exists
    if not User.query.filter_by(
        username = username
    ).first() is None:
        abort(403, "Username already taken")

    # Create user
    user = User(
        username = username
    )
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    # Login user after registering
    login_user(user)

    return '', 204

# User login route
@app.route(f'{Config.AUTHENTICATION_ROUTE}/login', methods = ['POST'])
def login():

    # Find user
    user = User.query.filter_by(
        username = request.get_json()['username']
    ).first()

    # Check if the user exists
    if user is None:
        abort(401)

    # Check if the password matches
    if not user.check_password(request.get_json()['password']):
        abort(401)

    # Login user if exists
    login_user(user)

    return "", 204

# User logout route
@app.route(f'{Config.AUTHENTICATION_ROUTE}/logout', methods = ['POST'])
def logout():

  # Check if the user is logged in
  if not current_user.is_authenticated:
    abort(400)

  # logout the user
  logout_user()

  return "", 204

# User session verification route
@app.route(f'{Config.AUTHENTICATION_ROUTE}', methods = ['GET'])
def verify():

  # Check if the user is logged in
  if not current_user.is_authenticated:
    abort(401)

  return user_schema.dump(current_user), 200
