import { Link, useLocation, useNavigate } from "react-router-dom";
import { Glasses, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemePicker } from "./ThemePicker";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/upload", label: "Try it" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
        <nav className="bg-glass border border-border/50 rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between shadow-elegant">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-base sm:text-lg shrink-0">
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
              <Glasses className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </span>
            <span>Lensly</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-smooth ${
                  pathname === l.to ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                }`}>{l.label}</Link>
            ))}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemePicker />
            {user && (
              <Button
                variant="ghost" size="icon"
                className="rounded-xl"
                onClick={handleSignOut}
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost" size="icon"
              className="rounded-xl md:hidden"
              onClick={() => setOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden mt-2 bg-glass border border-border/50 rounded-2xl p-3 shadow-elegant flex flex-col gap-1 animate-fade-in">
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-smooth ${
                  pathname === l.to ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}>{l.label}</Link>
            ))}
            {user && (
              <Button
                variant="ghost"
                onClick={() => { handleSignOut(); setOpen(false); }}
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition-smooth text-muted-foreground hover:text-foreground hover:bg-secondary justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};