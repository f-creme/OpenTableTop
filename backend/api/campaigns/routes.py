from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import psycopg2

from db.db import get_db
from api.auth.auth_utils import decode_token

router = APIRouter(prefix="/campaigns", tags=["campaigns"])
security = HTTPBearer()

@router.get("/")
def get_user_campaigns(credentials: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    try:
        payload = decode_token(credentials.credentials)
        user_id = payload["user_id"]
        
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    try:
        with db.cursor() as cs:
            cs.execute(
                "SELECT campaign_id, campaign_title, user_id, " \
                "username, users_campaigns.role FROM users_campaigns " \
                "LEFT JOIN campaigns ON campaigns.id = users_campaigns.campaign_id " \
                "LEFT JOIN users ON users.id = users_campaigns.user_id " \
                "WHERE user_id = %s;",
                (user_id, )
            )
            user_campaigns = cs.fetchall()

    except psycopg2.Error as e: 
        raise HTTPException(status_code=500, detail=str(e))
    
    return user_campaigns