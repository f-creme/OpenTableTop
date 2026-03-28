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

export async function putCampaignTitle(id: number, title: string) {
    const res = await axiosInstance.put(`/campaigns/${id}/title`, {title});
    return res.data;
}

// export async function postCampaign({ title, profile }: { title: string, profile: string }) {
//     return;
// }