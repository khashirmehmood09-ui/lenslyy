import { Palette, Sun, Moon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme } from "./ThemeProvider";
import { THEME_PRESETS, hslToHex, hexToHsl } from "@/lib/themes";

const SWATCHES = [
  "252 87% 62%", "210 95% 55%", "16 95% 58%", "150 60% 40%",
  "340 85% 60%", "45 95% 55%", "280 80% 60%", "0 0% 20%",
];

export const ThemePicker = () => {
  const { preset, setPresetId, accent, setAccent, mode, toggleMode } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl" aria-label="Customize theme">
          <Palette className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-5 rounded-2xl bg-glass border-border/50">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="font-display font-semibold text-sm">Customize</h4>
            <Button variant="ghost" size="sm" className="rounded-lg gap-2" onClick={toggleMode}>
              {mode === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              {mode === "dark" ? "Light" : "Dark"}
            </Button>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium">Theme</p>
            <div className="grid grid-cols-3 gap-2">
              {THEME_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPresetId(p.id)}
                  className={`relative rounded-xl border-2 p-2 transition-smooth text-left ${
                    preset.id === p.id ? "border-primary" : "border-border/50 hover:border-border"
                  }`}
                >
                  <div
                    className="w-full h-8 rounded-md mb-1.5"
                    style={{ background: `linear-gradient(135deg, hsl(${p.defaultAccent}), hsl(${p.dark["--background"]}))` }}
                  />
                  <p className="text-[11px] font-medium truncate">{p.emoji} {p.name}</p>
                  {preset.id === p.id && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary grid place-items-center">
                      <Check className="w-2.5 h-2.5 text-primary-foreground" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium">Accent color</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {SWATCHES.map((s) => (
                <button
                  key={s}
                  onClick={() => setAccent(s)}
                  className={`w-7 h-7 rounded-full border-2 transition-smooth ${
                    accent === s ? "border-foreground scale-110" : "border-border/50"
                  }`}
                  style={{ background: `hsl(${s})` }}
                  aria-label={`Color ${s}`}
                />
              ))}
            </div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input
                type="color"
                value={hslToHex(accent)}
                onChange={(e) => setAccent(hexToHsl(e.target.value))}
                className="w-8 h-8 rounded-lg border border-border/50 cursor-pointer bg-transparent"
              />
              <span>Pick custom color</span>
            </label>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};