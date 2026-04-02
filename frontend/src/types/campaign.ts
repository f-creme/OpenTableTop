export interface CampaignAPI {
    id: string,
    title: string,
    user_role: "player" | "gm"
}

export interface Campaign {
    id: string,
    title: string,
    userRole: "player" | "gm"
}

export interface CampaignGlobalAPI {
    campaign_title: string,
    public_name: string | null,
    character_name: string | null 
}

export interface CampaignGlobal {
    campaignTitle: string,
    userPublicName: string | null, 
    userCampaignCharacterName: string | null
}

export interface CampaignUsersAPI {
    id: number,
    role: string, 
    character_name: string,
    public_name: string
}

export interface CampaignUsers {
    idCampaignUser: number,
    userRole: string, 
    characterName: string
    publicName: string
}