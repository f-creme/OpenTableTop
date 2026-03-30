import axiosInstance from "../axiosInstance";

export async function uploadFile(campaignId: number, file: FormData, category: "maps" | "illustrations" | "tokens") {
    const res = await axiosInstance.post(`/upload/${category}/${campaignId}`, file)
    console.log(res.data);
}