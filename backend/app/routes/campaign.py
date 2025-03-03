from ..models import (
    Group,
    Campaign,
    CampaignRecommendation,
    CampaignRecommendationRating,
    User,
)
import datetime
from flask import Blueprint, jsonify, request
from ..utils import generate_campaign_recommendations, api_response, api_error
from ..middleware import auth_required

bp = Blueprint("campaign", __name__, url_prefix="/api/campaign")


@bp.route("/<int:group_id>", methods=["POST"])
@auth_required
def create_campaign(group_id):
    group = Group.get(Group.id == group_id)
    if not group:
        return api_error("Group not found", status_code=404)

    name = request.json.get("name")
    if not name:
        return api_error("Name is required", status_code=400)

    due_date = request.json.get("due_date")
    if not due_date:
        return api_error("Due date is required", status_code=400)

    try:
        due_date = datetime.datetime.strptime(due_date, "%Y-%m-%d")
    except ValueError:
        return api_error("Invalid due date", status_code=400)

    campaign = Campaign.create(
        name=name,
        created_date=datetime.datetime.now(),
        due_date=due_date,
        group=group,
    )

    campaign_recommendations = generate_campaign_recommendations(group)
    for recommendation in campaign_recommendations:
        CampaignRecommendation.create(
            campaign=campaign,
            song=recommendation,
        )

    return api_response(message="Campaign created", status_code=201)


@bp.route("/<int:group_id>/<int:campaign_id>", methods=["GET"])
@auth_required
def get_campaign(group_id, campaign_id):
    group = Group.get(Group.id == group_id)
    if not group:
        return api_error("Group not found", status_code=404)

    campaign = Campaign.get(Campaign.id == campaign_id)
    if not campaign:
        return api_error("Campaign not found", status_code=404)

    result = jsonify(campaign)
    result.update(
        {
            "recommendations": jsonify(campaign.recommendations),
        }
    )

    return api_response(data=result, message="Campaign retrieved", status_code=200)


@bp.route("/<int:group_id>/<int:campaign_id>", methods=["DELETE"])
@auth_required
def delete_campaign(group_id, campaign_id):
    group = Group.get(Group.id == group_id)
    if not group:
        return api_error("Group not found", status_code=404)

    campaign = Campaign.get(Campaign.id == campaign_id)
    if not campaign:
        return api_error("Campaign not found", status_code=404)

    campaign.delete_instance()
    return api_response(message="Campaign deleted", status_code=200)


@bp.route("/ratings/<int:user_id>/<int:campaign_recommendation_id>", methods=["POST"])
@auth_required
def add_campaign_recommendation_rating(user_id, campaign_recommendation_id, rating):
    campaign_recommendation = CampaignRecommendation.get(
        CampaignRecommendation.id == campaign_recommendation_id
    )
    if not campaign_recommendation:
        return api_error("Campaign recommendation not found", status_code=404)

    user = User.get(User.id == user_id)
    if not user:
        return api_error("User not found", status_code=404)

    rating = request.json.get("rating")
    if not rating:
        return api_error("Rating is required", status_code=400)

    try:
        rating = int(rating)
    except ValueError:
        return api_error("Invalid rating", status_code=400)

    CampaignRecommendationRating.create(
        campaign_recommendation=campaign_recommendation,
        user=user,
        rating=rating,
    )

    return api_response(message="Campaign recommendation rating added", status_code=201)
