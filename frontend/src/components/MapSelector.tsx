// components/MapSelector.tsx

import { Map } from "lucide-react";
import type { FileType } from "../types/file";
import { useTranslation } from "react-i18next";

type Role = "mj" | "player" | null

interface MapSelectorProps {
  role: Role;
  maps: FileType[];
  selectedMap: string | null;
  changeMap: (map: string) => void;
}

const MapSelector = ({ role, maps, selectedMap, changeMap }: MapSelectorProps) => {
  const { t } = useTranslation();
  if (role !== "mj") return null;

  return (
    <div className="dropdown dropdown-center">
      <div tabIndex={0} role="button" className="btn btn-ghost">
        <Map className="h-7 w-7"/>
      </div>

      {maps.length > 0 ? (
        <ul tabIndex={-1} className="dropdown-content z-30 menu bg-base-100 rounded-box w-60 shadow shadow-info gap-1">
          <li className="menu-title">{t("component.map-selector.caption")}</li>
          {maps.map((gameMap, index) => {
            const dotIndex = gameMap.fileName.lastIndexOf(".")
            const displayName = dotIndex !== -1 ? gameMap.fileName.slice(0, dotIndex): gameMap.fileName;

            return (
              <li key={index}>
                <button
                  className={`btn btn-info w-full justify-start ${selectedMap === gameMap.uuid ? "" : "btn-soft"}`}
                  onClick={() => changeMap(gameMap.uuid)}
                >
                  {displayName}
                </button>
              </li>
            )
          })}
        </ul>
      ) : (
        <ul tabIndex={-1} className="dropdown-content z-1 bg-base-200 rounded-box w-60 menu shadow shadow-info">
          <li className="menu-title">{t("component.map-selector.caption")}</li>
          <li>{t("component.map-selector.warning")}</li>
        </ul>
      )}
    </div>
  );
};

export default MapSelector;