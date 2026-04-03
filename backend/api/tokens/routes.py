from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from pathlib import Path
import os

from core.config_storage import get_campaign_dir
from core.config import DATA_DIR
from services import secure_urls
from db.db import get_db

router = APIRouter(prefix="/tokens", tags=["tokens"])

@router.get("/{campaign_uuid}")
def list_tokens(campaign_uuid: str, db = Depends(get_db)):
    """Return list of available tokens"""
    try: 
        with db.cursor() as cursor:
            cursor.execute(
                "SELECT uuid, file_name FROM files " \
                "WHERE file_type = 'token' AND campaign_uuid = %s " \
                "ORDER BY file_name ASC;", (campaign_uuid, )
            ) 
            files = cursor.fetchall() 
        data = [{"uuid": file["uuid"], "file_name": file["file_name"], "x": 0, "y": 0, "scale": 1} for file in files]
        return {"tokens": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
@router.get("/{campaign_uuid}/{file_uuid}")
def get_token_image(campaign_uuid: str, file_uuid: str):
    """Return the selected token"""

    is_safe_filename = secure_urls.is_safe_filename(file_uuid)
    if not is_safe_filename:
        raise HTTPException(status_code=400, detail="Invalid file name")
    
    campaign_dir_name = get_campaign_dir(campaign_uuid=campaign_uuid)
    tokens_dir = Path(campaign_dir_name) / "tokens" 

    matching_files = list(tokens_dir.glob(f"{file_uuid}.*"))
    if not matching_files:
        raise HTTPException(status_code=404, detail="File not found")
    
    if len(matching_files) > 1:
        raise HTTPException(status_code=500, detail="Multiple files found for UUID")
    
    file_path = matching_files[0]

    is_safe_path = secure_urls.is_safe_path(DATA_DIR, str(file_path))
    if not is_safe_path:
        raise HTTPException(status_code=400, detail="Unauthorized access")
       
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    
    raise HTTPException(status_code=404, detail="Token not found")
