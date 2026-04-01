from fastapi import APIRouter, HTTPException, Depends, File, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel
from pathlib import Path
from PIL import Image
import imghdr
import os
import psycopg2

from db.db import get_db
from api.dependencies.auth import get_current_user_id
from api.characters import repository
from services.token_generator import is_square, resize, make_token
from services import secure_urls
from core.config import DATA_DIR

router = APIRouter(prefix="/characters", tags=["characters"])

MAX_CHARACTER_PER_USER = 5
USER_QUOTA_LIMIT = 10 * 1024 * 1024
MAX_FILE_SIZE = 1 * 1024 * 1024

class CharacterRequest(BaseModel):
    id: int
    name: str
    classOrRole: str
    appearance: str
    personality: str
    bio: str

def get_user_path(user_id: int) -> Path:
    path = Path(f"{DATA_DIR}/user_{user_id:04d}")
    return path

def get_image_path(user_id: int, character_id: int) -> Path:
    filename = f"character_{character_id:04d}.webp"
    user_path = get_user_path(user_id=user_id)
    image_path = Path(f"{user_path}/characters/{filename}")
    return image_path

def get_token_path(user_id: int, character_id: int) -> Path:
    filename = f"character_{character_id:04d}.webp"
    user_path = get_user_path(user_id=user_id)
    token_path = Path(f"{user_path}/tokens/{filename}")
    return token_path

def get_folder_size(folder: Path) -> int:
    return sum(f.stat().st_size for f in folder.rglob("*") if f.is_file())

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
    
@router.put("/update")
async def update_character(data: CharacterRequest, user_id: int = Depends(get_current_user_id), db = Depends(get_db)):
    try:
        repository.update_character(
            db, data.id, user_id, data.name, data.classOrRole,
            data.appearance, data.personality, data.bio
        )
        db.commit()
        return {"message": "character updated"}
    
    except Exception:
        db.rollback()
        raise HTTPException(400, detail="Unable to create the character")

    
@router.post("/image/{character_id}")
async def save_character_image(character_id: int, user_id: int = Depends(get_current_user_id), file: UploadFile = File(...)):
    # check file type
    file_type = imghdr.what(file.file)
    if file_type not in ["png", "jpeg", "webp"]:
        raise HTTPException(400, detail="Unauthorized file type")
    
    is_safe_filename = secure_urls.is_safe_filename(str(file.filename))
    if not is_safe_filename:
        raise HTTPException(400, detail="Invalid file name")
    
    contents = await file.read()
    # Check user space
    folder = get_user_path(user_id=user_id)
    current_size = get_folder_size(folder=folder)
    if current_size + len(contents) > USER_QUOTA_LIMIT:
        raise HTTPException(400, detail="User quota exceeded")
    
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(400, detail="File is too large")
    
    # Image format
    img = Image.open(file.file)
    if not is_square(img=img):
        raise HTTPException(400, detail="Bad image format. Image must be a square")
    
    img = resize(img=img, size="giant")

    # Save image
    img.save(get_image_path(user_id=user_id, character_id=character_id))

    # Generate token
    token = make_token(img=img, final_size="medium")
    token.save(get_token_path(user_id=user_id, character_id=character_id))

    return {"message": "Files saved"}

@router.get("/{character_id}/portrait")
async def get_character_image(character_id: int, user_id: int = Depends(get_current_user_id)):
    image_path = get_image_path(user_id, character_id)
    exists_image = Path(image_path).exists()
    is_file_image = os.path.isfile(image_path)
    if exists_image and is_file_image:
        return FileResponse(image_path)
    raise HTTPException(404, detail="Portrait not found")

@router.get("/{character_id}/token")
async def get_character_token(character_id: int, user_id: int = Depends(get_current_user_id)):
    token_path = get_token_path(user_id, character_id)
    exists_token = Path(token_path).exists()
    is_file_token = os.path.isfile(token_path)
    if exists_token and is_file_token:
        return FileResponse(token_path)
    raise HTTPException(404, detail="Portrait not found")
    