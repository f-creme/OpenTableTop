from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
import os

from db.db import get_db
from core.config import DATA_DIR
from services import secure_urls

router = APIRouter(prefix="/illus", tags=["illus"])

DATA_DIR = os.path.abspath(DATA_DIR)

@router.get("/{campaign_uuid}")
def list_illustrations(campaign_uuid: str, db = Depends(get_db)):
    """Return list of available illustrations"""
    try: 
        with db.cursor() as cursor:
            cursor.execute("" \
            "SELECT uuid, file_name FROM files " \
            "WHERE file_type = 'illustration' AND campaign_uuid = %s " \
            "ORDER BY file_name ASC;", (campaign_uuid, )
            )
            illustrations = cursor.fetchall()
        return {"illus": illustrations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/{campaign_id}/{illus_name}")
def get_map(campaign_id: int, illus_name: str):
    """Return the selected illustration"""

    is_safe_filename = secure_urls.is_safe_filename(illus_name)
    if not is_safe_filename:
        raise HTTPException(status_code=400, detail="Invalid file name")
    
    campaign_dir_name = f"campaign_{campaign_id:04d}"
    campaign_illus_dir = os.path.join(DATA_DIR, campaign_dir_name, "illustrations")
    file_path = os.path.join(campaign_illus_dir, illus_name)

    is_safe_path = secure_urls.is_safe_path(DATA_DIR, file_path)
    if not is_safe_path:
        raise HTTPException(status_code=400, detail="Unauthorized access")

    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    
    raise HTTPException(status_code=404, detail="Illustration not found")

