from pathlib import Path
from dotenv import load_dotenv
from os import getenv

# Load env file
load_dotenv(
    dotenv_path = Path('.').absolute() / '.env'
)

# Application Configuration
class Config:

    # General Configurations
    RESOURCES_ROUTE = getenv('RESOURCES_ROUTE')
    AUTHENTICATION_ROUTE = getenv('AUTHENTICATION_ROUTE')

    # Flask SQL Alchemy Configuration
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = "mysql+mysqldb://%s:%s@mail-db/%s" % (
        getenv('DATABASE_USER'),
        getenv('DATABASE_PASSWORD'),
        getenv('DATABASE_NAME')
    )