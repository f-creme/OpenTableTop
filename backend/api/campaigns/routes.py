from fastapi import APIRouter, Depends, HTTPException
import psycopg2

from db.db import get_db
from api.dependencies.auth import get_current_user_id
from api.campaigns.schemas import UpdateTitleRequest
from api.campaigns import repository

router = APIRouter(prefix="/campaigns", tags=["campaigns"])


@router.get("/")
def get_user_campaigns(user_id: int = Depends(get_current_user_id), db=Depends(get_db)):
    try:
        campaigns = repository.get_user_campaigns(db, user_id)

        return [{"id": c["campaign_id"], "title": c["campaign_title"], "user_role": c["role"]} for c in campaigns]

    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{campaign_id}/global")
def get_campaign_title(campaign_id: int, user_id: int = Depends(get_current_user_id), db=Depends(get_db)):
    result = repository.get_campaign_global(db, user_id, campaign_id)
    return [{
        "campaign_title": result[0]["campaign_title"], 
        "public_name": result[0]["public_name"], 
        "character_name": result[0]["character_name"]
    }]


@router.put("/{campaign_id}/title")
def update_campaign_title(campaign_id: int, data: UpdateTitleRequest, user_id: int = Depends(get_current_user_id), db=Depends(get_db)):
    try:
        repository.update_campaign_title(db, user_id, campaign_id, data.title)
        db.commit()
        return {"message": "database update"}

    except Exception:
        raise HTTPException(status_code=400, detail="Unable to update campaign title")