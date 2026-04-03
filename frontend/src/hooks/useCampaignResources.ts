import toast from "react-hot-toast";
import { useCampaign } from "../context/CampaignContext"
import { getMaps, getIllustrations, getTokens } from "../api/services/mapServices";
import { useEffect, useState } from "react";
import { uploadFile, deleteFile, getQuota } from "../api/services/campaignResourcesServices";
import type { TokenAPI } from "../types/token";
import type { FileType, FileTypeAPI } from "../types/file";

interface Quota {
    currentSize: number,
    maxSize: number
}

export const useCampaignResources = () => {
    const { campaignId } = useCampaign()

    const [availMaps, setAvailMaps] = useState<FileType[]>([])
    const [availIllustrations, setAvailIllustrations] = useState<FileType[]>([])
    const [availTokens, setAvailTokens] = useState<FileType[]>([])
    const [campaignQuota, setCampaignQuota] = useState<Quota | null>(null)

    const getCampaignQuota = async () => {
        if (!campaignId) return;
        
        try {
            const res = await getQuota(campaignId);
            console.log(res)
            setCampaignQuota(res);
        } catch (err: any) {
            console.error(err)
        }
    }

    const mapApiToFile = ( {uuid, file_name }: FileTypeAPI): FileType => ({uuid: uuid, fileName: file_name})
    const mapTokenApiToFile = ( {uuid, file_name}: TokenAPI): FileType => ({uuid: uuid, fileName: file_name})

    const loadMaps = async () => {
        if (!campaignId || campaignId === "__NULL__") return;
        await toast.promise(
            getMaps(campaignId)
                .then((res) => {
                    const maps: FileType[] = res.map(mapApiToFile);
                    setAvailMaps(maps);
                })
                .catch((err) => {console.log(err); throw err}),
            {
                loading: "Récupération des cartes et arrière-plans...",
                success: "Liste des cartes et arrière-plans mise à jour",
                error: "Echec de la mise à jour des cartes et arrière-plans"
            }
        )
    };

    const loadIllustrations = async () => {
        if (!campaignId || campaignId === "__NULL__") return;
        await toast.promise(
            getIllustrations(campaignId)
                .then((res) => {
                    const illus: FileType[] = res.map(mapApiToFile)
                    setAvailIllustrations(illus);
                })
                .catch((err) => {console.log(err); throw err}),
            {
                loading: "Récupération des illustrations...",
                success: "Liste des illustrations disponibles mise à jour",
                error: "Echec de la récupération des illustrations"
            }
        )
    };

    const loadTokens = async () => {
        if (!campaignId || campaignId === "__NULL__") return;
        await toast.promise(
            getTokens(campaignId)
                .then((res) => {
                    console.log(res)
                    const tokens: FileType[] = res.map(mapTokenApiToFile)
                    setAvailTokens(tokens);
                })
                .catch((err) => {console.log(err); throw err}),
            {
                loading: "Récupération des illustrations...",
                success: "Liste des illustrations disponibles mise à jour",
                error: "Echec de la récupération des illustrations"
            }
        )
    };

    const handleUpload = async (file: File | null, category: "maps" | "illustrations" | "tokens", tokenSize?: "small" | "medium" | "giant") => {
        if (!campaignId) return;
        if (!file) {
            toast.error("Aucun fichier sélectionné");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Fichier trop volumineux");
            return;
        }
        if (!file.type.startsWith("image/")) {
            toast.error("Seules les images sont autorisées");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);

            await toast.promise(
                uploadFile(campaignId, formData, category, tokenSize),
                {
                    loading: "Upload en cours...",
                    success: "Fichier uploadé avec succès",
                    error: "Erreur lors de l'upload"
                }
            );

            if (category === "maps") loadMaps();
            if (category === "illustrations") loadIllustrations();
            if (category === "tokens") loadTokens();

        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.detail || "Erreur upload");
        }   
    };

    const handleTrash = async (filename: string, category: "maps" | "illustrations" | "tokens") => {
        if (!campaignId) return;
        if (!confirm(`Supprimer ${filename} ?`)) return;

        try {
            await toast.promise(
                deleteFile(campaignId, filename, category),
                {
                    loading: `Suppression de ${filename}...`,
                    success: `${filename} supprimé`,
                    error: `Erreur lors de la suppression de ${filename}`
                }
            );

            if (category === "maps") loadMaps();
            if (category === "illustrations") loadIllustrations();
            if (category === "tokens") loadTokens();

        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.detail || "Erreur lors de la suppression");
        }
    };

    useEffect(() => {
        getCampaignQuota();
    }, [availMaps, availIllustrations, availTokens])

    return {
        availMaps,
        availIllustrations,
        availTokens,
        loadMaps,
        loadIllustrations,
        loadTokens,
        handleUpload,
        handleTrash,
        campaignQuota
    }
}