import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { useEffect, useState, useRef } from "react";

type Props = {
  apiURL: string;
  campaignId: number;
  selectedMap: string | null;
  selectedIllustration: string | null;
};

const MapDisplay = ({ apiURL, campaignId, selectedMap, selectedIllustration }: Props) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [illustration, setIllustration] = useState<HTMLImageElement | null>(null);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);

  const pinchState = useRef<{ initialDistance: number; initialScale: number } | null>(null);

  // Load map: layer 1
  useEffect(() => {
    if (!selectedMap) return;

    const img = new window.Image();
    img.src = `${apiURL}/maps/${campaignId}/${selectedMap}`;
    img.onload = () => setImage(img);
  }, [selectedMap, apiURL, campaignId]);

  // Load illustration: layer 2
  useEffect(() => {
    if (!selectedIllustration || selectedIllustration === "__NULL__") {
      setIllustration(null);
      return;
    }

    const img = new window.Image();
    img.src = `${apiURL}/illus/${campaignId}/${selectedIllustration}`;
    img.onload = () => setIllustration(img);
  }, [selectedIllustration, apiURL, campaignId]);

  // Container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Initial map scaling
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

  // Zoom
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

  // Pinch-to-zoom
  useEffect(() => {
    const stageEl = stageRef.current?.getStage()?.content;
    if (!stageEl) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (!stageRef.current) return;
      if (e.touches.length === 2) {
        e.preventDefault();

        const t1 = e.touches[0];
        const t2 = e.touches[1];

        const dx = t2.clientX - t1.clientX;
        const dy = t2.clientY - t1.clientY;
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

    const handleTouchEnd = () => {
      pinchState.current = null;
    };

    stageEl.addEventListener("touchmove", handleTouchMove, { passive: false });
    stageEl.addEventListener("touchend", handleTouchEnd);

    return () => {
      stageEl.removeEventListener("touchmove", handleTouchMove);
      stageEl.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scale]);

  // Reset view and reset on selectedIllustration change
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

  useEffect(() => resetView(), [selectedIllustration])

  // Scale illustration
  const illustrationScale = image && illustration 
    ? Math.min(
      5, 
      (0.7 * Math.min(image.width, image.height)) /
      Math.min(illustration.width, illustration.height)
    )
    : 1;

  // Center illustration
  const illustrationX = image && illustration
    ? (image.width - illustration.width * illustrationScale) / 2
    : 0;

  const illustrationY = image && illustration
    ? (image.height - illustration.height * illustrationScale) / 2
    : 0;


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

        <Layer>
          {illustration && (
            <KonvaImage
              image={illustration}
              x={illustrationX}
              y={illustrationY}
              scaleX={illustrationScale}
              scaleY={illustrationScale}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default MapDisplay;