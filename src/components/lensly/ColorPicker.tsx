import { useRef } from "react";

interface Props {
  hue: number; saturation: number; lightness: number;
  onChange: (h: number, s: number, l: number) => void;
}

const PRESETS = [
  { name: "Onyx", h: 240, s: 8, l: 12 },
  { name: "Tortoise", h: 28, s: 65, l: 30 },
  { name: "Crystal", h: 200, s: 60, l: 55 },
  { name: "Rose", h: 340, s: 70, l: 55 },
  { name: "Forest", h: 150, s: 55, l: 28 },
  { name: "Gold", h: 42, s: 80, l: 50 },
  { name: "Sky", h: 210, s: 90, l: 60 },
  { name: "Plum", h: 285, s: 55, l: 35 },
];

export const ColorPicker = ({ hue, saturation, lightness, onChange }: Props) => {
  const ringRef = useRef<HTMLDivElement>(null);

  const handleRing = (e: React.MouseEvent | React.TouchEvent) => {
    const ring = ringRef.current; if (!ring) return;
    const rect = ring.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const point = "touches" in e ? e.touches[0] : e;
    const angle = Math.atan2(point.clientY - cy, point.clientX - cx) * (180 / Math.PI);
    const h = (angle + 360 + 90) % 360;
    onChange(Math.round(h), saturation, lightness);
  };

  const color = `hsl(${hue} ${saturation}% ${lightness}%)`;

  return (
    <div className="space-y-4">
      {/* Hue ring with center swatch */}
      <div className="flex items-center gap-5">
        <div
          ref={ringRef}
          onMouseDown={(e) => { handleRing(e); const move = (ev: MouseEvent) => handleRing(ev as any); const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); }; window.addEventListener("mousemove", move); window.addEventListener("mouseup", up); }}
          onTouchStart={handleRing}
          onTouchMove={handleRing}
          className="relative w-32 h-32 rounded-full cursor-pointer shrink-0 select-none"
          style={{ background: "conic-gradient(from 0deg, hsl(0 80% 55%), hsl(60 80% 55%), hsl(120 80% 55%), hsl(180 80% 55%), hsl(240 80% 55%), hsl(300 80% 55%), hsl(360 80% 55%))" }}
        >
          <div className="absolute inset-3 rounded-full bg-card shadow-inner grid place-items-center">
            <div className="w-16 h-16 rounded-full border-4 border-card shadow-elegant transition-smooth" style={{ background: color }} />
          </div>
          {/* Hue indicator */}
          <div
            className="absolute w-3 h-3 rounded-full bg-white border-2 border-foreground shadow-md pointer-events-none"
            style={{
              left: "50%", top: "50%",
              transform: `translate(-50%, -50%) rotate(${hue - 90}deg) translateY(-58px)`,
            }}
          />
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Saturation</span><span>{saturation}%</span>
            </div>
            <input type="range" min={0} max={100} value={saturation}
              onChange={(e) => onChange(hue, +e.target.value, lightness)}
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[hsl(var(--primary))]"
              style={{ background: `linear-gradient(to right, hsl(${hue} 0% ${lightness}%), hsl(${hue} 100% ${lightness}%))` }}
            />
          </div>
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Lightness</span><span>{lightness}%</span>
            </div>
            <input type="range" min={5} max={90} value={lightness}
              onChange={(e) => onChange(hue, saturation, +e.target.value)}
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[hsl(var(--primary))]"
              style={{ background: `linear-gradient(to right, #000, hsl(${hue} ${saturation}% 50%), #fff)` }}
            />
          </div>
          <p className="text-xs font-mono text-muted-foreground tabular-nums">{color}</p>
        </div>
      </div>

      {/* Preset chips */}
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const active = p.h === hue && p.s === saturation && p.l === lightness;
            return (
              <button
                key={p.name}
                onClick={() => onChange(p.h, p.s, p.l)}
                className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-smooth ${active ? "border-primary shadow-glow scale-105" : "border-border hover:border-primary/50"}`}
              >
                <span className="w-6 h-6 rounded-full border border-border" style={{ background: `hsl(${p.h} ${p.s}% ${p.l}%)` }} />
                <span className="text-xs font-medium">{p.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};