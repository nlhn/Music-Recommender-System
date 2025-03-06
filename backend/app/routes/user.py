import datetime
from flask import Blueprint, jsonify, request
from ..models import User, Group, instrument_choices, instrument_proficiency_levels
from ..utils import (
    generate_recommendations,
    hash_password,
    check_password,
    is_valid_password,
    generate_jwt_token,
    validate_jwt_token,
    api_response,
    api_error,
)
from ..middleware import auth_required

bp = Blueprint("user", __name__, url_prefix="/api/user")


@bp.route("/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")

    if not email or not password:
        return api_error("Email and password are required", status_code=400)

    if not is_valid_password(password):
        return api_error("Invalid password", status_code=400)

    user = User.get(User.email == email)
    if not user:
        return api_error("User not found", status_code=404)

    if not check_password(password, user.password):
        return api_error("Invalid password", status_code=401)

    # token = generate_jwt_token(user.id)
    # TODO: set token in cookie
    user_data = {
        "id": user.id,
        "email": user.email,
    }
    return api_response(
        data=user_data, message="Logged in successfully", status_code=200
    )


@bp.route("/<int:id>/logout", methods=["POST"])
def logout(id):
    # TODO: invalidate token
    return api_response(message="Logged out successfully", status_code=200)


@bp.route("/<int:id>/change-password", methods=["POST"])
@auth_required
def change_password(id):
    user = User.get(User.id == id)
    if not user:
        return api_error("User not found", status_code=404)

    old_password = request.json.get("old_password")
    new_password = request.json.get("new_password")

    if not old_password or not new_password:
        return api_error("Old password and new password are required", status_code=400)

    if not check_password(old_password, user.password):
        return api_error("Invalid old password", status_code=401)

    if not is_valid_password(new_password):
        return api_error("Invalid new password", status_code=400)

    user.password = hash_password(new_password)
    user.save()

    return api_response(message="Password changed successfully", status_code=200)


@bp.route("/register", methods=["POST"])
def create_user():
    print("Creating user")
    print(request.json)
    email = request.json.get("email")
    if not email:
        return api_error("Email is required", status_code=400)

    password = request.json.get("password")
    if not password:
        return api_error("Password is required", status_code=400)

    instrument = request.json.get("instrument")
    if instrument not in [i[0] for i in instrument_choices()]:
        return api_error("Instrument is required or invalid", status_code=400)

    proficiency = request.json.get("proficiency")
    if proficiency not in [i[0] for i in instrument_proficiency_levels()]:
        return api_error("Proficiency is required or invalid", status_code=400)

    User.create(
        email=email,
        password=hash_password(password),
        created=datetime.datetime.now(),
        instrument=instrument,
        proficiency=proficiency,
    )

    print("User created")

    return api_response(message="User created", status_code=201)


@bp.route("/<int:id>", methods=["GET"])
@auth_required
def get_user(id):
    print("Getting user")
    user = User.get(User.id == id)
    if not user:
        return api_error("User not found", status_code=404)

    print("User found")
    return api_response(
        data={
            "id": user.id,
            "email": user.email,
            "created": user.created.strftime("%Y-%m-%d"),
            "instrument": user.instrument,
            "proficiency": user.proficiency,
        },
        message="User retrieved",
        status_code=200,
    )


@bp.route("/<int:id>", methods=["DELETE"])
@auth_required
def delete_user(id):
    user = User.get(User.id == id)
    if not user:
        return api_error("User not found", status_code=404)

    user.delete_instance()
    return api_response(message="User deleted", status_code=200)


@bp.route("/<int:id>/recommendations", methods=["GET"])
@auth_required
def get_recommendations(id):
    user = User.get(User.id == id)
    if not user:
        return api_error("User not found", status_code=404)

    recommendations = generate_recommendations(user)
    return api_response(
        data=recommendations,
        message="Recommendations retrieved",
        status_code=200,
    )


@bp.route("/<int:id>/groups/<string:invite_code>", methods=["POST"])
@auth_required
def add_user_to_group(id, invite_code):
    user = User.get(User.id == id)
    if not user:
        return api_error("User not found", status_code=404)

    group = Group.get(Group.invite_code == invite_code)
    if not group:
        return api_error("Group not found", status_code=404)

    if user in group.users:
        return api_error("User already in group", status_code=400)

    group.users.add(user)
    group.save()

    return api_response(message="User added to group", status_code=200)
