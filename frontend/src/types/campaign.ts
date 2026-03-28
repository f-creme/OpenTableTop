export interface CampaignAPI {
    id: number,
    title: string,
    user_role: "player" | "gm"
}

export interface Campaign {
    id: number,
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