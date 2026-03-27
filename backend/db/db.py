import os
from psycopg2 import pool
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from os.path import join, dirname

dotenv_path = join(dirname(__file__), "..", ".env")
load_dotenv(dotenv_path)

required_vars = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD", "DB_MIN_CONN", "DB_MAX_CONN"]

for var in required_vars:
    if var not in os.environ:
        raise ValueError(f"{var} is not set in environment variables")

DB_HOST = os.environ["DB_HOST"]
DB_PORT = os.environ["DB_PORT"]
DB_NAME = os.environ["DB_NAME"]
DB_USER = os.environ["DB_USER"]
DB_PASS = os.environ["DB_PASSWORD"]
DB_MINC = os.environ["DB_MIN_CONN"]
DB_MAXC = os.environ["DB_MAX_CONN"]

try:
    conn_pool = pool.SimpleConnectionPool(
        minconn=DB_MINC,
        maxconn=DB_MAXC,
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )

except Exception as e:
    raise RuntimeError("Error creating connection pool:", e)


def get_db():
    conn = conn_pool.getconn()
    try: 
        conn.cursor_factory = RealDictCursor
        yield conn
    finally:
        conn_pool.putconn(conn)
