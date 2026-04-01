import axiosInstance from "../axiosInstance";
import type { Character } from "../../types/character";

export async function addNewCharacterToDB(character: Character) {
    const res = await axiosInstance.post("/characters/create", character)
    return res.data.characterId
};

export async function getMyCharacters() {
    const res = await axiosInstance.get("/characters/");
    return res.data
};

export async function uploadCharacterImage(characterId: number, file: FormData) {
    const res = await axiosInstance.post(`/characters/image/${characterId}`, file);
    return res.data;
}

export async function getCharacterPortrait(characterId: number) {
    const res = await axiosInstance.get(`/characters/${characterId}/portrait`, {
        responseType: "blob",
    });
    return res.data;
}

export async function getCharacterToken(characterId: number) {
    const res = await axiosInstance.get(`/characters/${characterId}/token`, {
        responseType: "blob",
    });
    return res.data;
}