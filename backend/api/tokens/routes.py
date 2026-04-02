from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
import os

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
    
    
@router.get("/{campaign_id}/{token}")
def get_token_image(campaign_id: int, token: str):
    """Return the selected token"""

    is_safe_filename = secure_urls.is_safe_filename(token)
    if not is_safe_filename:
        raise HTTPException(status_code=400, detail="Invalid file name")
    
    campaign_dir_name = f"campaign_{campaign_id:04d}"
    file_path = os.path.join(DATA_DIR, campaign_dir_name, "tokens", token)

    is_safe_path = secure_urls.is_safe_path(DATA_DIR, file_path)
    if not is_safe_path:
        raise HTTPException(status_code=400, detail="Unauthorized access")
        
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    
    raise HTTPException(status_code=404, detail="Token not found")
