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

@router.get("/")
def get_characters(user_id: int = Depends(get_current_user_id), db = Depends(get_db)):
    try: 
        response = repository.get_user_characters(db, user_id)
        formated_response = [
            {"id": r["id"], "name": r["name"], "classOrRole": r["class"],
            "appearance": r["appearance"], "personality": r["personality"], "bio": r["bio"]}
            for r in response
        ]
        return {"message": "characters loaded", "data": formated_response}
    except Exception:
        raise HTTPException(400, detail="Unable to load the characters")

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
    
    except Exception:
        db.rollback()
        raise HTTPException(400, detail="Unable to create the character")