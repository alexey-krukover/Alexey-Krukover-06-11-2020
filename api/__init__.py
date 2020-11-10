from flask import Flask,request,redirect,Response
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api
from flask_login import LoginManager
from .src.config import Config
import requests

# Initialize Flask
app = Flask(__name__)
app.config.from_object(Config)
app.secret_key = "g35gqw46hq6uhj4r6ujw46yujw7y6j7yj"

# Initialize Marshmallow
ma = Marshmallow(app)

# Initialize Flask RESTFUL
api = Api(app)

# Initialize Flask SQL Alchemy
db = SQLAlchemy(app)
from .src.models import *
db.create_all()

from .src.resources import *

# Initialize Flask Login
login_manager = LoginManager()
login_manager.init_app(app)
from .src.routes import auth

# The handler for the user login
@login_manager.user_loader
def load_user(user_id):
  if user_id is not None:
    return User.query.get(user_id)
  return None

# Reverse proxy for the client
@app.route('/')
@app.route('/<path:path>')
def _proxy(path='', *args, **kwargs):
  resp = requests.request(
    method=request.method,
    url=request.url.replace(request.host_url, 'http://mail-client:3000/'),
    headers={key: value for (key, value) in request.headers if key != 'Host'},
    data=request.get_data(),
    cookies=request.cookies,
    allow_redirects=False)

  excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
  headers = [(name, value) for (name, value) in resp.raw.headers.items()
             if name.lower() not in excluded_headers]

  response = Response(resp.content, resp.status_code, headers)
  return response
