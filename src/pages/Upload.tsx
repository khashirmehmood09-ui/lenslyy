import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, Loader2, Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/lensly/Navbar";
import { detectFaceShape } from "@/lib/faceShape";
import { FaceShape, FACE_SHAPE_DESCRIPTIONS, FRAMES } from "@/data/frames";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface AIResult {
  faceShape: FaceShape;
  confidence: number;
  reasoning: string;
  recommendedFrames: string[];
  styleAdvice: string;
  avoid: string;
}

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const SHAPES: FaceShape[] = ["Round", "Oval", "Square", "Heart"];

const Upload = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [detected, setDetected] = useState<FaceShape | null>(null);
  const [manual, setManual] = useState(false);
  const [confident, setConfident] = useState(true);
  const [ai, setAi] = useState<AIResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const onFile = async (file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image"); return; }
    if (file.size > 8 * 1024 * 1024) { toast.error("Image must be under 8MB"); return; }
    const url = URL.createObjectURL(file);
    setImgUrl(url); setLoadingUpload(true); setDetected(null); setManual(false); setAi(null);

    // Kick off AI analysis in parallel
    (async () => {
      try {
        setAiLoading(true);
        const base64 = await fileToBase64(file);
        const { data, error } = await supabase.functions.invoke("analyze-face", {
          body: { imageBase64: base64 },
        });
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
        setAi(data as AIResult);
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message || "AI analysis failed");
      } finally {
        setAiLoading(false);
      }
    })();

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      try {
        const res = await detectFaceShape(img);
        setDetected(res.shape);
        setConfident(res.confident);
        if (res.confident) toast.success(`Detected ${res.shape} face`);
        else toast(`Best guess: ${res.shape} — you can change it below`);
      } catch {
        setDetected("Oval");
        setConfident(false);
        toast("Best guess: Oval — you can change it below");
      }
      setLoadingUpload(false);
    };
    img.src = url;
  };

  const confirm = (shape: FaceShape) => {
    if (!user) return;
    // Save to history
    const key = `lensly:history:${user.id}`;
    const history = JSON.parse(localStorage.getItem(key) || "[]");
    history.unshift({ id: Date.now(), shape, image: imgUrl, date: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(history.slice(0, 12)));
    navigate(`/results?shape=${shape}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <main className="container mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16 sm:pb-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-10"
        >
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Upload your photo</h1>
          <p className="text-muted-foreground mt-3">Front-facing, good lighting, no glasses. We analyze locally — your photo never leaves your device.</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {!imgUrl && (
            <motion.label
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              htmlFor="file"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
              className="block cursor-pointer bg-card border-2 border-dashed border-border rounded-3xl p-8 sm:p-16 text-center hover:border-primary hover:bg-primary/5 transition-smooth"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-primary grid place-items-center mx-auto mb-4 shadow-glow">
                <UploadIcon className="w-7 h-7 text-primary-foreground" />
              </div>
              <p className="font-display font-semibold text-lg">Drop image or click to upload</p>
              <p className="text-sm text-muted-foreground mt-1">JPG, PNG · max 8MB</p>
              <input id="file" ref={fileInput} type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
            </motion.label>
          )}

          <AnimatePresence>
            {imgUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="grid md:grid-cols-2 gap-6"
              >
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-elegant">
                  <img src={imgUrl} alt="Your upload" className="w-full h-64 sm:h-80 object-cover" />
                </div>
                <div className="bg-card border border-border rounded-3xl p-6 shadow-elegant flex flex-col">
                  {loading && (
                    <div className="flex-1 grid place-items-center text-center">
                      <div>
                        <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                        <p className="mt-3 font-medium">Analyzing 468 landmarks...</p>
                        <p className="text-xs text-muted-foreground mt-1">First load can take a moment</p>
                      </div>
                    </div>
                  )}
                  {!loadingUpload && detected && !manual && (
                    <>
                      <div className="mt-4 p-3 rounded-2xl bg-secondary/60 border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <p className="text-xs uppercase tracking-wider font-semibold">AI Stylist</p>
                        </div>
                        {aiLoading && (
                          <p className="text-xs text-muted-foreground flex items-center gap-2">
                            <Loader2 className="w-3 h-3 animate-spin" /> Analyzing your features…
                          </p>
                        )}
                        {ai && !aiLoading && (
                          <div className="space-y-1">
                            <p className="text-sm">
                              <strong>{ai.faceShape}</strong> face · {Math.round(ai.confidence * 100)}% confidence
                            </p>
                            <p className="text-xs text-muted-foreground">{ai.reasoning}</p>
                            <p className="text-sm mt-2">
                              ✨ Recommended: <strong>{ai.recommendedFrames.join(", ")}</strong>
                            </p>
                            <p className="text-xs text-muted-foreground">{ai.styleAdvice}</p>
                            <p className="text-xs text-muted-foreground"><em>Avoid:</em> {ai.avoid}</p>
                          </div>
                        )}
                        {!ai && !aiLoading && (
                          <p className="text-xs text-muted-foreground">AI couldn't analyze the image — using local detection.</p>
                        )}
                      </div>
                      <div className="flex gap-2 mt-auto pt-6">
                        <Button onClick={() => confirm(ai?.faceShape ?? detected)} className="flex-1 rounded-xl bg-gradient-primary border-0 shadow-glow">
                          <Check className="w-4 h-4 mr-2" /> See recommended glasses
                        </Button>
                        <Button variant="outline" onClick={() => setManual(true)} className="rounded-xl">
                          <X className="w-4 h-4 mr-2" /> Change
                        </Button>
                      </div>
                    </>
                  )}
                  {!loadingUpload && manual && (
                    <>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Choose your face shape</p>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {SHAPES.map((s) => (
                          <button key={s} onClick={() => confirm(s)}
                            className="bg-secondary hover:bg-primary hover:text-primary-foreground border border-border rounded-2xl p-4 text-left transition-smooth">
                            <p className="font-display font-semibold">{s}</p>
                            <p className="text-xs opacity-75 mt-1">{FACE_SHAPE_DESCRIPTIONS[s]}</p>
                          </button>
                        ))}
                      </div>
                      <Button variant="ghost" onClick={() => { setImgUrl(null); setDetected(null); setManual(false); }} className="mt-4 rounded-xl">
                        Try another image
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Upload;