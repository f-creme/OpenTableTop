from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import os

from core.config import DATA_DIR

router = APIRouter(prefix="/tokens", tags=["tokens"])

@router.get("/{campaign_id}")
def list_tokens(campaign_id: int):
    """Return list of available tokens"""
    campaign_dir_name = f"campaign_{campaign_id:04d}"
    campaign_tokens_dir = os.path.join(DATA_DIR, campaign_dir_name, "tokens")
    try: 
        files = [f for f in os.listdir(campaign_tokens_dir) if f.lower().endswith((".png", ".jpg", ".webp"))]
        data = [{"id": f, "x": 0, "y": 0, "scale": 1} for f in files]
        return {"tokens": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/{campaign_id}/{token}")
def get_token_image(campaign_id: int, token: str):
    """Return the selected token"""
    campaign_dir_name = f"campaign_{campaign_id:04d}"
    file_path = os.path.join(DATA_DIR, campaign_dir_name, "tokens", token)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    raise HTTPException(status_code=404, detail="Token not found")
