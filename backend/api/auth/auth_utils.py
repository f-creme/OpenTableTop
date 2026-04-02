import os
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_encryption_key():
    key = os.environ["ENCRYPTION_KEY"]
    if not key:
        raise ValueError("ENCRYPTION_LEY is not set in environmet variables.")
    return key

def hash_password(password: str): 
    return pwd_context.hash(password)

def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)

def create_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, get_encryption_key(), algorithm=ALGORITHM)

def decode_token(token: str): 
    return jwt.decode(token, get_encryption_key(), algorithms=[ALGORITHM])

