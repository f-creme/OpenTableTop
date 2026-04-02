import axiosInstance from "../axiosInstance";

export async function getMaps(campaignId: string) {
    const res = await axiosInstance.get(`/maps/${campaignId}`)
    return res.data.maps
}

export async function getIllustrations(campaignId: string) {
    const res = await axiosInstance.get(`/illus/${campaignId}`);
    return res.data.illus
}

export async function getTokens(campaignId: string) {
    const res = await axiosInstance.get(`tokens/${campaignId}`);
    return res.data.tokens;
}