from peewee import *
from .config import get_database


def instrument_choices():
    return [(0, "Guitar"), (1, "Bass"), (2, "Drums"), (3, "Piano")]


def instrument_proficiency_levels():
    return [
        (0, "Beginner"),
        (1, "Intermediate"),
        (2, "Advanced"),
    ]


def genre_choices():
    return [(0, "Rock"), (1, "Jazz"), (2, "Blues"), (3, "Country"), (4, "Funk")]


class BaseModel(Model):
    class Meta:
        database = get_database()


class User(BaseModel):
    email = CharField(unique=True)
    password = CharField(max_length=255)
    created = DateTimeField()
    instrument = IntegerField(choices=instrument_choices())
    proficiency = IntegerField(choices=instrument_proficiency_levels())


class UserGenre(BaseModel):
    user = ForeignKeyField(User, backref="genres")
    genre = IntegerField(choices=genre_choices())

    class Meta:
        indexes = ((("user", "genre"), True),)


class Group(BaseModel):
    name = CharField()
    created = DateTimeField()
    admin_user = ForeignKeyField(User, backref="groups")
    description = TextField()
    invite_code = CharField(unique=True)


class GroupUser(BaseModel):
    group = ForeignKeyField(Group, backref="users")
    user = ForeignKeyField(User, backref="groups")
    joined = DateTimeField()


class Artist(BaseModel):
    name = CharField(unique=True)
    genre = IntegerField(choices=genre_choices())


class Album(BaseModel):
    name = CharField()
    artist = ForeignKeyField(Artist, backref="albums")


class Song(BaseModel):
    name = CharField()
    album = ForeignKeyField(Album, backref="songs")


class SongInstrumentProficiency(BaseModel):
    song = ForeignKeyField(Song, backref="instrument_proficiencies")
    instrument = IntegerField(choices=instrument_choices())
    proficiency = IntegerField(choices=instrument_proficiency_levels())


class Campaign(BaseModel):
    name = CharField()
    created_date = DateTimeField()
    due_date = DateTimeField()
    group = ForeignKeyField(Group, backref="campaigns")


class CampaignRecommendation(BaseModel):
    campaign = ForeignKeyField(Campaign, backref="recommendations")
    song = ForeignKeyField(Song, backref="campaign_recommendations")

    class Meta:
        indexes = ((("campaign", "song"), True),)


class CampaignRecommendationRating(BaseModel):
    campaign_recommendation = ForeignKeyField(CampaignRecommendation, backref="ratings")
    user = ForeignKeyField(User, backref="campaign_recommendation_ratings")
    rating = IntegerField()

    class Meta:
        indexes = ((("campaign_recommendation", "user"), True),)
