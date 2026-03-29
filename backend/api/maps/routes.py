from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os

from core.config import DATA_DIR, MAPS_DIR

router = APIRouter(prefix="/maps", tags=["maps"])

@router.get("/{campaign_id}")
def list_maps(campaign_id: int):
    """Return list of available maps"""
    campaign_dir_name = f"campaign_{campaign_id:04d}"
    campaign_maps_dir = os.path.join(DATA_DIR, campaign_dir_name, "maps")
    try: 
        files = [f for f in os.listdir(campaign_maps_dir) if f.lower().endswith((".png", ".jpg", ".webp"))]
        return {"maps": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/{campaign_id}/{map_name}")
def get_map(campaign_id: int, map_name: str):
    """Return the selected map"""
    campaign_dir_name = f"campaign_{campaign_id:04d}"
    campaign_maps_dir = os.path.join(DATA_DIR, campaign_dir_name, "maps")

    file_path = os.path.join(campaign_maps_dir, map_name)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="Map not found")

