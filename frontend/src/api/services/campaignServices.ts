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

export async function getCampaignTitle(id: number) {
    const res = await axiosInstance.get(`/campaigns/${id}/title`);
    return res.data[0].campaign_title;
}

export async function putCampaignTitle(id: number, title: string) {
    const res = await axiosInstance.put(`/campaigns/${id}/title`, {title});
    return res.data;
}