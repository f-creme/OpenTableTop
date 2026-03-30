import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { useEffect, useState, useRef } from "react";
import type { Token } from "../types/token";
import type Konva from "konva";

interface TokenDisplay {
  image: HTMLImageElement,
  x_coord: number,
  y_coord: number,
  scale: number
}

type Props = {
  apiURL: string;
  campaignId: number;
  selectedMap: string | null;
  selectedIllustration: string | null;
  activeTokens: Token[];
};

const MapDisplay = ({ apiURL, campaignId, selectedMap, selectedIllustration, activeTokens }: Props) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [illustration, setIllustration] = useState<HTMLImageElement | null>(null);
  const [tokens, setTokens] = useState<TokenDisplay[]>([]);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const pinchState = useRef<{ initialDistance: number; initialScale: number } | null>(null);

  // --- Load map ---
  useEffect(() => {
    if (!selectedMap) return;
    const img = new window.Image();
    img.src = `${apiURL}/maps/${campaignId}/${selectedMap}`;
    img.onload = () => setImage(img);
  }, [selectedMap, apiURL, campaignId]);

  // --- Load illustration ---
  useEffect(() => {
    if (!selectedIllustration || selectedIllustration === "__NULL__") {
      setIllustration(null);
      return;
    }
    const img = new window.Image();
    img.src = `${apiURL}/illus/${campaignId}/${selectedIllustration}`;
    img.onload = () => setIllustration(img);
  }, [selectedIllustration, apiURL, campaignId]);

  // --- Load tokens ---
  useEffect(() => {
    if (!activeTokens || activeTokens.length < 1) {
      setTokens([]);
      return;
    }

    let isMounted = true;
    const loadImages = async () => {
      const loadedImages: TokenDisplay[] = [];
      await Promise.all(
        activeTokens.map((t, index) => {
          return new Promise<void>((resolve) => {
            const img = new window.Image();
            img.src = `${apiURL}/tokens/${campaignId}/${encodeURIComponent(t.id)}`;
            img.onload = () => {
              const transformedY = (y: number, countTokens: number) => (y === 0 ? y + 150 * countTokens : y);
              loadedImages.push({
                image: img,
                x_coord: t.x,
                y_coord: transformedY(t.x, index),
                scale: t.scale
              });
              resolve();
            };
            img.onerror = () => resolve();
          });
        })
      );
      if (isMounted) setTokens(loadedImages);
    };
    loadImages();
    return () => { isMounted = false; };
  }, [activeTokens, apiURL, campaignId]);

  // --- Container size ---
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // --- Initial map scaling ---
  useEffect(() => {
    if (!image || !containerSize.width || !containerSize.height) return;
    const scaleX = containerSize.width / image.width;
    const scaleY = containerSize.height / image.height;
    const initialScale = Math.min(scaleX, scaleY);
    setScale(initialScale);
    setPosition({
      x: (containerSize.width - image.width * initialScale) / 2,
      y: (containerSize.height - image.height * initialScale) / 2
    });
  }, [image, containerSize]);

  // --- Zoom wheel ---
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = { x: (pointer.x - position.x) / oldScale, y: (pointer.y - position.y) / oldScale };
    const scaleBy = 1.05;
    let newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    const MIN_SCALE = 0.5 * oldScale;
    const MAX_SCALE = 2.5 * oldScale;
    newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

    setScale(newScale);
    setPosition({ x: pointer.x - mousePointTo.x * newScale, y: pointer.y - mousePointTo.y * newScale });
  };

  // --- Pinch-to-zoom ---
  useEffect(() => {
    const stageEl = stageRef.current?.getStage()?.content;
    if (!stageEl) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dx = t2.clientX - t1.clientX;
        const dy = t2.clientY - t1.clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (!pinchState.current) pinchState.current = { initialDistance: distance, initialScale: scale };
        else {
          const scaleFactor = distance / pinchState.current.initialDistance;
          let newScale = pinchState.current.initialScale * scaleFactor;
          const MIN_SCALE = 0.5 * pinchState.current.initialScale;
          const MAX_SCALE = 2.5 * pinchState.current.initialScale;
          newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
          setScale(newScale);
        }
      }
    };

    const handleTouchEnd = () => { pinchState.current = null; };

    stageEl.addEventListener("touchmove", handleTouchMove, { passive: false });
    stageEl.addEventListener("touchend", handleTouchEnd);

    return () => {
      stageEl.removeEventListener("touchmove", handleTouchMove);
      stageEl.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scale]);

  // --- Reset view ---
  const resetView = () => {
    if (!image || !containerSize.width || !containerSize.height || !stageRef.current) return;

    const scaleX = containerSize.width / image.width;
    const scaleY = containerSize.height / image.height;
    const initialScale = Math.min(scaleX, scaleY);

    const posX = (containerSize.width - image.width * initialScale) / 2;
    const posY = (containerSize.height - image.height * initialScale) / 2;

    setScale(initialScale);
    setPosition({ x: posX, y: posY });

    const stage = stageRef.current.getStage();
    if (stage) {
      stage.scale({ x: initialScale, y: initialScale });
      stage.position({ x: posX, y: posY });
      stage.batchDraw(); // force la réactualisation
      stage.draggable(true);
    }
  };
  useEffect(() => resetView(), [selectedIllustration]);

  // --- Illustration scaling ---
  const illustrationScale = image && illustration
    ? Math.min(5, (0.7 * Math.min(image.width, image.height)) / Math.min(illustration.width, illustration.height))
    : 1;
  const illustrationX = image && illustration ? (image.width - illustration.width * illustrationScale) / 2 : 0;
  const illustrationY = image && illustration ? (image.height - illustration.height * illustrationScale) / 2 : 0;

  // --- Drag tokens ---
  const onTokenDrag = (index: number, newX: number, newY: number) => {
    setTokens((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], x_coord: newX, y_coord: newY };
      return updated;
    });
  };

  return (
    <div ref={containerRef} className="relative h-[80vh] mx-auto my-8 bg-black border-2 rounded-xl overflow-hidden">
      <button
        onClick={resetView}
        className="absolute btn btn-primary top-2 right-2 z-10 px-3 py-1 rounded-lg shadow-md"
      >
        Réinitialiser la vue
      </button>

      <Stage
        width={containerSize.width}
        height={containerSize.height}
        x={position.x}
        y={position.y}
        scaleX={scale}
        scaleY={scale}
        onWheel={handleWheel}
        draggable
        dragBoundFunc={(pos) => pos} // Map draggable anywhere
        ref={stageRef}
        onDragStart={(e) => {
          if (e.target.getClassName() === "Image") {
            const imageNode = e.target as Konva.Image;
            if (tokens.find(t => t.image === imageNode.image())) {
              const stage = e.target.getStage();
              if (stage) stage.draggable(false);
            }
          }
        }}
        onDragEnd={(e) => {
          const stage = e.target.getStage();
          if (stage) stage.draggable(true);
        }}
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

        <Layer>
          {tokens.map((t, index) => (
            <KonvaImage
              key={index}
              image={t.image}
              x={t.x_coord}
              y={t.y_coord}
              scaleX={t.scale}
              scaleY={t.scale}
              draggable
              onDragMove={(e) => onTokenDrag(index, e.target.x(), e.target.y())}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default MapDisplay;