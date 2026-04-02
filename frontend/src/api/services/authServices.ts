import axiosInstance from "../axiosInstance";

export async function getProfile() {
    const res = await axiosInstance.get("/auth/public");
    return res.data
}