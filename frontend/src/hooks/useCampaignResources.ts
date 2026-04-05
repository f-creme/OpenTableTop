import toast from "react-hot-toast";
import { useCampaign } from "../context/CampaignContext"
import { getMaps, getIllustrations, getTokens } from "../api/services/mapServices";
import { useEffect, useState } from "react";
import { uploadFile, deleteFile, getQuota } from "../api/services/campaignResourcesServices";
import type { TokenAPI } from "../types/token";
import type { FileType, FileTypeAPI } from "../types/file";
import { useTranslation } from "react-i18next";

interface Quota {
    currentSize: number,
    maxSize: number
}

export const useCampaignResources = () => {
    const { t } = useTranslation();
    const { campaignId } = useCampaign();

    const [availMaps, setAvailMaps] = useState<FileType[]>([])
    const [availIllustrations, setAvailIllustrations] = useState<FileType[]>([])
    const [availTokens, setAvailTokens] = useState<FileType[]>([])
    const [campaignQuota, setCampaignQuota] = useState<Quota | null>(null)

    const getCampaignQuota = async () => {
        if (!campaignId) return;
        
        try {
            const res = await getQuota(campaignId);
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
                .catch((err) => {throw err}),
            {
                loading: t("component.campaign-resources-form.toast.load.loading"),
                success: t("component.campaign-resources-form.toast.load.success"),
                error: t("component.campaign-resources-form.toast.load.error")
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
                .catch((err) => {throw err}),
            {
                loading: t("component.campaign-resources-form.toast.load.loading"),
                success: t("component.campaign-resources-form.toast.load.success"),
                error: t("component.campaign-resources-form.toast.load.error")
            }
        )
    };

    const loadTokens = async () => {
        if (!campaignId || campaignId === "__NULL__") return;
        await toast.promise(
            getTokens(campaignId)
                .then((res) => {
                    const tokens: FileType[] = res.map(mapTokenApiToFile)
                    setAvailTokens(tokens);
                })
                .catch((err) => {throw err}),
            {
                loading: t("component.campaign-resources-form.toast.load.loading"),
                success: t("component.campaign-resources-form.toast.load.success"),
                error: t("component.campaign-resources-form.toast.load.error")
            }
        )
    };

    const handleUpload = async (file: File | null, category: "maps" | "illustrations" | "tokens", tokenSize?: "small" | "medium" | "big" | "giant") => {
        if (!campaignId) return;
        if (!file) {
            toast.error(t("component.campaign-resources-form.toast.upload.no-file"));
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error(t("component.campaign-resources-form.toast.upload.too-large"));
            return;
        }
        if (!file.type.startsWith("image/")) {
            toast.error(t("component.campaign-resources-form.toast.upload.not-image"));
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);

            await toast.promise(
                uploadFile(campaignId, formData, category, tokenSize),
                {
                    loading: t("component.campaign-resources-form.toast.upload.loading"),
                    success: t("component.campaign-resources-form.toast.upload.success"),
                    error: t("component.campaign-resources-form.toast.upload.error")
                }
            );

            if (category === "maps") loadMaps();
            if (category === "illustrations") loadIllustrations();
            if (category === "tokens") loadTokens();

        } catch (err: any) {
            toast.error(err.response?.data?.detail || t("component.campaign-resources-form.toast.upload.error"));
        }   
    };

    const handleTrash = async (filename: string, category: "maps" | "illustrations" | "tokens") => {
        if (!campaignId) return;
        if (!confirm(`${t("component.campaign-resources-form.confirm.delete")} ${filename} ?`)) return;

        try {
            await toast.promise(
                deleteFile(campaignId, filename, category),
                {
                    loading: t("component.campaign-resources-form.toast.delete.loading"),
                    success: t("component.campaign-resources-form.toast.delete.success"),
                    error: t("component.campaign-resources-form.toast.delete.error")
                }
            );

            if (category === "maps") loadMaps();
            if (category === "illustrations") loadIllustrations();
            if (category === "tokens") loadTokens();

        } catch (err: any) {
            toast.error(err.response?.data?.detail || t("component.campaign-resources-form.toast.delete.error"));
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