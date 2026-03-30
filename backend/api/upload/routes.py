from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from pathlib import Path
import imghdr
import shutil
import os

from core.config import DATA_DIR
from services import secure_urls
from api.dependencies.auth import get_current_user_id
from db.db import get_db
from api.upload import repository

router = APIRouter(prefix="/upload", tags=["upload"])

DATA_DIR = os.path.abspath(DATA_DIR)

MAX_FILE_SIZE = 2 * 1024 * 1024
MAX_CAMPAIGN_SIZE = 100 * 1024 * 1024

dict_category = {"maps": "maps", "illustrations": "illustrations", "tokens": "tokens"}

def get_campaign_path(campaign_id: int) -> Path:
    path = Path(f"{DATA_DIR}/campaign_{campaign_id:04d}")
    return path

def get_folder_size(folder: Path) -> int:
    return sum(f.stat().st_size for f in folder.rglob("*") if f.is_file())


async def upload_file(category: str, campaign_id: int, user_id: int = Depends(get_current_user_id), file: UploadFile = File(...), db = Depends(get_db)):
    # Check file type
    file_type = imghdr.what(file.file)
    if file_type not in ["png", "jpeg", "webp"]:
        raise HTTPException(400, detail="Unauthorized file type")
    
    # Check role of user for the campaign
    is_user_gm = repository.get_user_role_for_campaign(db, user_id, campaign_id)
    if not is_user_gm:
        raise HTTPException(403, detail="Unauthorized access")

    is_safe_filename = secure_urls.is_safe_filename(str(file.filename))
    if not is_safe_filename:
        raise HTTPException(400, detail="Invalid file name")

    contents = await file.read()
    # Check user space
    folder = get_campaign_path(campaign_id=campaign_id)
    current_size = get_folder_size(folder)
    if current_size + len(contents) > MAX_CAMPAIGN_SIZE:
        raise HTTPException(400, detail="Campaign quota exceeded")

    # Check file size
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(400, detail="File is too large")

    safe_name = str(file.filename).replace("..", "_").replace("/", "_")
    file_path = folder / dict_category[category] / safe_name
    with open(file_path, "wb") as f:
        f.write(contents)

    return {"filename": safe_name}

@router.post("/maps/{campaign_id}")
async def upload_map(
    campaign_id: int,
    user_id: int = Depends(get_current_user_id),
    file: UploadFile = File(...),
    db = Depends(get_db)
):
    return await upload_file("maps", campaign_id, user_id, file, db)


@router.post("/illustrations/{campaign_id}")
async def upload_illustration(
    campaign_id: int,
    user_id: int = Depends(get_current_user_id),
    file: UploadFile = File(...),
    db = Depends(get_db)
):
    return await upload_file("illustrations", campaign_id, user_id, file, db)

@router.post("/tokens/{campaign_id}")
async def upload_token(
    campaign_id: int,
    user_id: int = Depends(get_current_user_id),
    file: UploadFile = File(...),
    db = Depends(get_db)
):
    return await upload_file("tokens", campaign_id, user_id, file, db)

@router.delete("/{category}/{campaign_id}/{filename}")
def delete_file(category: str, campaign_id: int, filename: str, user_id: int = Depends(get_current_user_id), db = Depends(get_db)):
    _ALLOWED_CATEGORIES = {"maps", "illustrations", "tokens"}
    if category not in _ALLOWED_CATEGORIES:
        raise HTTPException(400, "Invalid Ca")
    
    is_user_gm = repository.get_user_role_for_campaign(db, user_id, campaign_id)
    if not is_user_gm:
        raise HTTPException(403, "Unauthorized access")
    
    if not secure_urls.is_safe_filename(filename):
        raise HTTPException(400, "Invalid file name")
    
    folder = get_campaign_path(campaign_id)
    file_path = folder / category / filename
    file_path = file_path.resolve()

    if not str(file_path).startswith(str(folder)):
        raise HTTPException(400, "File path is invalid")
    
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(404, "File not found")
    
    try: 
        file_path.unlink()
    except Exception as e:
        raise HTTPException(500, f"Cannot delete file: {str(e)}")
    
    return {"detail": "File deleted"}