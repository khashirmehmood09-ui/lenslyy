export type ThemePreset = {
  id: string;
  name: string;
  emoji: string;
  light: Record<string, string>;
  dark: Record<string, string>;
  defaultAccent: string; // HSL "h s% l%"
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "violet",
    name: "Violet Dream",
    emoji: "🟣",
    defaultAccent: "252 87% 62%",
    light: {
      "--background": "240 30% 98%",
      "--foreground": "240 30% 10%",
      "--card": "0 0% 100%",
      "--muted": "240 15% 94%",
      "--muted-foreground": "240 10% 45%",
      "--border": "240 15% 90%",
    },
    dark: {
      "--background": "240 30% 6%",
      "--foreground": "240 15% 96%",
      "--card": "240 28% 9%",
      "--muted": "240 22% 14%",
      "--muted-foreground": "240 10% 65%",
      "--border": "240 25% 18%",
    },
  },
  {
    id: "ocean",
    name: "Ocean Blue",
    emoji: "🌊",
    defaultAccent: "210 95% 55%",
    light: {
      "--background": "200 40% 98%",
      "--foreground": "210 50% 10%",
      "--card": "0 0% 100%",
      "--muted": "200 25% 94%",
      "--muted-foreground": "210 15% 40%",
      "--border": "200 25% 88%",
    },
    dark: {
      "--background": "210 45% 7%",
      "--foreground": "200 20% 96%",
      "--card": "210 40% 10%",
      "--muted": "210 30% 15%",
      "--muted-foreground": "200 15% 65%",
      "--border": "210 30% 20%",
    },
  },
  {
    id: "sunset",
    name: "Sunset Glow",
    emoji: "🌅",
    defaultAccent: "16 95% 58%",
    light: {
      "--background": "30 50% 98%",
      "--foreground": "20 40% 12%",
      "--card": "0 0% 100%",
      "--muted": "30 30% 94%",
      "--muted-foreground": "20 15% 40%",
      "--border": "30 30% 88%",
    },
    dark: {
      "--background": "20 35% 7%",
      "--foreground": "30 25% 96%",
      "--card": "20 30% 10%",
      "--muted": "20 25% 15%",
      "--muted-foreground": "30 15% 65%",
      "--border": "20 25% 20%",
    },
  },
  {
    id: "forest",
    name: "Forest",
    emoji: "🌲",
    defaultAccent: "150 60% 40%",
    light: {
      "--background": "120 25% 98%",
      "--foreground": "150 30% 10%",
      "--card": "0 0% 100%",
      "--muted": "120 15% 94%",
      "--muted-foreground": "150 10% 40%",
      "--border": "120 15% 88%",
    },
    dark: {
      "--background": "150 25% 7%",
      "--foreground": "120 15% 96%",
      "--card": "150 22% 10%",
      "--muted": "150 20% 15%",
      "--muted-foreground": "120 10% 65%",
      "--border": "150 20% 20%",
    },
  },
  {
    id: "rose",
    name: "Rose Pink",
    emoji: "🌸",
    defaultAccent: "340 85% 60%",
    light: {
      "--background": "340 30% 98%",
      "--foreground": "340 30% 12%",
      "--card": "0 0% 100%",
      "--muted": "340 20% 94%",
      "--muted-foreground": "340 10% 42%",
      "--border": "340 20% 88%",
    },
    dark: {
      "--background": "340 25% 7%",
      "--foreground": "340 15% 96%",
      "--card": "340 22% 10%",
      "--muted": "340 20% 15%",
      "--muted-foreground": "340 10% 65%",
      "--border": "340 20% 20%",
    },
  },
  {
    id: "mono",
    name: "Mono",
    emoji: "⚫",
    defaultAccent: "0 0% 20%",
    light: {
      "--background": "0 0% 99%",
      "--foreground": "0 0% 8%",
      "--card": "0 0% 100%",
      "--muted": "0 0% 94%",
      "--muted-foreground": "0 0% 40%",
      "--border": "0 0% 88%",
    },
    dark: {
      "--background": "0 0% 6%",
      "--foreground": "0 0% 96%",
      "--card": "0 0% 9%",
      "--muted": "0 0% 14%",
      "--muted-foreground": "0 0% 65%",
      "--border": "0 0% 18%",
    },
  },
];

export function hslToHex(hsl: string): string {
  const [h, s, l] = hsl.split(/\s+/).map((v) => parseFloat(v));
  const sN = s / 100;
  const lN = l / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lN - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToHsl(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let hh = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: hh = (g - b) / d + (g < b ? 6 : 0); break;
      case g: hh = (b - r) / d + 2; break;
      case b: hh = (r - g) / d + 4; break;
    }
    hh *= 60;
  }
  return `${Math.round(hh)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}