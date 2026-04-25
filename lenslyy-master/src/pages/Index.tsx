import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Camera, Wand2, MapPin, Glasses } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/lensly/Navbar";
import hero from "@/assets/hero-glasses-new.jpg";

const features = [
  { icon: Camera, title: "AI Face Mesh", desc: "MediaPipe analyzes 468 facial landmarks in seconds." },
  { icon: Wand2, title: "Smart Recommendations", desc: "Frames matched to your shape with reasoning." },
  { icon: Sparkles, title: "Confidence Score", desc: "Live match score updates as you tweak preferences." },
  { icon: MapPin, title: "Nearby Opticals", desc: "One tap to find shops to try them on locally." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-32 px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-primary/30 blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-0 -right-32 w-96 h-96 rounded-full bg-accent/30 blur-[120px] animate-glow-pulse" />

        <div className="container mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                Your perfect <span className="text-gradient">glasses</span>,<br />found instantly.
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mt-5 sm:mt-6 max-w-md leading-relaxed">
                Upload a selfie. Our AI reads your face shape and recommends frames that actually suit you — with confidence scores and clear reasoning.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Button asChild size="lg" className="rounded-2xl bg-gradient-primary border-0 shadow-glow text-base h-14 px-8 hover:opacity-90">
                  <Link to="/upload">Try it free <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-2xl h-14 px-8 text-base border-border bg-glass">
                  <Link to="/dashboard">View dashboard</Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 mt-10 text-sm text-muted-foreground">
                <div><span className="font-display font-bold text-2xl text-foreground">468</span><br />landmarks</div>
                <div><span className="font-display font-bold text-2xl text-foreground">4</span><br />face shapes</div>
                <div><span className="font-display font-bold text-2xl text-foreground">6+</span><br />curated frames</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-elegant border border-border animate-float">
                <img src={hero} alt="Premium glasses" width={1536} height={1024} className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-6 -left-6 bg-glass border border-border rounded-2xl p-4 shadow-elegant"
              >
                <p className="text-xs text-muted-foreground">Confidence</p>
                <p className="font-display font-bold text-2xl text-gradient">94%</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="absolute -top-6 -right-6 bg-glass border border-border rounded-2xl p-4 shadow-elegant flex items-center gap-2"
              >
                <Glasses className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Detected</p>
                  <p className="font-display font-semibold">Oval</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative">
        <div className="container mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Built for the perfect fit</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">From facial geometry to nearby retail — everything in one flow.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card border border-border rounded-3xl p-6 hover:shadow-glow transition-smooth group"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-primary grid place-items-center mb-4 group-hover:scale-110 transition-smooth">
                  <f.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="container mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-primary p-8 sm:p-12 md:p-20 text-center shadow-glow">
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_30%,white,transparent_60%)]" />
            <h2 className="relative font-display text-3xl sm:text-4xl md:text-6xl font-bold text-primary-foreground tracking-tight">Ready to see yourself?</h2>
            <p className="relative text-primary-foreground/80 mt-4 max-w-lg mx-auto">Takes 30 seconds. No signup required to try.</p>
            <Button asChild size="lg" className="relative mt-8 rounded-2xl bg-background text-foreground hover:bg-background/90 h-14 px-8 text-base">
              <Link to="/upload">Upload your photo <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="py-10 px-6 border-t border-border">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          Developed by Khalil Ullah, Hashir Qureshi and Fizza Batool
        </div>
      </footer>
    </div>
  );
};

export default Index;
