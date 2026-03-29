from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os

from core.config import DATA_DIR

router = APIRouter(prefix="/illus", tags=["illus"])

@router.get("/{campaign_id}")
def list_illustrations(campaign_id: int):
    """Return list of available illustrations"""
    campaign_dir_name = f"campaign_{campaign_id:04d}"
    campaign_illus_dir = os.path.join(DATA_DIR, campaign_dir_name, "illustrations")
    try: 
        files = [f for f in os.listdir(campaign_illus_dir) if f.lower().endswith((".png", ".jpg", ".webp"))]
        return {"illus": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/{campaign_id}/{illus_name}")
def get_map(campaign_id: int, illus_name: str):
    """Return the selected illustration"""
    campaign_dir_name = f"campaign_{campaign_id:04d}"
    campaign_illus_dir = os.path.join(DATA_DIR, campaign_dir_name, "illustrations")

    file_path = os.path.join(campaign_illus_dir, illus_name)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="Illustration not found")

