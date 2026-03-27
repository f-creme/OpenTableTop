from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

from db.db import get_db, get_cursor
from api.auth.auth_utils import (
    hash_password, verify_password, create_token, decode_token
)

class LoginRequest(BaseModel):
    username: str
    password: str

router = APIRouter(prefix="/auth", tags=["auth"])
security = HTTPBearer()

@router.post("/register")
def register(username: str, password: str):
    cn = get_db()
    cs = get_cursor(cn)

    try: 
        cs.execute(
            "INSERT INTO users (username, password_hash) VALUES (%s, %s)",
            (username, hash_password(password))
        )
        cn.commit()
    except:
        raise HTTPException(status_code=400, detail="User already exists")
    
    cn.close()
    return {"message": "User created"}

@router.post("/login")
def login(data: LoginRequest):
    username = data.username
    password = data.password
    
    cn = get_db()
    cs = get_cursor(cn)

    cs.execute(
        "SELECT * FROM users WHERE username = %s;",
        (username, )
    )
    userData = cs.fetchone()
    cn.close()
    
    if not userData:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    isCorrectPassword = verify_password(password, userData["password_hash"])

    if not isCorrectPassword:
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