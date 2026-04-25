import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Glasses, Mail, Lock, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentStep, setSentStep] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");

  useEffect(() => {
    const cleanAuthUrl = () => window.history.replaceState(null, "", "/auth");

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED")) {
        nav("/dashboard", { replace: true });
      }
    });

    const handleAuthRedirect = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const urlError = url.searchParams.get("error_description");
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const hashError = hash.get("error_description");
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");

      if (urlError || hashError) {
        cleanAuthUrl();
        toast.error(urlError || hashError || "Verification link is invalid or expired.");
        return;
      }

      // Implicit flow: tokens come back in the URL hash
      if (accessToken && refreshToken) {
        setLoading(true);
        const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        setLoading(false);
        cleanAuthUrl();
        if (error) {
          toast.error("Verification failed. Please resend the email.");
          setSentStep(true);
          return;
        }
        toast.success("Email verified. You are signed in!");
        nav("/upload", { replace: true });
        return;
      }

      if (code) {
        setLoading(true);
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        setLoading(false);
        cleanAuthUrl();

        if (error) {
          // Check if a session was already established despite the error
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            toast.success("You are signed in!");
            nav("/dashboard", { replace: true });
            return;
          }
          toast.error("Verification link expired or already used. Please sign in or resend the email.");
          setSentStep(true);
          return;
        }

        toast.success("Email verified. You are signed in!");
        nav("/dashboard", { replace: true });
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (data.session) nav("/dashboard", { replace: true });
    };

    handleAuthRedirect();

    return () => authListener.subscription.unsubscribe();
  }, [nav]);

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth` },
    });
    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes("already registered") || error.message.toLowerCase().includes("user already registered")) {
        toast.error("User already exists. Please sign in instead.");
        setActiveTab("signin");
        return;
      }
      return toast.error(error.message);
    }
    // Auto-confirm enabled: try sign in immediately
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) return toast.error(signInError.message);
    toast.success("Account created. You are signed in!");
    nav("/dashboard", { replace: true });
  };

  const resendOtp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Verification email re-sent.");
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        setSentStep(true);
        await supabase.auth.resend({ type: "signup", email });
        return toast.error("Please verify your email first. We sent a fresh verification link.");
      }
      return toast.error(error.message);
    }
    toast.success("Welcome back!");
    nav("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background bg-gradient-hero grid place-items-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <Link to="/" className="flex items-center justify-center gap-2 font-display font-bold text-2xl mb-8">
          <span className="w-11 h-11 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
            <Glasses className="w-6 h-6 text-primary-foreground" />
          </span>
          Lensly
        </Link>

        <div className="bg-card/80 bg-glass border border-border/50 rounded-3xl p-8 shadow-elegant">
          {sentStep ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
                <MailCheck className="w-7 h-7 text-primary-foreground" />
              </div>
              <h2 className="font-display font-bold text-xl">Check your email</h2>
              <p className="text-sm text-muted-foreground">
                We sent a verification link to <span className="text-foreground font-medium">{email}</span>.
                Click the link in the email to activate your account, then come back and sign in.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs pt-2">
                <button type="button" onClick={() => setSentStep(false)} className="text-muted-foreground hover:text-foreground transition-smooth">
                  ← Back
                </button>
                <button type="button" onClick={resendOtp} disabled={loading} className="text-primary hover:underline">
                  Resend email
                </button>
              </div>
            </div>
          ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full mb-6 rounded-xl">
              <TabsTrigger value="signin" className="rounded-lg">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={signIn} className="space-y-4">
                <Field id="si-email" label="Email" icon={Mail} type="email" value={email} onChange={setEmail} />
                <Field id="si-pass" label="Password" icon={Lock} type="password" value={password} onChange={setPassword} />
                <Button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-primary border-0 shadow-glow h-11">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={signUp} className="space-y-4">
                <Field id="su-email" label="Email" icon={Mail} type="email" value={email} onChange={setEmail} />
                <Field id="su-pass" label="Password" icon={Lock} type="password" value={password} onChange={setPassword} />
                <Button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-primary border-0 shadow-glow h-11">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <Link to="/" className="hover:text-foreground transition-smooth">← Back to home</Link>
        </p>
      </motion.div>
    </div>
  );
};

const Field = ({
  id, label, icon: Icon, type, value, onChange,
}: {
  id: string; label: string; icon: React.ComponentType<{ className?: string }>; type: string;
  value: string; onChange: (v: string) => void;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-xs">{label}</Label>
    <div className="relative">
      <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input id={id} type={type} required value={value} onChange={(e) => onChange(e.target.value)}
        className="rounded-xl pl-9 h-11" />
    </div>
  </div>
);

export default Auth;