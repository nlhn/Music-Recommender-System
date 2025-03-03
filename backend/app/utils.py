import os
from peewee import SqliteDatabase
from app.recommender.hybrid import hybrid_recommendations
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from flask import current_app, jsonify


def generate_recommendations(user):
    return hybrid_recommendations(user)


def generate_campaign_recommendations(group):
    return hybrid_recommendations(group)


def hash_password(raw_password):
    return generate_password_hash(raw_password)


def check_password(raw_password, hashed_password):
    return check_password_hash(pwhash=hashed_password, password=raw_password)


def is_valid_password(raw_password):
    if len(raw_password) < 8:
        return False

    return True


def initialize_database(db_path):
    return SqliteDatabase(
        db_path,
        pragmas={
            "journal_mode": "wal",
            "cache_size": -1 * 64000,
            "foreign_keys": 1,
            "ignore_check_constraints": 0,
            "synchronous": 0,
        },
    )


def generate_jwt_token(user_id):
    payload = {
        "exp": datetime.now() + timedelta(days=7),
        "iat": datetime.now(),
        "sub": user_id,
    }
    return jwt.encode(payload, current_app.config.get("SECRET_KEY"), algorithm="HS256")


def validate_jwt_token(token):
    try:
        payload = jwt.decode(
            token, current_app.config.get("SECRET_KEY"), algorithms=["HS256"]
        )
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def api_response(data=None, message=None, status_code=200):
    response = {
        "status": "success" if status_code < 400 else "error",
        "message": message,
    }

    if data is not None:
        response["data"] = data

    return jsonify(response), status_code


def api_error(message, status_code=400):
    return api_response(message=message, status_code=status_code)
