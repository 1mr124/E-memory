import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard to guess string'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'another_hard_to_guess_string'
    JWT_ACCESS_TOKEN_EXPIRES = os.environ.get('JWT_ACCESS_TOKEN_EXPIRES') or timedelta(minutes=15)  # Short-lived access token
    JWT_REFRESH_TOKEN_EXPIRES = os.environ.get('JWT_REFRESH_TOKEN_EXPIRES') or timedelta(days=7)  # Long-lived refresh token
    IMG_FOLDER = os.path.join(basedir, 'instance', 'uploads')
    SECURE_COOKIE = os.environ.get('SECURE_COOKIE', 'False') == 'True'  # Default to False in development


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'instance', 'site.db')

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URL') or \
        'sqlite:///:memory:'  # It's better to use in-memory database for tests
    
class ProductionConfig(Config):
    DEBUG = False  # Set DEBUG to False in production
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'data.sqlite')

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
