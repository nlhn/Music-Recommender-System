import os
import datetime
from dotenv import load_dotenv
from app import create_app
from app.models import (
    User,
    UserGenre,
    Group,
    GroupUser,
    Artist,
    Album,
    Song,
    SongInstrumentProficiency,
    Campaign,
    CampaignRecommendation,
    CampaignRecommendationRating,
)
from app.utils import hash_password


def init_db():
    db_dir = os.path.dirname(os.getenv("DB_PATH"))
    if not os.path.exists(db_dir):
        os.makedirs(db_dir)

    tables = [
        User,
        UserGenre,
        Group,
        GroupUser,
        Artist,
        Album,
        Song,
        SongInstrumentProficiency,
        Campaign,
        CampaignRecommendation,
        CampaignRecommendationRating,
    ]

    for table in tables:
        if not table.table_exists():
            print(f"Creating table: {table.__name__}")
            table.create_table()

    if User.select().count() == 0:
        print("Adding sample data...")

        admin_user = User.create(
            email="admin@example.com",
            password=hash_password("admin123"),
            created=datetime.datetime.now(),
            instrument=0,  # Guitar
            proficiency=2,  # Advanced
        )

        UserGenre.create(user=admin_user, genre=0)  # Rock
        UserGenre.create(user=admin_user, genre=1)  # Jazz

        demo_group = Group.create(
            name="Demo Musicians",
            created=datetime.datetime.now(),
            admin_user=admin_user,
            description="A demo group for testing",
            invite_code="DEMO123",
        )

        GroupUser.create(
            group=demo_group, user=admin_user, joined=datetime.datetime.now()
        )

        led_zeppelin = Artist.create(name="Led Zeppelin", genre=0)  # Rock
        album_iv = Album.create(name="Led Zeppelin IV", artist=led_zeppelin)
        stairway = Song.create(name="Stairway to Heaven", album=album_iv)

        SongInstrumentProficiency.create(
            song=stairway,
            instrument=0,  # Guitar
            proficiency=2,  # Advanced
        )

        print("Sample data added successfully.")

    print("Database initialization complete")


if __name__ == "__main__":
    load_dotenv("settings.env")
    app = create_app()
    with app.app_context():
        init_db()
