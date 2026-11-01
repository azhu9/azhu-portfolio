interface ColorSliderProps {
  hue: number;
  onHueChange: (hue: number) => void;
}

export default function ColorSlider({ hue, onHueChange }: ColorSliderProps) {
  return (
    <div className="tile flex flex-col justify-center gap-2 px-6">
      <input
        type="range"
        min={0}
        max={359}
        value={Math.round(hue)}
        onChange={(e) => onHueChange(Number(e.target.value))}
        aria-label="Accent color hue"
        className="hue-range"
      />
      <p className="text-center text-xs text-muted">Accent hue: {Math.round(hue)}°</p>
    </div>
  );
}
