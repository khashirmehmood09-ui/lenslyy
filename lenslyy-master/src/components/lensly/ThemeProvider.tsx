import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { THEME_PRESETS, ThemePreset } from "@/lib/themes";

type Mode = "light" | "dark";

type ThemeCtx = {
  preset: ThemePreset;
  setPresetId: (id: string) => void;
  accent: string; // HSL string
  setAccent: (hsl: string) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  toggleMode: () => void;
};

const Ctx = createContext<ThemeCtx | null>(null);

const lighten = (hsl: string, dl: number) => {
  const [h, s, l] = hsl.split(/\s+/).map(parseFloat);
  return `${h} ${s}% ${Math.max(0, Math.min(100, l + dl))}%`;
};

// Pick a readable foreground (near-black or near-white) based on accent lightness.
// Light accents (green, yellow, etc.) get dark text; dark accents get white text.
const readableFg = (hsl: string) => {
  const [, , l] = hsl.split(/\s+/).map(parseFloat);
  return l >= 60 ? "0 0% 8%" : "0 0% 100%";
};

const applyTheme = (preset: ThemePreset, accent: string, mode: Mode) => {
  const root = document.documentElement;
  root.classList.toggle("dark", mode === "dark");
  const tokens = mode === "dark" ? preset.dark : preset.light;
  Object.entries(tokens).forEach(([k, v]) => root.style.setProperty(k, v));

  const glow = lighten(accent, mode === "dark" ? 10 : 8);
  const accent2 = lighten(accent, mode === "dark" ? -15 : 15);
  const fg = readableFg(accent);
  root.style.setProperty("--primary", accent);
  root.style.setProperty("--primary-foreground", fg);
  root.style.setProperty("--primary-glow", glow);
  root.style.setProperty("--accent", accent2);
  root.style.setProperty("--accent-foreground", readableFg(accent2));
  root.style.setProperty("--ring", accent);
  root.style.setProperty(
    "--gradient-primary",
    `linear-gradient(135deg, hsl(${accent}), hsl(${glow}) 50%, hsl(${accent2}))`
  );
  root.style.setProperty(
    "--gradient-hero",
    `radial-gradient(ellipse at top, hsl(${accent} / 0.25), transparent 60%), radial-gradient(ellipse at bottom right, hsl(${accent2} / 0.2), transparent 50%)`
  );
  root.style.setProperty("--shadow-glow", `0 25px 80px -15px hsl(${accent} / 0.5)`);
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [presetId, setPresetIdState] = useState<string>(() => localStorage.getItem("lensly.preset") || "violet");
  const [accent, setAccentState] = useState<string>(() => localStorage.getItem("lensly.accent") || "");
  const [mode, setModeState] = useState<Mode>(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const preset = THEME_PRESETS.find((p) => p.id === presetId) || THEME_PRESETS[0];
  const effAccent = accent || preset.defaultAccent;

  useEffect(() => {
    applyTheme(preset, effAccent, mode);
    localStorage.setItem("lensly.preset", preset.id);
    localStorage.setItem("lensly.accent", effAccent);
    localStorage.setItem("theme", mode);
  }, [preset, effAccent, mode]);

  return (
    <Ctx.Provider
      value={{
        preset,
        setPresetId: (id) => {
          setPresetIdState(id);
          const p = THEME_PRESETS.find((x) => x.id === id);
          if (p) setAccentState(p.defaultAccent);
        },
        accent: effAccent,
        setAccent: setAccentState,
        mode,
        setMode: setModeState,
        toggleMode: () => setModeState(mode === "dark" ? "light" : "dark"),
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useTheme = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useTheme must be used inside ThemeProvider");
  return c;
};