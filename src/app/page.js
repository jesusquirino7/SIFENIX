export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium tracking-wide text-neutral-500 uppercase">
        Fase 01 · Entorno de desarrollo
      </span>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        El proyecto está corriendo 🎉
      </h1>
      <p className="max-w-md text-neutral-600">
        Este es el punto de partida del sitio del distribuidor. Las páginas
        reales (Inicio, Marcas, Nosotros, Contacto) se construyen en las
        siguientes fases del plan.
      </p>
    </main>
  );
}
