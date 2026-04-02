import axiosInstance from "../axiosInstance";
import type { CampaignAPI, Campaign } from "../../types/campaign";
import type { CampaignGlobalAPI, CampaignGlobal } from "../../types/campaign";
import type { CampaignUsersAPI, CampaignUsers } from "../../types/campaign";

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

function mapCampaignUsers(apiCampaignUser: CampaignUsersAPI): CampaignUsers {
    return {
        idCampaignUser: apiCampaignUser.id,
        userRole: apiCampaignUser.role,
        characterName: apiCampaignUser.character_name,
        publicName: apiCampaignUser.public_name
    }
}

export async function getCampaigns() {
    const res = await axiosInstance.get<CampaignAPI[]>("/campaigns/")
    return res.data.map(mapCampaign)
}

export async function getCampaignGlobal(id: string) {
    const res = await axiosInstance.get(`/campaigns/${id}/global`);
    return res.data.map(mapCampaignGlobal)[0];
}

export async function putCampaignGlobal(id: string, title: string, name: string) {
    const res = await axiosInstance.put(`/campaigns/${id}/update-global`, {title, name});
    return res.data;
}

export async function postNewCampaign(title: string, name: string) {
    const res = await axiosInstance.post(`/campaigns/create`, {title, name});
    return res.data;
}

export async function DeleteCampaign(id: number) {
    const res = await axiosInstance.delete(`/campaigns/${id}/delete`);
    return res.data;
}

export async function getInvitedUsers(id: number) {
    const res = await axiosInstance.get(`/campaigns/${id}/users`)
    return res.data.map(mapCampaignUsers)
}

export async function removeUserFromCampaign(idCampaignUser: number) {
    // id corresponds to a user in a given campaign (i.e. || id | user_id | campaign_id ||)
    const res = await axiosInstance.delete(`/campaigns/remove_user/${idCampaignUser}`)
    return res.data;
}

export async function addParticipantToCampaign(campaignId: number, participantName: string) {
    const res = await axiosInstance.post(`/campaigns/${campaignId}/add_participant`, {participantName})
    return res.data;
}