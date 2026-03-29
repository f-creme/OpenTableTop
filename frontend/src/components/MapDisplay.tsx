// components/MapDisplay.tsx

interface MapDisplayProps {
  apiURL: string;
  campaignId: number;
  selectedMap: string | null;
}

const MapDisplay = ({ apiURL, campaignId, selectedMap }: MapDisplayProps) => {
  if (!selectedMap) return <p>No map selected</p>;

  return (
    <div className="relative p-6 rounded-2xl shadow-2xl bg-base-200 overflow-hidden max-w-full">
      <div className="bg-[#f5e6c8] p-6 rounded-lg shadow-inner border border-[#d6c2a1]
                      before:absolute before:inset-0 before:rounded-lg
                      before:bg-[radial-gradient(circle,transparent_60%,rgba(0,0,0,0.15))]
                      before:pointer-events-none">
        <img
          src={`${apiURL}/maps/${campaignId}/${selectedMap}`}
          alt={selectedMap}
          className="max-w-[70vw] max-h-[70vh] object-contain rounded"
        />
      </div>
    </div>
  );
};

export default MapDisplay;