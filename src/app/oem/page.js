import Link from "next/link";

export const metadata = {
  title: "OEM | Servicios Industriales Fenix",
};

const QUE_FABRICAMOS = [
  "Cables para sensores",
  "Cables para termopares",
  "Cableado de gabinetes",
  "Cables para motores",
  "Arneses y conectores a la medida",
];

const SECTORES = ["Mecánico", "Automotriz", "Médico", "HVAC", "y otros"];

export default function OemPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Fabricación OEM a la medida
      </h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        Fabricamos cables y arneses a la medida según tus especificaciones
        — para sensores, termopares, gabinetes, motores y más.
      </p>

      <div className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">
          Qué fabricamos
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {QUE_FABRICAMOS.map((item) => (
            <div
              key={item}
              className="rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-700"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">
          Sectores que atendemos
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {SECTORES.map((sector) => (
            <span
              key={sector}
              className="rounded-full bg-neutral-100 px-3 py-1 text-sm text-neutral-600"
            >
              {sector}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-lg border border-neutral-200 p-5">
        <p className="text-neutral-600">
          ¿Necesitas un cable o arnés con especificaciones particulares?
          Cuéntanos qué necesitas y te cotizamos.
        </p>
        <Link
          href="/contacto"
          className="mt-3 inline-block text-sm font-medium underline underline-offset-2"
        >
          Solicitar cotización →
        </Link>
      </div>
    </main>
  );
}
