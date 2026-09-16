import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/logo-full.png"
        alt="SIFENIX — Servicios Industriales, soluciones que impulsan tu industria"
        className="h-56 w-auto sm:h-64"
      />
      <p className="max-w-md text-neutral-600">
        Distribuidor autorizado de TURCK y Cognex. Fabricación OEM y
        suministros industriales, con cotización directa.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/contacto"
          className="rounded-md bg-[var(--brand-red)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
        >
          Solicitar cotización
        </Link>
        <Link
          href="/marcas"
          className="rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:border-[var(--brand-red)] hover:text-[var(--brand-red)]"
        >
          Ver catálogo
        </Link>
      </div>
    </main>
  );
}
