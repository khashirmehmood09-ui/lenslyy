import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, ArrowRight, Glasses } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/lensly/Navbar";
import { useAuth } from "@/hooks/useAuth";

interface HistoryItem { id: number; shape: string; image: string; date: string; }

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }
    if (user) {
      const key = `lensly:history:${user.id}`;
      setHistory(JSON.parse(localStorage.getItem(key) || "[]"));
    }
  }, [user, loading, navigate]);

  const clearAll = () => {
    if (user) {
      const key = `lensly:history:${user.id}`;
      localStorage.removeItem(key);
      setHistory([]);
    }
  };
  const removeOne = (id: number) => {
    if (user) {
      const key = `lensly:history:${user.id}`;
      const next = history.filter(h => h.id !== id);
      setHistory(next);
      localStorage.setItem(key, JSON.stringify(next));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <main className="container mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16 sm:pb-20 relative">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Your space</p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Your detection history and recommendations.</p>
          </div>
          {history.length > 0 && (
            <Button variant="outline" onClick={clearAll} className="rounded-xl">
              <Trash2 className="w-4 h-4 mr-2" /> Clear all
            </Button>
          )}
        </div>

        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-3xl p-16 text-center shadow-elegant"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary grid place-items-center mx-auto mb-4 shadow-glow">
              <Glasses className="w-7 h-7 text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl font-semibold">No history yet</h2>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Upload a photo to start getting personalized frame recommendations.</p>
            <Button asChild className="mt-6 rounded-2xl bg-gradient-primary border-0 shadow-glow">
              <Link to="/upload">Try it now <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {history.map((h, i) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-3xl overflow-hidden shadow-elegant group"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={h.image} alt={h.shape} className="w-full h-full object-cover group-hover:scale-105 transition-smooth" />
                  <div className="absolute top-3 right-3 bg-glass border border-border rounded-full px-3 py-1 text-xs font-semibold">
                    {h.shape}
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{new Date(h.date).toLocaleDateString()}</p>
                    <p className="font-display font-semibold">{h.shape} face</p>
                  </div>
                  <div className="flex gap-1">
                    <Button asChild size="sm" variant="ghost" className="rounded-xl">
                      <Link to={`/results?shape=${h.shape}`}>View</Link>
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => removeOne(h.id)} className="rounded-xl">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;