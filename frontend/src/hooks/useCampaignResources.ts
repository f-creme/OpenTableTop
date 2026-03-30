import toast from "react-hot-toast";
import { useCampaign } from "../context/CampaignContext"
import { getMaps } from "../api/services/mapServices";
import { useState } from "react";
import { uploadFile, deleteFile } from "../api/services/campaignResourcesServices";

export const useCampaignResources = () => {
    const { campaignId } = useCampaign()

    const [availMaps, setAvailMaps] = useState<string[]>([])

    const loadMaps = async () => {
        if (!campaignId || campaignId < 0) return;
        await toast.promise(
            getMaps(campaignId)
                .then((res) => {setAvailMaps(res); console.log(res)})
                .catch((err) => {console.log(err); throw err}),
            {
                loading: "Récupération des cartes et arrière-plans...",
                success: "Liste des cartes et arrière-plans mise à jour",
                error: "Echec de la mise à jour des cartes et arrière-plans"
            }
        )
    };

    const handleUpload = async (file: File | null, category: "maps" | "illustrations" | "tokens") => {
        if (!campaignId) return;
        if (!file) {
            alert("Aucun fichier sélectionné");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert("Fichier top volumineux");
            return;
        }
        if (!file.type.startsWith("image/")) {
            alert("Seules les images sont autorisées");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);
            
            await uploadFile(campaignId, formData, category)
            
            if (category === "maps") loadMaps();

        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.detail || "Erreur upload");
        }   
    };

    const handleTrash = async (filename: string, category: "maps" | "illustrations" | "tokens") => {
        if (!campaignId) return;
        if (!confirm(`Supprimer ${filename} ?`)) return;

        try {
            await deleteFile(campaignId, filename, category);
            alert(`${filename} supprimé`);

            if (category === "maps") loadMaps;
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.detail || "Erreur lors de la suppression");
        }
    };

    return {
        availMaps,
        loadMaps,
        handleUpload,
        handleTrash
    }
}