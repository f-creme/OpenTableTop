import axiosInstance from "../axiosInstance";

export async function uploadFile(campaignId: number, file: FormData, category: "maps" | "illustrations" | "tokens") {
    await axiosInstance.post(`/upload/${category}/${campaignId}`, file);
}

export async function deleteFile(campaignId: number, filename: string, category: "maps" | "illustrations" | "tokens") {
    await axiosInstance.delete(`/upload/${category}/${campaignId}/${filename}`);
}

export async function getQuota(campaignId: string) {
    const res = await axiosInstance.get(`/upload/${campaignId}/quota`);
    return res.data.quota;
}