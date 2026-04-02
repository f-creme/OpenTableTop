from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import time

from db.db import get_db
from api.auth.auth_utils import (
    hash_password, verify_password, create_token, decode_token
)
from api.dependencies.auth import get_current_user_id
from core.config_storage import create_user_storage


class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    password: str
    public_name: str

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()

@router.post("/register")
def register(data: RegisterRequest, db=Depends(get_db)):
    cs = db.cursor()
    try: 
        # Create user and get his/her id
        cs.execute(
            "INSERT INTO users (username, password_hash) VALUES (%s, %s) RETURNING uuid;",
            (data.username, hash_password(data.password))
        )
        user_uuid = str(cs.fetchone()["uuid"])

        # Create profile
        cs.execute(
            "INSERT INTO profiles (user_uuid, public_name) VALUES (%s, %s);",
            (user_uuid, data.public_name)
        )
        db.commit()

        # Create storage
        create_user_storage(user_uuid)

    except:
        db.rollback()
        raise HTTPException(status_code=400, detail="User already exists")
    finally:
        cs.close()
    return {"message": "User created"}

@router.post("/login")
def login(data: LoginRequest, db=Depends(get_db)):
    username = data.username
    password = data.password
    
    cs = db.cursor()

    cs.execute(
        "SELECT * FROM users WHERE username = %s;",
        (username, )
    )
    userData = cs.fetchone()
    cs.close()
    
    if not userData:
        time.sleep(1)
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    isCorrectPassword = verify_password(password, userData["password_hash"])

    if not isCorrectPassword:
        time.sleep(1)
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token({
        "user_id": userData["id"],
        "role": userData["role"]
    })

    return {"access_token": token}

@router.get("/me")
def me(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Check validity of a aut hentication token"""
    try:
        payload = decode_token(credentials.credentials)
        return payload
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
    
@router.get("/public")
def get_public_profile(user_id: int = Depends(get_current_user_id), db = Depends(get_db)):
    try:
        with db.cursor() as cursor:
            cursor.execute(
                "SELECT public_name FROM profiles WHERE user_id = %s;",
                (user_id, )
            )
            response = cursor.fetchone()
            return {"publicName": response["public_name"]} 
    except:
        HTTPException(status_code=401, detail="Invalid credentials")