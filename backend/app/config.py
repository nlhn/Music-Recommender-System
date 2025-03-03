from peewee import SqliteDatabase
from peewee import DatabaseProxy

HOST = None
PORT = None
DB = DatabaseProxy()


def initialize_config(host, port, db_path):
    global HOST, PORT, DB
    HOST = host
    PORT = port
    DB.initialize(
        SqliteDatabase(
            db_path,
            pragmas={
                "journal_mode": "wal",
                "cache_size": -1 * 64000,
                "foreign_keys": 1,
                "ignore_check_constraints": 0,
                "synchronous": 0,
            },
        )
    )


def get_host():
    return HOST


def get_port():
    return PORT


def get_database():
    return DB
