import sqlite3
import os
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), "..", ".env")
load_dotenv(dotenv_path)

if not "DB_PATH" in os.environ:
    raise ValueError("DB_PATH is not set in environment variables.")
else:
    DB_NAME = os.environ["DB_PATH"]

def get_db():
    conn = sqlite3.connect(database=DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn
