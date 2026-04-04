// components/IllustrationSelector.tsx
import { ImagePlus } from "lucide-react";
import type { FileType } from "../types/file";
import { useTranslation } from "react-i18next";

type Role = "mj" | "player" | null

interface IllusSelectorProps {
    role: Role;
    illustrations: FileType[];
    selectedIllustration: string | null;
    changeIllustration: (image: string | null) => void;
}

const IllustrationSelector = ({
    role,
    illustrations,
    selectedIllustration,
    changeIllustration
}: IllusSelectorProps) => {
    const { t } = useTranslation();
    if (role !== "mj") return;

    return (
        <div className="dropdown dropdown-center">
        <div tabIndex={0} role="button" className="btn btn-ghost">
            <ImagePlus className="h-7 w-7"/>
        </div>

        {illustrations.length > 0 ? (
            <ul tabIndex={-1} className="dropdown-content z-30 menu bg-base-100 rounded-box w-60 shadow shadow-info gap-1">
            <li className="menu-title">{t("component.illustration-selector.caption")}</li>
            <li key={0}>
                <button 
                    className={`btn btn-info w-full justify-start ${selectedIllustration === null || selectedIllustration === "__NULL__" ? "" : "btn-soft"}`}
                    onClick={() => changeIllustration("__NULL__")}
                >
                    {t("component.illustration-selector.option-none")}
                </button>
            </li>
            {illustrations.map((ill, index) => {
                const dotIndex = ill.fileName.lastIndexOf(".")
                const displayName = dotIndex !== -1 ? ill.fileName.slice(0, dotIndex): ill.fileName;
                return (
                    <li key={index}>
                    <button
                        className={`btn btn-info w-full justify-start ${selectedIllustration === ill.uuid ? "" : "btn-soft"}`}
                        onClick={() => changeIllustration(ill.uuid)}
                    >
                        {displayName}
                    </button>
                    </li>
            )})}
            </ul>
        ) : (
            <ul tabIndex={-1} className="dropdown-content z-1 bg-base-200 rounded-box w-60 menu shadow shadow-info">
            <li className="menu-title">{t("component.illustration-selector.caption")}</li>
            <li>{t("component.illustration-selector.warning")}</li>
            </ul>
        )}
        </div> 
    );
};

export default IllustrationSelector;