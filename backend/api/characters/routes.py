from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import psycopg2

from db.db import get_db
from api.dependencies.auth import get_current_user_id
from api.characters import repository

router = APIRouter(prefix="/characters", tags=["characters"])

MAX_CHARACTER_PER_USER = 5

class CharacterRequest(BaseModel):
    id: int
    name: str
    classOrRole: str
    appearance: str
    personality: str
    bio: str


@router.post("/create")
def create_character(
    data: CharacterRequest,
    user_id: int = Depends(get_current_user_id),
    db = Depends(get_db)
):
    try: 
        character_id = repository.create_new_character(
            db, user_id, data.name, data.classOrRole, 
            data.appearance, data.personality, data.bio, 
            MAX_CHARACTER_PER_USER
        )
        db.commit()
        return {"message": "character created", "characterId": character_id}
    
    except Exception as e:
        raise HTTPException(400, detail="Unable to create the character")