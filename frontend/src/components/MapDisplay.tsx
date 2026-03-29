import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { useEffect, useState, useRef } from "react";

type Props = {
  apiURL: string;
  campaignId: number;
  selectedMap: string | null;
};

const MapDisplay = ({ apiURL, campaignId, selectedMap }: Props) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);

  const pinchState = useRef<{ initialDistance: number; initialScale: number } | null>(null);

  // Load image
  useEffect(() => {
    if (!selectedMap) return;

    const img = new window.Image();
    img.src = `${apiURL}/maps/${campaignId}/${selectedMap}`;
    img.onload = () => setImage(img);
  }, [selectedMap, apiURL, campaignId]);

  // Detect container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize(); // initial
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Scale & center background image
  useEffect(() => {
    if (!image || !containerSize.width || !containerSize.height) return;

    const scaleX = containerSize.width / image.width;
    const scaleY = containerSize.height / image.height;
    const initialScale = Math.min(scaleX, scaleY);

    setScale(initialScale);

    const posX = (containerSize.width - image.width * initialScale) / 2;
    const posY = (containerSize.height - image.height * initialScale) / 2;
    setPosition({ x: posX, y: posY });
  }, [image, containerSize]);

  // Zoom desktop
  const handleWheel = (e: any) => {
    e.evt.preventDefault();

    const scaleBy = 1.05;
    const stage = stageRef.current;
    const oldScale = scale;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale,
    };

    let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    const MIN_SCALE = 0.5 * oldScale;
    const MAX_SCALE = 2.5 * oldScale;
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

    setScale(newScale);
    setPosition({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  };

  // Pinch tactile
  useEffect(() => {
    const stageEl = stageRef.current?.getStage()?.content;
    if (!stageEl) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (!stageRef.current) return;
      if (e.touches.length === 2) {
        e.preventDefault();

        const touch1 = e.touches[0];
        const touch2 = e.touches[1];

        const dx = touch2.clientX - touch1.clientX;
        const dy = touch2.clientY - touch1.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (!pinchState.current) {
          pinchState.current = { initialDistance: distance, initialScale: scale };
        } else {
          const scaleFactor = distance / pinchState.current.initialDistance;
          let newScale = pinchState.current.initialScale * scaleFactor;
          const MIN_SCALE = 0.5 * pinchState.current.initialScale;
          const MAX_SCALE = 2.5 * pinchState.current.initialScale;
          newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
          setScale(newScale);
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        pinchState.current = null;
      }
    };

    stageEl.addEventListener("touchmove", handleTouchMove, { passive: false });
    stageEl.addEventListener("touchend", handleTouchEnd);

    return () => {
      stageEl.removeEventListener("touchmove", handleTouchMove);
      stageEl.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scale]);

  const resetView = () => {
    if (!image || !containerSize.width || !containerSize.height) return;

    const scaleX = containerSize.width / image.width;
    const scaleY = containerSize.height / image.height;
    const initialScale = Math.min(scaleX, scaleY);

    const posX = (containerSize.width - image.width * initialScale) / 2;
    const posY = (containerSize.height - image.height * initialScale) / 2;

    setScale(initialScale);
    setPosition({ x: posX, y: posY });
  };


  return (
    <div
      ref={containerRef}
      className="relative h-[80vh] mx-auto my-8 bg-black border-2 rounded-xl overflow-hidden"
    >
      <button
        onClick={resetView}
        className="absolute btn btn-primary top-2 right-2 z-50 px-3 py-1 rounded-lg shadow-md"
      >
        Réinitialiser la vue
      </button>
      <Stage
        width={containerSize.width}
        height={containerSize.height}
        draggable
        x={position.x}
        y={position.y}
        scaleX={scale}
        scaleY={scale}
        onWheel={handleWheel}
        onDragEnd={(e) => setPosition({ x: e.target.x(), y: e.target.y() })}
        ref={stageRef}
      >
        <Layer>
          {image && <KonvaImage image={image} x={0} y={0} />}
        </Layer>
      </Stage>
    </div>
  );
};

export default MapDisplay;