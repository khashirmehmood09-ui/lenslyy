import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Frame } from "@/data/frames";
import { X, MapPin, Check, AlertTriangle, RotateCw, Move3d } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Glasses3D } from "./Glasses3D";
import { ColorPicker } from "./ColorPicker";

export const FrameViewer = ({ frame, onClose, reason, avoid }: {
  frame: Frame | null; onClose: () => void; reason: string; avoid: string;
}) => {
  const [hue, setHue] = useState(240);
  const [sat, setSat] = useState(40);
  const [light, setLight] = useState(25);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (frame) { setHue(frame.swatches[0].hue); setSat(40); setLight(25); }
  }, [frame]);

  const color = `hsl(${hue} ${sat}% ${light}%)`;

  return (
    <AnimatePresence>
      {frame && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-xl grid place-items-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-card border border-border rounded-2xl sm:rounded-3xl shadow-elegant max-w-5xl w-full max-h-[92vh] grid md:grid-cols-[1.1fr_1fr] overflow-hidden overflow-y-auto"
          >
            <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-glass border border-border grid place-items-center hover:scale-110 transition-smooth">
              <X className="w-4 h-4" />
            </button>

            {/* Real 3D viewer */}
            <div className="relative h-[280px] sm:h-[380px] md:h-auto bg-gradient-hero overflow-hidden">
              <div className="absolute inset-0 bg-gradient-primary opacity-10 animate-glow-pulse pointer-events-none" />
              <Glasses3D shape={frame.shape} color={color} autoRotate={autoRotate} />
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <button
                  onClick={() => setAutoRotate((v) => !v)}
                  className="bg-glass border border-border rounded-full px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:scale-105 transition-smooth"
                >
                  <RotateCw className={`w-3 h-3 ${autoRotate ? "text-primary" : ""}`} />
                  {autoRotate ? "Auto-rotate on" : "Auto-rotate off"}
                </button>
              </div>
              <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-glass border border-border rounded-full px-3 py-1 flex items-center gap-1.5 whitespace-nowrap">
                <Move3d className="w-3 h-3" /> Drag to rotate · scroll to zoom
              </p>
            </div>

            <div className="p-5 sm:p-7 flex flex-col gap-4 overflow-y-auto">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{frame.brand}</p>
                <h2 className="font-display font-bold text-2xl">{frame.name}</h2>
                <p className="text-muted-foreground mt-1">{frame.shape} · {frame.style} · ${frame.price}</p>
              </div>

              <div className="bg-secondary/40 border border-border rounded-2xl p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Pick your shade</p>
                <ColorPicker hue={hue} saturation={sat} lightness={light}
                  onChange={(h, s, l) => { setHue(h); setSat(s); setLight(l); }} />
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
                <div className="flex gap-2 items-start">
                  <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm">{reason}</p>
                </div>
              </div>
              <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4">
                <div className="flex gap-2 items-start">
                  <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-sm text-muted-foreground">{avoid}</p>
                </div>
              </div>

              <Button asChild className="rounded-xl bg-gradient-primary border-0 shadow-glow mt-auto">
                <a href="https://www.google.com/maps/search/optical+shops+near+me" target="_blank" rel="noreferrer">
                  <MapPin className="w-4 h-4 mr-2" /> Find nearby optical shops
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};