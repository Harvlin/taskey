import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/store/auth";
import { Loader2, ArrowLeft } from "lucide-react";
import { isRealApiConfigured } from "@/services/api/client";

interface Props { mode: "login" | "signup"; }

export default function Auth({ mode }: Props) {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname?: string } } };
  const { login, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(mode === "login" ? "demo@todoist.local" : "");
  const [password, setPassword] = useState(mode === "login" ? "demo1234" : "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLogin = mode === "login";
  const redirectTo = location.state?.from?.pathname || "/today";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isLogin) await login(email, password);
      else await register(name.trim() || email.split("@")[0], email, password);
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-background text-foreground">
      <div className="hidden md:flex relative overflow-hidden bg-sidebar p-10 flex-col justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold w-max">
          <span className="h-6 w-6 rounded-md bg-primary text-primary-foreground grid place-items-center text-xs font-bold">T</span>
          Tasksy
        </Link>
        <div className="relative max-w-sm">
          <div
            aria-hidden
            className="absolute -inset-12 -z-10 opacity-60 blur-3xl"
            style={{ background: "radial-gradient(circle at 30% 30%, hsl(var(--primary)/0.35), transparent 60%)" }}
          />
          <blockquote className="text-2xl font-medium leading-snug">
            "Tasksy is the only app I open every morning. It's calm, fast, and out of my way."
          </blockquote>
          <p className="mt-4 text-sm text-muted-foreground">— Maya R., Product Designer</p>
        </div>
        <div className="text-xs text-muted-foreground">Free forever for individuals.</div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-8">
            <ArrowLeft className="h-3 w-3" /> Back to home
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {isLogin ? "Sign in to continue to Tasksy." : "Get started — it takes less than a minute."}
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Morgan" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="you@email.com" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {isLogin && <span className="text-xs text-muted-foreground">Forgot?</span>}
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete={isLogin ? "current-password" : "new-password"} placeholder="••••••••" />
            </div>

            {error && <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2">{error}</div>}

            <Button type="submit" className="w-full h-10" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLogin ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground text-center">
            {isLogin ? (
              <>Don't have an account? <Link to="/signup" className="text-foreground font-medium hover:underline">Sign up</Link></>
            ) : (
              <>Already have an account? <Link to="/login" className="text-foreground font-medium hover:underline">Sign in</Link></>
            )}
          </p>

          {!isRealApiConfigured() && (
            <div className="mt-8 rounded-md border border-border bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
              <span className="font-medium text-foreground">Demo mode</span> — no backend configured. Try{" "}
              <code className="bg-background px-1 rounded">demo@todoist.local</code> / <code className="bg-background px-1 rounded">demo1234</code>, or sign up with any email.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}