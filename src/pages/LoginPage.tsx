import { useState } from "react";
import { motion } from "framer-motion";
import { Home, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm flex flex-col items-center text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
          <Home size={32} className="text-primary" />
        </div>

        <h1 className="text-h1 text-foreground mb-2">Welcome to Primer</h1>
        <p className="text-body-small text-muted-foreground mb-8">
          Your AI-powered home maintenance assistant
        </p>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-primer w-full text-center py-8"
          >
            <CheckCircle2 size={40} className="text-success mx-auto mb-4" />
            <h2 className="text-h3 text-foreground mb-2">Check your email</h2>
            <p className="text-body-small text-muted-foreground">
              We sent a magic link to <strong>{email}</strong>. Click it to sign in.
            </p>
            <button
              onClick={() => { setSent(false); setEmail(""); }}
              className="text-caption text-primary mt-4"
            >
              Use a different email
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoFocus
                className="w-full h-12 pl-11 pr-4 rounded-2xl border border-border bg-card text-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            {error && (
              <p className="text-caption text-destructive">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full h-12 bg-primary text-primary-foreground rounded-full text-base font-semibold active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                "Continue with Magic Link"
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;
