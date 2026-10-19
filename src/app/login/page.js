"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { inputClass, labelClass } from "@/components/app/formStyles";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState("signin"); // "signin" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    router.push(searchParams.get("redirect") || "/app/dashboard");
    router.refresh();
  }

  async function handleForgotSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });

    setLoading(false);
    // Siempre se muestra el mismo mensaje exista o no el correo - no se
    // revela qué correos están registrados.
    setForgotSent(true);
  }

  if (mode === "forgot") {
    return (
      <div className="mt-8 space-y-4 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        {forgotSent ? (
          <p className="text-sm text-neutral-600">
            Si ese correo tiene una cuenta, te llegó un link para elegir una
            contraseña nueva.
          </p>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <label className={labelClass}>Correo</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[var(--brand-red)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Enviando…" : "Enviar link de recuperación"}
            </button>
          </form>
        )}
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setForgotSent(false);
            setError(null);
          }}
          className="text-sm font-medium text-neutral-500 hover:text-neutral-700"
        >
          ← Volver a acceso
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-4 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className={labelClass}>Correo</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className={labelClass}>Contraseña</label>
          <button
            type="button"
            onClick={() => setMode("forgot")}
            className="text-xs font-medium text-[var(--brand-red)] hover:opacity-80"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-[var(--brand-red)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link href="/" className="text-2xl font-semibold tracking-tight">
            SI<span className="text-[var(--brand-red)]">FENIX</span>
          </Link>
          <p className="mt-1 text-sm text-neutral-500">Acceso interno</p>
        </div>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
