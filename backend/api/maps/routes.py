from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from pathlib import Path
import os

from core.config import DATA_DIR
from core.config_storage import get_campaign_dir
from services import secure_urls
from db.db import get_db

router = APIRouter(prefix="/maps", tags=["maps"])

DATA_DIR = os.path.abspath(DATA_DIR)

@router.get("/{campaign_uuid}")
def list_maps(campaign_uuid: str, db = Depends(get_db)):
    """Return list of available maps"""
    try:
        with db.cursor() as cursor:
            cursor.execute(
                "SELECT uuid, file_name FROM files " \
                "WHERE file_type = 'map' AND campaign_uuid = %s " \
                "ORDER BY file_name ASC;", (campaign_uuid, )
            )
            maps = cursor.fetchall()
        
        print(maps, flush=True)
        return {"maps": maps}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
@router.get("/{campaign_uuid}/{file_uuid}")
def get_map(campaign_uuid: str, file_uuid: str):
    """Return the selected map"""

    is_safe_filename = secure_urls.is_safe_filename(file_uuid)
    if not is_safe_filename:
        raise HTTPException(status_code=400, detail="Invalid file name")
    
    campaign_dir_name = get_campaign_dir(campaign_uuid=campaign_uuid)
    maps_dir = Path(campaign_dir_name) / "maps" 

    matching_files = list(maps_dir.glob(f"{file_uuid}.*"))
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
    
    raise HTTPException(status_code=404, detail="Map not found")

