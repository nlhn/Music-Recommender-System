from functools import wraps
from flask import request, jsonify, g
from .utils import validate_jwt_token
from .models import User


def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        # token = request.headers.get("Authorization")

        # if not token or not token.startswith("Bearer "):
        #     return jsonify({"error": "Missing or invalid authentication token"}), 401

        # token = token.split("Bearer ")[1]
        # user_id = validate_jwt_token(token)

        # if not user_id:
        #     return jsonify({"error": "Invalid or expired token"}), 401

        # try:
        #     user = User.get(User.id == user_id)
        #     g.user = user
        # except:
        #     return jsonify({"error": "User not found"}), 401

        return f(*args, **kwargs)

    return decorated
