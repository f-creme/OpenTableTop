from fastapi import APIRouter, Form, HTTPException, UploadFile, File, Depends
from pathlib import Path
from PIL import Image
import imghdr
import os

from services.token_generator import is_square, make_token
from core.config import DATA_DIR
from services import secure_urls
from api.dependencies.auth import get_current_user_id
from db.db import get_db
from api.upload import repository
from core.config_storage import get_campaign_dir

router = APIRouter(prefix="/upload", tags=["upload"])

DATA_DIR = os.path.abspath(DATA_DIR)

MAX_FILE_SIZE = 2 * 1024 * 1024
MAX_CAMPAIGN_SIZE = 100 * 1024 * 1024

dict_category = {"maps": "map", "illustrations": "illustration", "tokens": "token"}

def get_folder_size(folder: Path) -> int:
    return sum(f.stat().st_size for f in folder.rglob("*") if f.is_file())


async def upload_file(category: str, campaign_uuid: str, user_uuid: str = Depends(get_current_user_id), file: UploadFile = File(...), db = Depends(get_db), token_size: str | None = "medium"):
    # Check file type
    file_type = imghdr.what(file.file)
    if file_type not in ["png", "jpeg", "webp"]:
        raise HTTPException(400, detail="Unauthorized file type")
    
    # Check role of user for the campaign
    is_user_gm = repository.get_user_role_for_campaign(db, user_uuid=user_uuid, campaign_uuid=campaign_uuid)
    if not is_user_gm:
        raise HTTPException(403, detail="Unauthorized access")

    is_safe_filename = secure_urls.is_safe_filename(str(file.filename))
    if not is_safe_filename:
        raise HTTPException(400, detail="Invalid file name")

    contents = await file.read()
    # Check user space
    folder = get_campaign_dir(campaign_uuid=campaign_uuid)
    current_size = get_folder_size(Path(folder))
    if current_size + len(contents) > MAX_CAMPAIGN_SIZE:
        raise HTTPException(400, detail="Campaign quota exceeded")

    # Check file size
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(400, detail="File is too large")

    safe_name = str(file.filename).replace("..", "_").replace("/", "_")

    # Register safe name in database and get a file uuid
    try: 
        new_file_uuid = repository.record_file(db, safe_name, dict_category[category], user_uuid, campaign_uuid)
        file_path = Path(folder) / category / f"{new_file_uuid}.{file_type}"

        if category != "tokens":
            with open(file_path, "wb") as f:
                f.write(contents)
                  
        elif category == "tokens":
            img = Image.open(file.file)
            if not is_square(img=img):
                raise HTTPException(400, detail="Invalid image format. Token image must be a square")
            print(token_size, flush=True)
            if token_size is None or token_size == "medium":
                token = make_token(img=img, final_size="medium")
            elif token_size == "small": 
                token = make_token(img=img, final_size="small")
            elif token_size =="big":
                token = make_token(img=img, final_size="big")
            elif token_size == "giant":
                token = make_token(img=img, final_size="giant")
            
            if file_type in ["jpeg", "jpg"]:
                token = token.convert("RGB") # type: ignore

            token.save(file_path) # type: ignore

    except:
        db.rollback()
        raise HTTPException(400, detail="Unable to record file in the database")
    
    db.commit()
    return {"filename": safe_name}

@router.post("/maps/{campaign_uuid}")
async def upload_map(
    campaign_uuid: str,
    user_uuid: str = Depends(get_current_user_id),
    file: UploadFile = File(...),
    token_size: str | None = Form(None),
    db = Depends(get_db)
):
    return await upload_file("maps", campaign_uuid, user_uuid, file, db)


@router.post("/illustrations/{campaign_uuid}")
async def upload_illustration(
    campaign_uuid: str,
    user_uuid: str = Depends(get_current_user_id),
    file: UploadFile = File(...),
    token_size: str | None = Form(None),
    db = Depends(get_db)
):
    return await upload_file("illustrations", campaign_uuid, user_uuid, file, db)

@router.post("/tokens/{campaign_uuid}")
async def upload_token(
    campaign_uuid: str,
    user_uuid: str = Depends(get_current_user_id),
    file: UploadFile = File(...),
    size: str | None = Form(None),
    db = Depends(get_db)
):  
    return await upload_file("tokens", campaign_uuid, user_uuid, file, db, size)

@router.delete("/{category}/{campaign_uuid}/{file_uuid}")
def delete_file(category: str, campaign_uuid: str, file_uuid: str, user_uuid: str = Depends(get_current_user_id), db = Depends(get_db)):
    _ALLOWED_CATEGORIES = {"maps", "illustrations", "tokens"}
    if category not in _ALLOWED_CATEGORIES:
        raise HTTPException(400, "Invalid Category")
    
    is_user_gm = repository.get_user_role_for_campaign(db, user_uuid, campaign_uuid)
    if not is_user_gm:
        raise HTTPException(403, "Unauthorized access")
    
    deleted_uuid = repository.delete_file(db, file_uuid=file_uuid, campaign_uuid=campaign_uuid)
    if deleted_uuid is None:
        db.rollback()
        raise HTTPException(404, "File not found")
    
    folder = Path(get_campaign_dir(campaign_uuid)).resolve()
    category_path = folder / category
    
    files = list(category_path.glob(f"{deleted_uuid}.*"))
    if not files:
        raise HTTPException(404, "File not found")
    
    file_path = files[0]

    try: 
        file_path.relative_to(folder)
    except ValueError:
        raise HTTPException(400, "File path is invalid")
    
    try:
        file_path.unlink()
    except Exception as e:
        raise HTTPException(500, f"Cannot delete file: {str(e)}")

    db.commit()    
    return {"detail": "File deleted"}


@router.get("/{campaign_uuid}/quota")
def get_campaign_quota(campaign_uuid: str):
    folder = get_campaign_dir(campaign_uuid)
    current_size = get_folder_size(Path(folder))
    max_size = MAX_CAMPAIGN_SIZE
    return {"quota": {"currentSize": current_size, "maxSize": max_size}}