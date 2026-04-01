import toast from "react-hot-toast";
import type { Character } from "../types/character";
import { addNewCharacterToDB, getMyCharacters } from "../api/services/characterServices";
import axios from "axios";
import { useState } from "react";

export const useCharacterSheet = () => {
    const [availCharacters, setAvailCharacters] = useState<Character[]>([])

    const loadCharacters = async () => {
        await toast.promise(
            getMyCharacters()
                .then(res => {setAvailCharacters(res.data)}),
            {
                loading: "Récupération de mes personnages...",
                success: "Personnages récupérées",
                error: (err) => axios.isAxiosError(err) ? err.response?.data?.detail || "Erreur lors de la récupération" : "Erreur lors de la récupération",
            }
        )
    };

    const createCharacter = async (
        character: Character
    ) => {
        await toast.promise(
            addNewCharacterToDB(character)
                .then(res => console.log(res)),
            {
                loading: "Création du personnage...",
                success: "Personnage créé.\n Rechargez la page pour le sélectionner",
                error: (err) => axios.isAxiosError(err) ? err.response?.data?.detail || "Erreur lors de la création" : "Erreur lors de la création",
            }
        )
    };

    return {
        availCharacters,
        loadCharacters,
        createCharacter
    }
};