import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/lensly/Navbar";
import { FrameCard } from "@/components/lensly/FrameCard";
import { FrameViewer } from "@/components/lensly/FrameViewer";
import { FRAMES, FaceShape, GlassesType, StylePref, AVOID_BY_SHAPE, Frame } from "@/data/frames";

const Results = () => {
  const [params] = useSearchParams();
  const shape = (params.get("shape") || "Oval") as FaceShape;
  const [type, setType] = useState<GlassesType>("Eyeglasses");
  const [style, setStyle] = useState<StylePref | "All">("All");
  const [budget, setBudget] = useState(250);
  const [selected, setSelected] = useState<Frame | null>(null);

  const scored = useMemo(() => {
    return FRAMES
      .filter(f => f.type === type && f.price <= budget)
      .map(f => {
        let score = 50;
        if (f.suits.includes(shape)) score += 35;
        if (f.avoidFor.includes(shape)) score -= 30;
        if (style === "All" || f.style === style) score += 10;
        score += Math.round((250 - f.price) / 25);
        return { f, score: Math.max(20, Math.min(99, score)) };
      })
      .sort((a, b) => b.score - a.score);
  }, [type, style, budget, shape]);

  const overall = scored.length ? Math.round(scored.slice(0, 3).reduce((s, x) => s + x.score, 0) / Math.min(3, scored.length)) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <main className="container mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16 sm:pb-20 relative">

        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <Link to="/upload" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2">
              <ArrowLeft className="w-3 h-3" /> Try another image
            </Link>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Frames for your <span className="text-gradient">{shape}</span> face
            </h1>
            <p className="text-muted-foreground mt-2">{AVOID_BY_SHAPE[shape]}</p>
          </div>

          <motion.div
            key={overall}
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-glass border border-border rounded-3xl p-5 shadow-elegant min-w-[180px]"
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary" /> Confidence
            </p>
            <p className="font-display font-bold text-4xl text-gradient">{overall}%</p>
            <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
              <motion.div className="h-full bg-gradient-primary" initial={{ width: 0 }} animate={{ width: `${overall}%` }} transition={{ duration: 0.6 }} />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-3xl p-5 shadow-elegant flex flex-wrap items-center gap-4 mb-8">
          <div className="flex gap-2">
            {(["Eyeglasses", "Sunglasses"] as GlassesType[]).map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-smooth ${
                  type === t ? "bg-gradient-primary text-primary-foreground shadow-glow" : "bg-secondary text-foreground hover:bg-secondary/70"
                }`}>{t === "Eyeglasses" ? "🤓 Eyeglasses" : "😎 Sunglasses"}</button>
            ))}
          </div>
          <div className="h-6 w-px bg-border hidden md:block" />
          <div className="flex gap-2">
            {(["All", "Minimal", "Bold"] as const).map(s => (
              <button key={s} onClick={() => setStyle(s)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-smooth ${
                  style === s ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}>{s}</button>
            ))}
          </div>
          <div className="h-6 w-px bg-border hidden md:block" />
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Budget</span>
            <input type="range" min={80} max={250} value={budget} onChange={(e) => setBudget(+e.target.value)}
              className="flex-1 accent-[hsl(var(--primary))]" />
            <span className="text-sm font-semibold tabular-nums w-16 text-right">${budget}</span>
          </div>
          <Button asChild variant="outline" className="rounded-xl">
            <a href="https://www.google.com/maps/search/optical+shops+near+me" target="_blank" rel="noreferrer">
              <MapPin className="w-4 h-4 mr-2" /> Nearby shops
            </a>
          </Button>
        </div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {scored.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">No frames match your filters. Try widening your budget.</p>
          ) : (
            <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {scored.map(({ f, score }) => (
                <FrameCard key={f.id} frame={f} score={score} onOpen={() => setSelected(f)} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <FrameViewer
        frame={selected}
        onClose={() => setSelected(null)}
        reason={selected?.reason || ""}
        avoid={AVOID_BY_SHAPE[shape]}
      />
    </div>
  );
};

export default Results;