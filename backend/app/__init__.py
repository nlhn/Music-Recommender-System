from flask import Flask
from flask_cors import CORS
from app.config import initialize_config, get_database
from app.models import (
    User,
    UserGenre,
    Group,
    GroupUser,
)
from app.routes import user
import os
from dotenv import load_dotenv


def create_tables():
    with get_database() as DB:
        DB.create_tables(
            [
                User,
                UserGenre,
                Group,
                GroupUser,
            ]
        )


def initialize_settings():
    load_dotenv("settings.env")

    host = os.getenv("HOST")
    port = os.getenv("PORT")
    db_path = os.getenv("DB_PATH")

    initialize_config(host, port, db_path)


def initialize():
    initialize_settings()
    create_tables()


def create_app():
    initialize()

    app = Flask(__name__)
    CORS(
        app,
        resources={
            r"/*": {
                "origins": "*",
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
            }
        },
    )

    app.register_blueprint(user.bp)

    @app.get("/")
    def get_index():
        return {"message": "This is an API"}

    @app.before_request
    def before_request():
        get_database().connect(reuse_if_open=True)

    @app.after_request
    def after_request(response):
        get_database().close()
        return response

    return app
