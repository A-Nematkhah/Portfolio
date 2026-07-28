import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, LogOut, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export default function AdminApp() {
  const { session, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (!session || !isAdmin) return <LoginForm authed={!!session} />;
  return <Dashboard />;
}

function LoginForm({ authed }: { authed: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) { setErr("Invalid credentials"); return; }
    // useAuth will re-evaluate and render Dashboard if admin
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background p-4">
      <div className="w-full max-w-sm rounded-2xl glass p-8">
        <h1 className="text-xl font-bold">Admin sign in</h1>
        <p className="mt-1 text-xs text-muted-foreground">Private area. Authorized access only.</p>
        {authed && <p className="mt-3 text-xs text-destructive">This account is not an admin.</p>}
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
            className="w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary" />
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
            className="w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary" />
          {err && <p className="text-xs text-destructive">{err}</p>}
          <button type="submit" disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground glow-primary hover:opacity-90 disabled:opacity-60 transition">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
          </button>
        </form>
        <Link to="/" className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-3 w-3" /> Back to site
        </Link>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin</h1>
          <button onClick={() => supabase.auth.signOut()}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:border-primary/50 transition">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
        <div className="rounded-2xl glass p-6">
          <p className="text-sm text-muted-foreground">
            You're signed in. Manage projects directly on the public site — admin controls
            (Add / Edit / Delete) are now visible inside each category tab.
          </p>
          <Link to="/" className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground glow-primary hover:opacity-90 transition">
            <ArrowLeft className="h-4 w-4" /> Go to portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
