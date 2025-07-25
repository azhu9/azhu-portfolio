import type React from "react";
import { useState, useRef, useEffect } from "react";

interface ColorSliderProps {
  hue: number;
  onHueChange: (hue: number) => void;
}

export default function ColorSlider({ hue, onHueChange }: ColorSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const currentColor = `hsl(${hue}, 100%, 50%)`;

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateHue(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateHue(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateHue = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newHue = percentage * 360;
    onHueChange(newHue);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Calculate handle position
  const handlePosition = (hue / 360) * 100;

  return (
    <div className="background p-8 shadow-2xl w-full">
      <div className="space-y-6">
        {/* Color Slider */}
        <div className="relative">
          <div
            ref={sliderRef}
            className="relative h-2 rounded-full cursor-pointer shadow-inner"
            style={{
              background:
                "linear-gradient(to right, #ff0000 0%, #ffff00 16.66%, #00ff00 33.33%, #00ffff 50%, #0000ff 66.66%, #ff00ff 83.33%, #ff0000 100%)",
            }}
            onMouseDown={handleMouseDown}
          >
            {/* Slider Handle */}
            <div
              className={`absolute top-1/2 w-6 h-6 rounded-full border-3 border-white shadow-lg transform -translate-y-1/2 -translate-x-1/2 transition-transform ${
                isDragging ? "scale-110" : "scale-100"
              } cursor-grab active:cursor-grabbing`}
              style={{
                left: `${handlePosition}%`,
                backgroundColor: currentColor,
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            />
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">
              Hue: {Math.round(hue)}°
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
