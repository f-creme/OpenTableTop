import axiosInstance from "../axiosInstance";
import type { Character } from "../../types/character";

export async function addNewCharacterToDB(character: Character) {
    const res = await axiosInstance.post("/characters/create", character)
    return res.data.characterId
};

export async function getMyCharacters() {
    const res = await axiosInstance.get("/characters/");
    return res.data
}