import toast from "react-hot-toast";
import type { Character } from "../types/character";
import { 
    addNewCharacterToDB, getMyCharacters, uploadCharacterImage,
    getCharacterPortrait, getCharacterToken,
    updateCharacterInDB
 } from "../api/services/characterServices";
import axios from "axios";
import { useState } from "react";

export const useCharacterSheet = () => {
    const [availCharacters, setAvailCharacters] = useState<Character[]>([]);

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

    const loadCharacterPortrait = async(characterId: number) => {
        try {
            const blob = await getCharacterPortrait(characterId);
            const url = URL.createObjectURL(blob);
            return url;
        } catch {
            console.error("Erreur lors du téléchargement du portrait")
            return null;
        };
    };

    const loadCharacterToken = async(characterId: number) => {
        try {
            const blob = await getCharacterToken(characterId);
            const url = URL.createObjectURL(blob);
            return url;
        } catch {
            console.error("Erreur lors du téléchargement du token")
            return null;
        };
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
                success: "Personnage créé.\nRechargez la page pour le sélectionner",
                error: (err) => axios.isAxiosError(err) ? err.response?.data?.detail || "Erreur lors de la création" : "Erreur lors de la création",
            }
        );
        if (!characterId) return;
        if (!file) return;
        uploadImage(characterId, file);
    };

    const updateCharacter = async (
        character: Character,
        file: File | null
    ) => {
        await toast.promise(
            updateCharacterInDB(character),
            {
                loading: "Mise à jour du personnage...", 
                success: "Personnage mis à jour.\nRechargez la page.",
                error: (err) => axios.isAxiosError(err) ? err.response?.data?.detail || "Erreur lors de la mise à jour" : "Erreur lors de la mise à jour",
            }
        );
        if (!file) return;
        if (character.id < 0) return;
        uploadImage(character.id, file)
    }

    return {
        availCharacters,
        loadCharacterPortrait, 
        loadCharacterToken,
        loadCharacters,
        createCharacter,
        updateCharacter
    }
};