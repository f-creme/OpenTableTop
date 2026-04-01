import toast from "react-hot-toast";
import type { Character } from "../types/character";
import { addNewCharacterToDB, getMyCharacters, uploadCharacterImage } from "../api/services/characterServices";
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
    const uploadImage = async (characterId: number, file: File) => {
        if (characterId < 0) return;
        try {
            const formData = new FormData();
            formData.append("file", file);

            await toast.promise(
                uploadCharacterImage(characterId, formData),
                    {
                        loading: "Enregistrement des images...",
                        success: "Image sauvegardée avec succès",
                        error: (err) => axios.isAxiosError(err) ? err.response?.data?.detail || "Erreur lors de l'enregistrement de l'image" : "Erreur lors de l'enregistrement de l'image"
                    }
            )
        } catch (err: any) {
            console.log(err);
        };
    } 

    const createCharacter = async (
        character: Character,
        file: File | null
    ) => {
        const characterId = await toast.promise(
            addNewCharacterToDB(character),
            {
                loading: "Création du personnage...",
                success: "Personnage créé.\n Rechargez la page pour le sélectionner",
                error: (err) => axios.isAxiosError(err) ? err.response?.data?.detail || "Erreur lors de la création" : "Erreur lors de la création",
            }
        );
        if (!characterId) return;
        if (!file) return;
        uploadImage(characterId, file);
    };

    return {
        availCharacters,
        loadCharacters,
        createCharacter
    }
};