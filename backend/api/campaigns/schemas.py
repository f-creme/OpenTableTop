from pydantic import BaseModel

class CampaignGlobalRequest(BaseModel):
    title: str
    name: str

class NewParticipantRequest(BaseModel):
    participantName: str

class NewPlayerRequest(BaseModel):
    characterUuid: str
    characterName: str
    characterPortrait: bool