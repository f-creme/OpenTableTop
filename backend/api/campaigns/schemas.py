from pydantic import BaseModel

class UpdateCampaignGlobalRequest(BaseModel):
    title: str
    name: str