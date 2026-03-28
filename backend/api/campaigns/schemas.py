from pydantic import BaseModel

class UpdateTitleRequest(BaseModel):
    title: str