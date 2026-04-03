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
    uuid: str
    name: str
    classOrRole: str
    appearance: str
    personality: str
    bio: str

def get_user_path(user_uuid: str) -> Path:
    path = Path(f"{DATA_DIR}/user_{user_uuid}")
    return path

def get_image_path(user_uuid: str, file_uuid: str) -> Path:
    filename = f"{file_uuid}.webp"
    user_path = get_user_path(user_uuid=user_uuid)
    image_path = Path(f"{user_path}/characters/{filename}")
    return image_path

def get_token_path(user_uuid: str, file_uuid: str) -> Path:
    filename = f"{file_uuid}.webp"
    user_path = get_user_path(user_uuid=user_uuid)
    token_path = Path(f"{user_path}/tokens/{filename}")
    return token_path

def get_folder_size(folder: Path) -> int:
    return sum(f.stat().st_size for f in folder.rglob("*") if f.is_file())

@router.get("/")
def get_characters(user_uuid: str = Depends(get_current_user_id), db = Depends(get_db)):
    try: 
        response = repository.get_user_characters(db, user_uuid)
        formated_response = [
            {"uuid": r["character_uuid"], "name": r["name"], "classOrRole": r["class"],
            "appearance": r["appearance"], "personality": r["personality"], "bio": r["bio"]}
            for r in response
        ]
        return {"message": "characters loaded", "data": formated_response}
    except Exception:
        raise HTTPException(400, detail="Unable to load the characters")

@router.post("/create")
def create_character(
    data: CharacterRequest,
    user_uuid: str = Depends(get_current_user_id),
    db = Depends(get_db)
):
    try: 
        character_uuid = repository.create_new_character(
            db, user_uuid, data.name, data.classOrRole, 
            data.appearance, data.personality, data.bio, 
            MAX_CHARACTER_PER_USER
        )
        db.commit()
        return {"message": "character created", "characterId": character_uuid}
    
    except Exception:
        db.rollback()
        raise HTTPException(400, detail="Unable to create the character")
    
@router.put("/update")
async def update_character(data: CharacterRequest, user_uuid: str = Depends(get_current_user_id), db = Depends(get_db)):
    try:
        repository.update_character(
            db, data.uuid, user_uuid, data.name, data.classOrRole,
            data.appearance, data.personality, data.bio
        )
        db.commit()
        return {"message": "character updated"}
    
    except Exception:
        db.rollback()
        raise HTTPException(400, detail="Unable to create the character")

    
@router.post("/image/{character_uuid}")
async def save_character_image(character_uuid: str, user_uuid: str = Depends(get_current_user_id), file: UploadFile = File(...), db = Depends(get_db)):
    # check file type
    file_type = imghdr.what(file.file)
    if file_type not in ["png", "jpeg", "webp"]:
        raise HTTPException(400, detail="Unauthorized file type")
    
    is_safe_filename = secure_urls.is_safe_filename(str(file.filename))
    if not is_safe_filename:
        raise HTTPException(400, detail="Invalid file name")
    
    contents = await file.read()
    # Check user space
    folder = get_user_path(user_uuid=user_uuid)
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

    # Register in database and get a file uuid
    try:
        existing_files_uuid = repository.check_if_already_exists(db, character_uuid=character_uuid)
        print(existing_files_uuid, flush=True)
        safe_name = str(file.filename).replace("..", "_").replace("/", "_").replace(" ", "_")
        if existing_files_uuid is None:
            portrait_uuid = repository.record_new_character_file(db, safe_name, "portrait", user_uuid, character_uuid)
            token_uuid = repository.record_new_character_file(db, safe_name, "token", user_uuid, character_uuid)
        else: 
            portrait_uuid = repository.update_existing_character_file(db, str(existing_files_uuid["portrait_uuid"]), safe_name)
            token_uuid = repository.update_existing_character_file(db, str(existing_files_uuid["token_uuid"]), safe_name)

        # Save portrait
        img.save(get_image_path(user_uuid, portrait_uuid))

        # Generate token
        token = make_token(img=img, final_size="medium")
        token.save(get_token_path(user_uuid, token_uuid))

        db.commit()
        return {"message": "Files saved"}
    except Exception:
        db.rollback()
        raise HTTPException(400, detail="Unable to save file.")

@router.get("/{character_uuid}/portrait")
async def get_character_image(character_uuid: str, user_uuid: str = Depends(get_current_user_id), db = Depends(get_db)):
    file = repository.get_character_file(db, character_uuid, "portrait")
    if file is None:
        raise HTTPException(404, "Portrait not found")
    
    portrait_uuid = file["uuid"]
    owner_uuid = file["owner_uuid"]
    file_path = get_image_path(owner_uuid, portrait_uuid)

    exists_image = Path(file_path).exists()
    is_file_image = os.path.isfile(file_path)
    if exists_image and is_file_image:
        return FileResponse(file_path)
    raise HTTPException(404, detail="Portrait not found")

@router.get("/{character_uuid}/token")
async def get_character_token(character_uuid: str, user_uuid: str = Depends(get_current_user_id), db = Depends(get_db)):
    file = repository.get_character_file(db, character_uuid, "token")
    if file is None:
        raise HTTPException(404, "Token not found")
    
    token_uuid = file["uuid"]
    owner_uuid = file["owner_uuid"]
    file_path = get_token_path(owner_uuid, token_uuid)

    exists_image = Path(file_path).exists()
    is_file_image = os.path.isfile(file_path)
    if exists_image and is_file_image:
        return FileResponse(file_path)
    raise HTTPException(404, detail="Token not found")