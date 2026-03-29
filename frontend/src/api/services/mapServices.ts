import axiosInstance from "../axiosInstance";

export async function getMaps(campaignId: number) {
    const res = await axiosInstance.get(`/maps/${campaignId}`)
    return res.data.maps
}

export async function getIllustrations(campaignId: number) {
    const res = await axiosInstance.get(`/illus/${campaignId}`);
    return res.data.illus
}