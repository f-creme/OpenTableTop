import axiosInstance from "../axiosInstance";
import type { CampaignAPI, Campaign } from "../../types/campaign";
import type { CampaignGlobalAPI, CampaignGlobal } from "../../types/campaign";

function mapCampaign(apiCampaign: CampaignAPI): Campaign {
    return {
        id: apiCampaign.id,
        title: apiCampaign.title,
        userRole: apiCampaign.user_role
    }
}

function mapCampaignGlobal(apiCampaignGlobal: CampaignGlobalAPI): CampaignGlobal {
    return {
        campaignTitle: apiCampaignGlobal.campaign_title,
        userPublicName: apiCampaignGlobal.public_name,
        userCampaignCharacterName: apiCampaignGlobal.character_name
    }
}

export async function getCampaigns() {
    const res = await axiosInstance.get<CampaignAPI[]>("/campaigns/")
    return res.data.map(mapCampaign)
}

export async function getCampaignGlobal(id: number) {
    const res = await axiosInstance.get(`/campaigns/${id}/global`);
    return res.data.map(mapCampaignGlobal)[0];
}

export async function putCampaignGlobal(id: number, title: string, name: string) {
    const res = await axiosInstance.put(`/campaigns/${id}/title`, {title, name});
    return res.data;
}