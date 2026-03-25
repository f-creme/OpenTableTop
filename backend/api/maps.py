from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os

from core.config import MAPS_DIR

router = APIRouter(prefix="/maps", tags=["maps"])

@router.get("/")
def list_maps():
    """Return list of available maps"""
    try: 
        files = [f for f in os.listdir(MAPS_DIR) if f.lower().endswith((".png", ".jpg", ".webp"))]
        return {"maps": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/{map_name}")
def get_map(map_name: str):
    """Return the selected map"""
    file_path = os.path.join(MAPS_DIR, map_name)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="Map not found")

