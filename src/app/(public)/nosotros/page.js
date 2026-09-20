import Link from "next/link";
import { VALORES } from "@/data/valores";

export const metadata = {
  title: "Nosotros | Servicios Industriales Fenix",
};

export default function NosotrosPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Nosotros
      </h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        Servicios Industriales Fenix S.A. de C.V. es distribuidor autorizado
        de TURCK y Cognex, con fabricación OEM a la medida y suministros
        industriales.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Misión</h2>
          <p className="mt-2 text-neutral-600">
            Brindar soluciones integrales de manufactura y suministro para
            la industria, combinando la distribución de marcas líderes en
            automatización con fabricación OEM a la medida y suministros
            industriales confiables, para que la operación de nuestros
            clientes nunca se detenga.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Visión</h2>
          <p className="mt-2 text-neutral-600">
            Ser el proveedor de referencia para la industria en México,
            construyendo relaciones de largo plazo basadas en calidad,
            cumplimiento y soporte técnico, que nos permitan crecer junto
            con nuestros clientes.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">
          Qué hacemos
        </h2>
        <ul className="mt-4 flex flex-col gap-2 text-neutral-600">
          <li>
            • Distribución autorizada de TURCK y Cognex —{" "}
            <Link
              href="/marcas"
              className="text-[var(--brand-red)] underline underline-offset-2"
            >
              ver catálogo
            </Link>
          </li>
          <li>
            • Fabricación OEM de cables a la medida —{" "}
            <Link
              href="/oem"
              className="text-[var(--brand-red)] underline underline-offset-2"
            >
              ver detalles
            </Link>
          </li>
          <li>
            • Suministros industriales: consumibles, refacciones e insumos
            en general, con inventario de seguridad para piezas de alto
            consumo
          </li>
        </ul>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">
          Nuestros valores
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {VALORES.map((valor) => (
            <span
              key={valor}
              className="rounded-full border border-[var(--brand-red)] px-3 py-1 text-sm font-medium text-[var(--brand-red)]"
            >
              {valor}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
