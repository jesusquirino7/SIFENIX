"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { inputClass, labelClass } from "@/components/app/formStyles";

// Pantalla final de 2 flujos distintos (invitación nueva y "olvidé mi
// contraseña") - ambos llegan aquí ya con sesión (creada por
// /auth/callback al cambiar el "code" del correo) y lo único que
// falta es que el usuario escriba su contraseña.
export default function ActualizarContrasenaPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setChecking(false);
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError("No se pudo guardar: " + updateError.message);
      return;
    }

    router.push("/app/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-6">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <p className="text-2xl font-semibold tracking-tight">
            SI<span className="text-[var(--brand-red)]">FENIX</span>
          </p>
          <p className="mt-1 text-sm text-neutral-500">Define tu contraseña</p>
        </div>

        {checking ? null : !hasSession ? (
          <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-neutral-600">
              Este link ya no es válido o ya se usó. Solicita uno nuevo desde
              la pantalla de acceso.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block text-sm font-medium text-[var(--brand-red)] hover:opacity-80"
            >
              Ir a Acceso →
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-4 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <div>
              <label className={labelClass}>Nueva contraseña</label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Confirmar contraseña</label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputClass}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[var(--brand-red)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Guardando…" : "Guardar contraseña"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
