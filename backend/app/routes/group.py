from flask import Blueprint, request, jsonify
from ..models import Group, User, Campaign
import datetime
import uuid
from ..middleware import auth_required
from ..utils import api_response, api_error

bp = Blueprint("group", __name__, url_prefix="/api/group")


@bp.route("/<int:user_id>", methods=["POST"])
@auth_required
def create_group(user_id):
    name = request.json.get("name")
    if not name:
        return api_error("Name is required", status_code=400)

    description = request.json.get("description")

    user = User.get(User.id == user_id)
    if not user:
        return api_error("User not found", status_code=404)

    invite_code = str(uuid.uuid4())

    Group.create(
        name=name,
        description=description,
        admin_user=user,
        created=datetime.datetime.now(),
        invite_code=invite_code,
    )

    return api_response(message="Group created", status_code=201)


@bp.route("/<int:id>", methods=["GET"])
@auth_required
def get_group(id):
    group = Group.get(Group.id == id)
    if not group:
        return api_error("Group not found", status_code=404)

    campaigns = Campaign.select().where(Campaign.group == group)

    result = jsonify(group)
    result.update(
        {
            "campaigns": jsonify(campaigns),
        }
    )

    return api_response(
        data=result,
        message="Group retrieved",
        status_code=200,
    )


@bp.route("/<int:id>", methods=["DELETE"])
@auth_required
def delete_group(id):
    group = Group.get(Group.id == id)
    if not group:
        return api_error("Group not found", status_code=404)

    group.delete_instance()
    return api_response(message="Group deleted", status_code=200)
