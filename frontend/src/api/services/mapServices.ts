import axiosInstance from "../axiosInstance";

export async function getMaps(campaignUuid: string) {
    const res = await axiosInstance.get(`/maps/${campaignUuid}`)
    return res.data.maps
}

export async function getIllustrations(campaignUuid: string) {
    const res = await axiosInstance.get(`/illus/${campaignUuid}`);
    return res.data.illus
}

export async function getTokens(campaignUuid: string) {
    const res = await axiosInstance.get(`tokens/${campaignUuid}`);
    return res.data.tokens;
}