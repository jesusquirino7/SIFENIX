"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { inputClass, labelClass } from "@/components/app/formStyles";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
        <label className={labelClass}>Contraseña</label>
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
