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