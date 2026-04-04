import { useEffect, useRef, useState } from "react";
import avatar from "../assets/avatar.webp";
import type { Player } from "../types/character";
import { getCharacterDetails, getCharacterPortrait } from "../api/services/characterServices";
import { useTranslation } from "react-i18next";

interface CharacterDetails {
  name: string;
  class: string;
  appearance: string;
  personality: string;
  bio: string;
}

interface Props {
  player: Player;
}

const DetailedCharacterCard = ({ player }: Props) => {
  const { t } = useTranslation();
  const [details, setDetails] = useState<CharacterDetails | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const getTextColor = (hex: string) => {
    const red = parseInt(hex.substring(1, 2), 16);
    const green = parseInt(hex.substring(2, 4), 16);
    const blue = parseInt(hex.substring(4, 6), 16);
    const brightness = (red * 2126 + green * 7152 + blue * 722) / 10000
    return brightness > 128 ? "black" : "white"
  };
  const textColor = getTextColor(player.color)


  useEffect(() => {
    let objectUrl: string | null = null;

    const fetch = async () => {
      if (player.characterUuid === "__NULL__") return;

      const d = await getCharacterDetails(player.characterUuid);
      setDetails(d);

      if (player.characterPortrait) {
        const blob = await getCharacterPortrait(player.characterUuid);
        objectUrl = URL.createObjectURL(blob);
        setImage(objectUrl);
      }
    };

    fetch();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [player.characterUuid, player.characterPortrait]);

  // Effet 3D sur la carte
  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const midX = rect.width / 2;
    const midY = rect.height / 2;

    const rotateY = ((x - midX) / midX) * 10;
    const rotateX = -((y - midY) / midY) * 10;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  };

  if (!details) return <div className="text-white">Chargement...</div>;

  return (
    <a href="#" className="hover-3d mx-2 cursor-pointer">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="card w-110 aspect-8/5 bg-[radial-gradient(circle_at_bottom_left,#ffffff04_35%,transparent_36%),radial-gradient(circle_at_top_right,#ffffff04_35%,transparent_36%)] bg-size-[4.95em_4.95em]"
        style={{ backgroundColor: player.color, color: textColor }}
      >
        <div className="card-body">
          <div className="flex justify-between mb-10 gap-4">
            <div className="w-2/3">
              <div className="font-bold">{details.name.toUpperCase()}</div>
              <div className="font-bold opacity-30">{details.class.toUpperCase()}</div>
              <div className="font-bold opacity-30 text-xs mt-2">{t("component.character-card.bio")}</div>
              <div className="font-bold opacity-50 text-xs text-justify">{details.bio}</div>
            </div>
            <div className="w-1/3 bg-amber-50 aspect-square flex items-center">
                <img src={image ?? avatar} alt="Portrait" className="rounded-lg ring-primary ring-2 ring-offset-2" />
            </div>
          </div>

          <div className="flex flex-row justify-between gap-4">
            <div>
              <div className="font-bold opacity-30 text-xs mt-2">{t("component.character-card.appearance")}</div>
              <div className="font-bold opacity-50 text-xs text-justify">{details.appearance}</div>
            </div>
            <div>
              <div className="font-bold opacity-30 text-xs mt-2">{t("component.character-card.personality")}</div>
              <div className="font-bold opacity-50 text-xs text-justify">{details.personality}</div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default DetailedCharacterCard;