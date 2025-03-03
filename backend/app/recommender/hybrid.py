from app.recommender.content_filtering import get_recommendations as content_filtering
from app.recommender.collaborative_filtering import get_recommendations as collaborative_filtering


def hybrid_recommendations(user):
    content_based = content_filtering(user)
    collaborative = collaborative_filtering(user)
    combined_recommendations = list(set(content_based + collaborative))

    # TODO: return combined recommendations
    return [
        {
            "id": 1,
            "name": "Song 1",
            "artist": "Artist 1",
            "album": "Album 1",
            "genre": "Genre 1",
            "instrument": "Guitar",
            "proficiency": "Beginner",
        },
        {
            "id": 2,
            "name": "Song 2",
            "artist": "Artist 2",
            "album": "Album 2",
            "genre": "Genre 2",
            "instrument": "Guitar",
            "proficiency": "Intermediate",
        },
    ]


def hybrid_campaign_recommendations(group):
    content_based = content_filtering(group)
    collaborative = collaborative_filtering(group)
    combined_recommendations = list(set(content_based + collaborative))

    return combined_recommendations
