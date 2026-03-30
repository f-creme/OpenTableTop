import axiosInstance from "../axiosInstance";

export async function uploadMap(campaignId: number, map: FormData) {
    const res = await axiosInstance.post(`/upload/maps/${campaignId}`, map)
    console.log(res.data);
}