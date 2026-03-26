import os
from os.path import join, dirname

from dotenv import load_dotenv

from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

dotenv_path = join(dirname(__file__), "..", ".env")
load_dotenv(dotenv_path)

if "ENCRYPTION_KEY" not in os.environ:
    raise ValueError("ENCRYPTION_KEY is not set in environment variables.")

SECRET_KEY = os.environ["ENCRYPTION_KEY"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str): 
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)

def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str): 
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

