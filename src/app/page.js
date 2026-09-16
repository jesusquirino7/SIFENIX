import Link from "next/link";
import { marcas } from "@/data/marcas";
import { VALORES } from "@/data/valores";

const QUE_HACEMOS = [
  {
    titulo: "Distribución de marcas",
    descripcion:
      "Distribuidor autorizado de TURCK y Cognex, con catálogo por categoría.",
    href: "/marcas",
    cta: "Ver catálogo →",
  },
  {
    titulo: "Fabricación OEM",
    descripcion:
      "Cables y arneses a la medida para sensores, termopares, gabinetes, motores y más.",
    href: "/oem",
    cta: "Ver detalles →",
  },
  {
    titulo: "Suministros industriales",
    descripcion:
      "Consumibles, refacciones e insumos en general, con inventario de seguridad para piezas de alto consumo.",
    href: null,
    cta: null,
  },
];

export default function Home() {
  return (
    <main>
      <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
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
      </div>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Marcas que representamos
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {marcas.map((marca) => (
            <Link
              key={marca.slug}
              href={`/marcas/${marca.slug}`}
              className="group rounded-lg border border-neutral-200 p-6 transition-colors hover:border-[var(--brand-red)]"
            >
              <h3 className="text-lg font-semibold tracking-tight">
                {marca.nombre}
              </h3>
              <p className="mt-2 text-sm text-neutral-600">{marca.resumen}</p>
              <span className="mt-4 inline-block text-sm font-medium text-[var(--brand-red)]">
                Ver catálogo{" "}
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Qué hacemos
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {QUE_HACEMOS.map((item) => (
            <div
              key={item.titulo}
              className="flex flex-col rounded-lg border border-neutral-200 p-6"
            >
              <h3 className="text-base font-semibold tracking-tight">
                {item.titulo}
              </h3>
              <p className="mt-2 flex-1 text-sm text-neutral-600">
                {item.descripcion}
              </p>
              {item.href && (
                <Link
                  href={item.href}
                  className="mt-4 text-sm font-medium text-[var(--brand-red)]"
                >
                  {item.cta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 text-center">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Nuestros valores
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {VALORES.map((valor) => (
            <span
              key={valor}
              className="rounded-full border border-[var(--brand-red)] px-3 py-1 text-sm font-medium text-[var(--brand-red)]"
            >
              {valor}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-[var(--brand-black)] px-6 py-14 text-center text-white">
        <p className="text-sm font-medium uppercase tracking-wide text-[var(--brand-orange)]">
          Soluciones que impulsan tu industria
        </p>
        <h2 className="mx-auto mt-3 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl">
          ¿Listo para cotizar tu próximo proyecto?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-neutral-300">
          Tel. 899-332-3720 · WhatsApp 899-873-4596
        </p>
        <Link
          href="/contacto"
          className="mt-6 inline-block rounded-md bg-[var(--brand-red)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90"
        >
          Contáctanos
        </Link>
      </section>
    </main>
  );
}
