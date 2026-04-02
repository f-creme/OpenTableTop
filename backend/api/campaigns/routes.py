from fastapi import APIRouter, Depends, HTTPException
import psycopg2
from psycopg2 import errors
from db.db import get_db
from api.dependencies.auth import get_current_user_id
from api.campaigns.schemas import CampaignGlobalRequest, NewParticipantRequest
from api.campaigns import repository
from core.config_storage import create_campaign_storage

router = APIRouter(prefix="/campaigns", tags=["campaigns"])

MAX_CAMPAIGN_PER_USER = 2


@router.get("/")
def get_user_campaigns(user_uuid: str = Depends(get_current_user_id), db=Depends(get_db)):
    try:
        campaigns = repository.get_user_campaigns(db, user_uuid)

        return [{"id": c["campaign_uuid"], "title": c["campaign_title"], "user_role": c["role"]} for c in campaigns]

    except psycopg2.Error as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{campaign_id}/global")
def get_campaign_global(campaign_id: int, user_id: int = Depends(get_current_user_id), db=Depends(get_db)):
    result = repository.get_campaign_global(db, user_id, campaign_id)
    return [{
        "campaign_title": result[0]["campaign_title"], 
        "public_name": result[0]["public_name"], 
        "character_name": result[0]["character_name"]
    }]


@router.put("/{campaign_id}/update-global")
def update_campaign_global(campaign_id: int, data: CampaignGlobalRequest, user_id: int = Depends(get_current_user_id), db=Depends(get_db)):
    try:
        repository.update_campaign_global(db, user_id, campaign_id, data.title, data.name)
        db.commit()
        return {"message": "database update"}

    except Exception:
        raise HTTPException(status_code=400, detail="Unable to update campaign information")
    
@router.post("/create")
def create_campaign(data: CampaignGlobalRequest, user_uuid: str = Depends(get_current_user_id), db=Depends(get_db)):
    try:
        count = repository.count_user_campaigns(db, user_uuid)

        if count < MAX_CAMPAIGN_PER_USER:
            new_campaign_uuid = repository.create_campaign(db, user_uuid, data.title, data.name)
            db.commit()

            create_campaign_storage(new_campaign_uuid)
            return {"message": "campaign created", "campaignId": new_campaign_uuid}
        
        else:
            raise HTTPException(status_code=400, detail="User has reached the campaign limit")
    
    except errors.UniqueViolation:
        db.rollback()
        raise HTTPException(status_code=400, detail="A campaign with this title already exists.")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Unable to create campaign.")
    
@router.delete("/{campaign_id}/delete")
def delete_campaign(campaign_id: int, user_id: int = Depends(get_current_user_id), db = Depends(get_db)):
    try:
        repository.delete_campaign(db, user_id, campaign_id)
        db.commit()
        return {"message": "campaign deleted"}
    except Exception:
        db.rollback()
        raise HTTPException(status_code=400, detail="Unable to delete campaign.")
    
@router.get("/{campaign_id}/users")
def get_campaign_users(campaign_id: int, db = Depends(get_db)):
    try: 
        response = repository.get_campaign_users(db, campaign_id)
        return response
    except:
        raise HTTPException(status_code=400, detail="Unable to get campaign's users.")
    
@router.delete("/remove_user/{user_campaign_id}")
def remove_user_from_campaign(user_campaign_id: int, db = Depends(get_db)):
    try:
        repository.remove_user_from_campaign(db, user_campaign_id)
        db.commit()
        return {"message": "user removed from campaign"}
    except:
        raise HTTPException(status_code=400, detail="Unable to get campaign's users.")
    
@router.post("/{campaign_id}/add_participant")
def add_participant_to_campaign(campaign_id: int, data: NewParticipantRequest, db = Depends(get_db)):
    try:
        participant_user_id = repository.find_user(db, data.participantName)
    except:
        raise HTTPException(status_code=400, detail="The name provided does not match any known user.")
    # return [participant_user_id, campaign_id, data.participantName]
    try: 
        repository.add_user_to_campaign(db, participant_user_id, campaign_id, data.participantName)
        db.commit()
        return {"message": "Participant added to the campaign"}
    except:
        db.rollback()
        raise HTTPException(status_code=400, detail="Unable to add the participant.")