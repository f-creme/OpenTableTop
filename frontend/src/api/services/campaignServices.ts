import axiosInstance from "../axiosInstance";
import type { CampaignAPI, Campaign } from "../../types/campaign";

function mapCampaign(apiCampaign: CampaignAPI): Campaign {
    return {
        id: apiCampaign.id,
        title: apiCampaign.title,
        userRole: apiCampaign.user_role
    }
}

export async function getCampaigns() {
    const res = await axiosInstance.get<CampaignAPI[]>("/campaigns/")
    return res.data.map(mapCampaign)
}