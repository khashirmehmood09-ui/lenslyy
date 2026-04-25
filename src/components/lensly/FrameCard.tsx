import { motion } from "framer-motion";
import { useState } from "react";
import { Frame } from "@/data/frames";
import { Sparkles } from "lucide-react";

export const FrameCard = ({ frame, onOpen, score }: { frame: Frame; onOpen: () => void; score: number }) => {
  const [hue, setHue] = useState(frame.swatches[0].hue);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={onOpen}
      className="group relative cursor-pointer bg-card border border-border rounded-3xl p-6 shadow-elegant overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-smooth" />
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-glass border border-border/50 rounded-full px-3 py-1 text-xs font-semibold">
        <Sparkles className="w-3 h-3 text-primary" />
        {score}% match
      </div>

      <div className="relative h-52 grid place-items-center mb-4">
        <motion.img
          src={frame.image}
          alt={frame.name}
          loading="lazy"
          width={1024}
          height={768}
          className="w-full h-full object-contain drop-shadow-2xl"
          style={{ filter: `hue-rotate(${hue - 240}deg) saturate(1.1)` }}
          whileHover={{ scale: 1.08, rotate: -2 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{frame.brand}</p>
          <h3 className="font-display font-semibold text-lg">{frame.name}</h3>
        </div>
        <p className="font-display font-bold text-lg">${frame.price}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{frame.shape} · {frame.style}</span>
        <div className="flex gap-1.5">
          {frame.swatches.slice(0, 4).map((s) => (
            <button
              key={s.name}
              onClick={(e) => { e.stopPropagation(); setHue(s.hue); }}
              className={`w-5 h-5 rounded-full border-2 transition-smooth ${hue === s.hue ? "border-primary scale-110" : "border-border"}`}
              style={{ background: `hsl(${s.hue} 60% 50%)` }}
              aria-label={s.name}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};