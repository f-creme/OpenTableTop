import type { Player } from "../types/character";
import  avatar  from "../assets/avatar.webp"
import { getCharacterPortrait } from "../api/services/characterServices";
import { useEffect, useState } from "react";

interface CharacterCardProps {
    player: Player
}

const CharacterCard = ({ player }: CharacterCardProps) => {
    const getTextColor = (hex: string) => {
        const red = parseInt(hex.substring(1, 2), 16);
        const green = parseInt(hex.substring(2, 4), 16);
        const blue = parseInt(hex.substring(4, 6), 16);
        const brightness = (red * 2126 + green * 7152 + blue * 722) / 10000
        return brightness > 128 ? "black" : "white"
    };
    const textColor = getTextColor(player.color)

    const [image, setImage] = useState<string | undefined>(undefined);

    useEffect(() => {
    const fetchImage = async () => {
        if (!player.characterPortrait) return;

        const data = await getCharacterPortrait(player.characterUuid);
        const objectUrl = URL.createObjectURL(data);

        setImage(objectUrl);
    };

    fetchImage();

    return () => {
        if (image) URL.revokeObjectURL(image);
    };
    }, [player.characterRole, player.characterPortrait]);

    return (
        <div 
            className="relative flex z-50 items-center justify-between rounded-2xl shadow-md p-4 m-5 opacity-90 hover:scale-110 transition"
            style={{ backgroundColor: player.color, color: textColor }}
        >
            <div className="flex-3 flex flex-col space-y-1 text-left">
                <h2 className="text-sm font-semibold opacity-100">{player.characterName.toUpperCase()}</h2>
                <p className="text-xs font-semibold opacity-70">{player.characterRole.toUpperCase()}</p>
                <p className="text-xs font-semibold opacity-50"><i>{player.userPublicName}</i></p>
            </div>
            <div className="flex-2 ml-4 avatar avatar-online">
                <div className="ring-primary ring-offset-base-100 rounded-full ring-2 ring-offset-2">
                    <div className="rounded-full"><img src={(player.characterPortrait === true) ? image : avatar}/></div>
                </div>
            </div>
        </div>
    );
};

export default CharacterCard;