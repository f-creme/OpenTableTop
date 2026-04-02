// components/MapSelector.tsx

import { Map } from "lucide-react";

type Role = "mj" | "player" | null

interface MapSelectorProps {
  role: Role;
  maps: string[];
  selectedMap: string | null;
  changeMap: (map: string) => void;
}

const MapSelector = ({ role, maps, selectedMap, changeMap }: MapSelectorProps) => {
  if (role !== "mj") return null;

  return (
    <div className="dropdown dropdown-center">
      <div tabIndex={0} role="button" className="btn btn-ghost">
        <Map className="h-7 w-7"/>
      </div>

      {maps.length > 0 ? (
        <ul tabIndex={-1} className="dropdown-content z-30 menu bg-base-100 rounded-box w-60 shadow shadow-info gap-1">
          <li className="menu-title">Select a map to display</li>
          {maps.map((gameMap) => (
            <li key={gameMap}>
              <button
                className={`btn btn-info w-full justify-start ${selectedMap === gameMap ? "" : "btn-soft"}`}
                onClick={() => changeMap(gameMap)}
              >
                {gameMap}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul tabIndex={-1} className="dropdown-content z-1 bg-base-200 rounded-box w-60 menu shadow shadow-info">
          <li className="menu-title">Select a map to display</li>
          <li>No maps available for the current campaign</li>
        </ul>
      )}
    </div>
  );
};

export default MapSelector;