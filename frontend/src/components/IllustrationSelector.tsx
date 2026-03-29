// components/IllustrationSelector.tsx
import { ImagePlus } from "lucide-react";

type Role = "mj" | "player" | null

interface IllusSelectorProps {
    role: Role;
    illustrations: string[];
    selectedIllustration: string | null;
    changeIllustration: (image: string | null) => void;
}

const IllustrationSelector = ({
    role,
    illustrations,
    selectedIllustration,
    changeIllustration
}: IllusSelectorProps) => {
    if (role !== "mj") return;

    return (
        <div className="dropdown dropdown-center">
        <div tabIndex={0} role="button" className="btn btn-ghost">
            <ImagePlus className="h-7 w-7"/>
        </div>

        {illustrations.length > 0 ? (
            <ul tabIndex={-1} className="dropdown-content z-1 menu bg-base-100 rounded-box w-60 shadow shadow-info gap-1">
            <li className="menu-title">Select an illustration to display</li>
            <li key={0}>
                <button 
                    className={`btn btn-info w-full justify-start ${selectedIllustration === null || selectedIllustration === "__NULL__" ? "" : "btn-soft"}`}
                    onClick={() => changeIllustration("__NULL__")}
                >
                    Aucune
                </button>
            </li>
            {illustrations.map((ill) => (
                <li key={ill}>
                <button
                    className={`btn btn-info w-full justify-start ${selectedIllustration === ill ? "" : "btn-soft"}`}
                    onClick={() => changeIllustration(ill)}
                >
                    {ill}
                </button>
                </li>
            ))}
            </ul>
        ) : (
            <ul tabIndex={-1} className="dropdown-content z-1 bg-base-200 rounded-box w-60 menu shadow shadow-info">
            <li className="menu-title">Select an illustration to display</li>
            <li>No illustration available for the current campaign</li>
            </ul>
        )}
        </div> 
    );
};

export default IllustrationSelector;