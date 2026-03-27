import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from os.path import join, dirname

dotenv_path = join(dirname(__file__), "..", ".env")
load_dotenv(dotenv_path)

required_vars = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"]

for var in required_vars:
    if var not in os.environ:
        raise ValueError(f"{var} is not set in environment variables")
    
def get_db():
    conn = psycopg2.connect(
        host = os.environ["DB_HOST"],
        port = os.environ["DB_PORT"],
        database = os.environ["DB_NAME"],
        user = os.environ["DB_USER"],
        password = os.environ["DB_PASSWORD"]
    )

    return conn

def get_cursor(conn):
    return conn.cursor(cursor_factory=RealDictCursor)