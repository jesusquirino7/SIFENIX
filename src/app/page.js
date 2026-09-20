import Link from "next/link";
import { marcas } from "@/data/marcas";
import { VALORES } from "@/data/valores";
import { clientes } from "@/data/clientes";
import Reveal from "@/components/Reveal";

const QUE_HACEMOS = [
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
      <div className="animate-fade-in-up mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-[var(--brand-red)]">
          Soluciones que impulsan tu industria
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Soluciones industriales integrales
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-neutral-600 sm:text-lg">
          Distribución de marcas líderes en automatización, fabricación OEM
          de cables y arneses a la medida, y suministros industriales — todo
          en un solo proveedor, con cotización directa.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contacto"
            className="rounded-md bg-[var(--brand-red)] px-6 py-3 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg"
          >
            Solicitar cotización
          </Link>
          <Link
            href="/marcas"
            className="rounded-md border border-neutral-300 px-6 py-3 text-base font-semibold text-neutral-700 transition-all hover:-translate-y-0.5 hover:border-[var(--brand-red)] hover:text-[var(--brand-red)]"
          >
            Ver catálogo
          </Link>
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Misión y visión
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold tracking-tight">
                Misión
              </h3>
              <p className="mt-2 text-base text-neutral-600">
                Brindar soluciones integrales de manufactura y suministro para
                la industria, combinando la distribución de marcas líderes en
                automatización con fabricación OEM a la medida y suministros
                industriales confiables, para que la operación de nuestros
                clientes nunca se detenga.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight">
                Visión
              </h3>
              <p className="mt-2 text-base text-neutral-600">
                Ser el proveedor de referencia para la industria en México,
                construyendo relaciones de largo plazo basadas en calidad,
                cumplimiento y soporte técnico, que nos permitan crecer junto
                con nuestros clientes.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Qué hacemos
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {QUE_HACEMOS.map((item) => (
              <div
                key={item.titulo}
                className="flex flex-col rounded-lg border border-neutral-200 p-7 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold tracking-tight">
                  {item.titulo}
                </h3>
                <p className="mt-2 flex-1 text-base text-neutral-600">
                  {item.descripcion}
                </p>
                {item.href && (
                  <Link
                    href={item.href}
                    className="mt-4 text-base font-medium text-[var(--brand-red)]"
                  >
                    {item.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Marcas que representamos
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {marcas.map((marca) => (
              <Link
                key={marca.slug}
                href={`/marcas/${marca.slug}`}
                className="group rounded-lg border border-neutral-200 p-7 transition-all hover:-translate-y-1 hover:border-[var(--brand-red)] hover:shadow-md"
              >
                {marca.logo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={marca.logo}
                    alt={marca.nombre}
                    className="h-10 w-auto object-contain"
                  />
                )}
                <h3 className="mt-4 text-xl font-semibold tracking-tight">
                  {marca.nombre}
                </h3>
                <p className="mt-2 text-base text-neutral-600">{marca.resumen}</p>
                <span className="mt-4 inline-block text-base font-medium text-[var(--brand-red)]">
                  Ver catálogo{" "}
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Nuestros valores
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {VALORES.map((valor) => (
              <span
                key={valor}
                className="rounded-full border border-[var(--brand-red)] px-4 py-1.5 text-base font-medium text-[var(--brand-red)] transition-all hover:-translate-y-0.5 hover:bg-[var(--brand-red)] hover:text-white"
              >
                {valor}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Nuestros clientes
          </h2>
          <p className="mt-2 max-w-2xl text-base text-neutral-600">
            Empresas que confían en nosotros para su cadena de suministro.
          </p>
          <div className="mt-8 marquee-wrapper">
            <div className="marquee-track gap-5">
              {[...clientes, ...clientes].map((cliente, i) => (
                <div
                  key={`${cliente.nombre}-${i}`}
                  className="flex h-24 w-48 shrink-0 items-center justify-center rounded-lg border border-neutral-200 p-5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cliente.logo}
                    alt={cliente.nombre}
                    title={cliente.nombre}
                    className={
                      cliente.fondoOscuro
                        ? "h-full w-full rounded-md bg-[var(--brand-black)] object-contain p-2"
                        : "h-full w-full object-contain"
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="bg-[var(--brand-black)] px-6 py-16 text-center text-white">
        <Reveal>
          <p className="text-base font-medium uppercase tracking-wide text-[var(--brand-orange)]">
            Soluciones que impulsan tu industria
          </p>
          <h2 className="mx-auto mt-4 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            ¿Listo para cotizar tu próximo proyecto?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base text-neutral-300">
            Tel. 899-332-3720 · WhatsApp 899-873-4596
          </p>
          <Link
            href="/contacto"
            className="mt-7 inline-block rounded-md bg-[var(--brand-red)] px-7 py-3.5 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:opacity-90 hover:shadow-lg"
          >
            Contáctanos
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
