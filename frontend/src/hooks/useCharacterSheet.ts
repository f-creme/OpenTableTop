import toast from "react-hot-toast";
import type { Character } from "../types/character";
import { addNewCharacterToDB } from "../api/services/characterServices";
import axios from "axios";

export const useCharacterSheet = () => {
   
    const createCharacter = async (
        character: Character
    ) => {
        await toast.promise(
            addNewCharacterToDB(character)
                .then(res => console.log(res)),
            {
                loading: "Création du personnage...",
                success: "Personnage créé",
                error: (err) => axios.isAxiosError(err) ? err.response?.data?.detail || "Erreur lors de la création" : "Erreur lors de la création",
            }
        )
    };

    return {
        createCharacter
    }
};