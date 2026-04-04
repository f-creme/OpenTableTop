import toast from "react-hot-toast";
import type { Character } from "../types/character";
import { 
    addNewCharacterToDB, getMyCharacters, uploadCharacterImage,
    getCharacterPortrait, getCharacterToken,
    updateCharacterInDB,
    addTokenToCampaign
 } from "../api/services/characterServices";
import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const useCharacterSheet = () => {
    const { t } = useTranslation();
    const [availCharacters, setAvailCharacters] = useState<Character[]>([]);

    const loadCharacters = async () => {
        await toast.promise(
            getMyCharacters()
                .then(res => {setAvailCharacters(res.data)}),
            {
                loading: t("page.character-sheet.toast.load.loading"), 
                success: t("page.character-sheet.toast.load.success"),
                error: (err) => axios.isAxiosError(err) ? err.response?.data?.detail || t("page.character-sheet.toast.load.error") : t("page.character-sheet.toast.load.error"),
            }
        )
    };

    const loadCharacterPortrait = async(characterUuid: string) => {
        try {
            const blob = await getCharacterPortrait(characterUuid);
            const url = URL.createObjectURL(blob);
            return url;
        } catch {
            console.error("Portrait download error")
            return null;
        };
    };

    const loadCharacterToken = async(characterUuid: string) => {
        try {
            const blob = await getCharacterToken(characterUuid);
            const url = URL.createObjectURL(blob);
            return url;
        } catch {
            console.error("Token download error")
            return null;
        };
    };

    const uploadImage = async (characterUuid: string, file: File) => {
        if (characterUuid === "__NULL__") return;
        try {
            const formData = new FormData();
            formData.append("file", file);

            await toast.promise(
                uploadCharacterImage(characterUuid, formData),
                {
                    loading: t("page.character-sheet.toast.upload.loading"), 
                    success: t("page.character-sheet.toast.upload.success"),
                    error: (err) => axios.isAxiosError(err) ? err.response?.data?.detail || t("page.character-sheet.toast.upload.error") : t("page.character-sheet.toast.upload.error"),
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
                loading: t("page.character-sheet.toast.create.loading"), 
                success: t("page.character-sheet.toast.create.success"),
                error: (err) => axios.isAxiosError(err) ? err.response?.data?.detail || t("page.character-sheet.toast.create.error") : t("page.character-sheet.toast.create.error"),
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
                loading: t("page.character-sheet.toast.update.loading"), 
                success: t("page.character-sheet.toast.update.success"),
                error: (err) => axios.isAxiosError(err) ? err.response?.data?.detail || t("page.character-sheet.toast.update.error") : t("page.character-sheet.toast.update.error"),
            }
        );
        if (!file) return;
        if (character.uuid === "__NULL__") return;
        uploadImage(character.uuid, file)
    }

    const joinCampaignWithToken = async (
        characterUuid: string, 
        characterName: string,
        characterPortrait: boolean, 
        campaignUuid: string
    ) => {
        try {
            addTokenToCampaign(campaignUuid, characterUuid, characterName, characterPortrait)
        } catch (err) {
            console.log(err);
        }
    }

    return {
        availCharacters,
        loadCharacterPortrait, 
        loadCharacterToken,
        loadCharacters,
        createCharacter,
        updateCharacter, 
        joinCampaignWithToken
    }
};