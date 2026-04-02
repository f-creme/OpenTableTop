from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from api.auth.auth_utils import decode_token

security = HTTPBearer()

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> int:
    try: 
        payload = decode_token(credentials.credentials)
        return payload["user_uuid"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")