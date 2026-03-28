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
            response = [
                {
                    "id": v["campaign_id"],
                    "title": v["campaign_title"],
                    "user_role": v["role"] 
                } for v in user_campaigns
            ]

            return response

    except psycopg2.Error as e: 
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/get_title")
def get_campaign_title(id: int, credentials: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    try: 
        payload = decode_token(credentials.credentials)
        user_id = payload["user_id"]
    except Exception:
        raise HTTPException(status_code=410, detail="Invalid token")
    
    with db.cursor() as cursor:
        cursor.execute(
            "SELECT campaign_title FROM campaigns " \
            "LEFT JOIN users_campaigns ON users_campaigns.campaign_id = campaigns.id " \
            "WHERE role = 'gm' AND user_id = %s AND campaign_id = %s;",
            (user_id, id)
        )
        response = cursor.fetchall()
    return response

class UpdateTitleRequest(BaseModel):
    id: int
    title: str

@router.put("/update_title")
def update_campaign_title(data: UpdateTitleRequest, credentials: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    try: 
        payload = decode_token(credentials.credentials)
        user_id = payload["user_id"]
    except Exception:
        raise HTTPException(status_code=410, detail="Invalid token")
    
    try:
        with db.cursor() as cursor:
            cursor.execute(
                "UPDATE campaigns SET campaign_title = %s " \
                "FROM users_campaigns WHERE users_campaigns.campaign_id = campaigns.id " \
                "AND role = 'gm' AND user_id = %s AND campaign_id = %s;",
                (data.title, user_id, data.id)
            )
        db.commit()

    except Exception:
        raise HTTPException(status_code=400, detail="Unable to update campaign title")
    
    return {"message": "database update"}