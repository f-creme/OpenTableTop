import { useState, type FC } from "react"; 
import { Map, Trash } from "lucide-react";

interface Quota {
    currentSize: number,
    maxSize: number
}

type Props = {
    campaignId: number;
    availMaps: string[];
    loadMaps: () => void;
    uploadFile: (file: File, category: "maps" | "illustrations" | "tokens") => Promise<void>;
    deleteFile: (filename: string, category: "maps" | "illustrations" | "tokens") => Promise<void>;
    campaignQuota: Quota
};

const CampaignResourcesForm: FC<Props> = ({
    availMaps,
    loadMaps,
    uploadFile,
    deleteFile,
    campaignQuota
}) => {
    const [selectedMapFile, setSelectedMapFile] = useState<File | null>(null);
    return (
        <div className="flex flex-col">
            <p className="text-2xl md:text-4xl text-center font-semibold p-4 md:p-5 mb-3 md:mb-5">
                Ressources
            </p>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-5 p-4">
                <progress 
                    className={`progress w-full ${
                        campaignQuota.currentSize / campaignQuota.maxSize < 0.5 
                        ? "progress-info"
                        : campaignQuota.currentSize / campaignQuota.maxSize < 0.75 
                            ? "progress-warning" 
                            : campaignQuota.currentSize / campaignQuota.maxSize < 1 
                                ? "progress-error"
                                : "progress-neutral" 
                    }`} 
                    value={campaignQuota.currentSize} max={campaignQuota.maxSize}
                ></progress>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-5 p-4">
                <div className="text-lg flex gap-4 md:text-xl font-medium">
                    <Map/> 
                    <div>Cartes et arrière-plans</div>
                </div>
                <button className="btn btn-primary w-full md:w-auto" onClick={loadMaps}>
                    Actualiser la liste
                </button>
            </div>

            <div className="hidden md:block bg-base-200 rounded-2xl px-4 divide-y divide-primary/30 w-full">
                <div className="flex p-3 gap-4 justify-between items-center font-semibold text-sm border-b">
                    <div className="flex gap-2">
                        <span>Nom de la ressource</span>
                    </div>
                    <div className="w-10 mr-2">Retirer</div>
                </div>
                {availMaps.map((map, index) => (
                    <div
                        className="flex p-3 gap-4 justify-between items-center"
                        key={index}
                    >
                        <div className="flex gap-2">
                            <span>{map}</span>
                        </div>
                        <button
                            className="btn btn-primary btn-ghost"
                            onClick={() => deleteFile(map, "maps")}
                        >
                            <Trash className="h-4 w-4" />                            
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex flex-col justify-between items-center mt-5 px-4 gap-4">
                <fieldset className="flex-1 fieldset w-full">
                    <legend className="fieldset-legend">Choisir un fichier</legend>
                    <input type="file" className="file-input w-full" onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            setSelectedMapFile(e.target.files[0])
                        }
                    }}/>
                    <label className="label">Taille maximale: 2MB</label>
                </fieldset>
                <button
                    className="btn btn-primary w-full"
                    disabled={!selectedMapFile}
                    onClick={() => {
                        if (!selectedMapFile) return;
                        uploadFile(selectedMapFile, "maps")
                    }}
                >
                    Uploader
                </button>
            </div>
        </div>
    );
};

export default CampaignResourcesForm;