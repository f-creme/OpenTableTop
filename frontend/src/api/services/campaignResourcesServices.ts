import axiosInstance from "../axiosInstance";

export async function uploadFile(campaignId: number, file: FormData, category: "maps" | "illustrations" | "tokens") {
    await axiosInstance.post(`/upload/${category}/${campaignId}`, file);
}

export async function deleteFile(campaignId: number, filename: string, category: "maps" | "illustrations" | "tokens") {
    const res = await axiosInstance.delete(`/upload/${category}/${campaignId}/${filename}`);
    console.log(res.data);
}