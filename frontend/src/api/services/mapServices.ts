import axiosInstance from "../axiosInstance";

export async function getMaps(campaignId: number) {
    const res = await axiosInstance.get(`/maps/${campaignId}`)
    return res.data.maps
}