import axiosInstance from "../axiosInstance";

export async function uploadFile(campaignUuid: string, file: FormData, category: "maps" | "illustrations" | "tokens", tokenSize?: "small" | "medium" | "big" | "giant") {
    if (tokenSize) file.append("size", tokenSize);
    await axiosInstance.post(`/upload/${category}/${campaignUuid}`, file);
}

export async function deleteFile(campaignUuid: string, fileUuid: string, category: "maps" | "illustrations" | "tokens") {
    await axiosInstance.delete(`/upload/${category}/${campaignUuid}/${fileUuid}`);
}

export async function getQuota(campaignUuid: string) {
    const res = await axiosInstance.get(`/upload/${campaignUuid}/quota`);
    return res.data.quota;
}