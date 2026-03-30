from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os

from core.config import DATA_DIR
from services import secure_urls

router = APIRouter(prefix="/maps", tags=["maps"])

DATA_DIR = os.path.abspath(DATA_DIR)

@router.get("/{campaign_id}")
def list_maps(campaign_id: int):
    """Return list of available maps"""

    campaign_dir_name = f"campaign_{campaign_id:04d}"
    campaign_maps_dir = os.path.join(DATA_DIR, campaign_dir_name, "maps")
    try: 
        files = sorted(
            [f for f in os.listdir(campaign_maps_dir) if f.lower().endswith((".png", ".jpg", ".webp"))],
            key=lambda x: x.lower()
        )
        return {"maps": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
@router.get("/{campaign_id}/{map_name}")
def get_map(campaign_id: int, map_name: str):
    """Return the selected map"""

    is_safe_filename = secure_urls.is_safe_filename(map_name)
    if not is_safe_filename:
        raise HTTPException(status_code=400, detail="Invalid file name")
    
    campaign_dir_name = f"campaign_{campaign_id:04d}"
    campaign_maps_dir = os.path.join(DATA_DIR, campaign_dir_name, "maps")
    file_path = os.path.join(campaign_maps_dir, map_name)

    is_safe_path = secure_urls.is_safe_path(DATA_DIR, file_path)
    if not is_safe_path:
        raise HTTPException(status_code=400, detail="Unauthorized access")
       
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    
    raise HTTPException(status_code=404, detail="Map not found")

