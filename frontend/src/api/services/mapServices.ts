import axiosInstance from "../axiosInstance";

export async function getMaps(campaignUuid: string) {
    const res = await axiosInstance.get(`/maps/${campaignUuid}`)
    return res.data.maps
}

export async function getIllustrations(campaignUuid: string) {
    const res = await axiosInstance.get(`/illus/${campaignUuid}`);
    return res.data.illus
}

export async function getTokens(campaignId: string) {
    const res = await axiosInstance.get(`tokens/${campaignId}`);
    return res.data.tokens;
}