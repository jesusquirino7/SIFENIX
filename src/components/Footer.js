export default function Footer() {
  return (
    <footer className="border-t-2 border-[var(--brand-red)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-6 py-6 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} SIFENIX — Servicios Industriales
          Fenix S.A. de C.V. Todos los derechos reservados.
        </span>
        <span className="text-xs text-neutral-400">
          Soluciones que impulsan tu industria
        </span>
      </div>
    </footer>
  );
}
