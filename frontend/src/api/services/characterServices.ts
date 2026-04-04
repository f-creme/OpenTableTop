import axiosInstance from "../axiosInstance";
import type { Character } from "../../types/character";

export async function addNewCharacterToDB(character: Character) {
    const res = await axiosInstance.post("/characters/create", character)
    return res.data.characterId
};

export async function updateCharacterInDB(character:Character) {
    const res = await axiosInstance.put("/characters/update", character)
    return res.data
}

export async function getMyCharacters() {
    const res = await axiosInstance.get("/characters/");
    return res.data
};

export async function uploadCharacterImage(characterUuid: string, file: FormData) {
    const res = await axiosInstance.post(`/characters/image/${characterUuid}`, file);
    return res.data;
}

export async function getCharacterPortrait(characterUuid: string) {
    const res = await axiosInstance.get(`/characters/${characterUuid}/portrait`, {
        responseType: "blob",
    });
    return res.data;
}

export async function getCharacterToken(characterUuid: string) {
    const res = await axiosInstance.get(`/characters/${characterUuid}/token`, {
        responseType: "blob",
    });
    return res.data;
}

export async function getCharacterDetails(characterUuid: string) {
    const res = await axiosInstance.get(`/characters/${characterUuid}`)
    return res.data
}

export async function addTokenToCampaign(campaignUuid: string, characterUuid: string, characterName: string, characterPortrait: boolean) {
    const res = await axiosInstance.post(`/campaigns/${campaignUuid}/join`, {
        characterUuid: characterUuid, 
        characterName: characterName, 
        characterPortrait: characterPortrait
    });
    return res
}