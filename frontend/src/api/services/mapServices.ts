import axiosInstance from "../axiosInstance";

export async function getMaps() {
    const res = await axiosInstance.get("/maps/")
    return res.data.maps
}