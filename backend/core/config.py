import os
from os.path import dirname, abspath, join
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), "..", ".env")
load_dotenv(dotenv_path)

if "STORAGE_DIR" not in os.environ:
    raise ValueError(f"STORAGE_DIR is not set in environment variables")

DATA_DIR = abspath(os.environ["STORAGE_DIR"])