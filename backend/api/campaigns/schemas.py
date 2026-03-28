from pydantic import BaseModel

class CampaignGlobalRequest(BaseModel):
    title: str
    name: str