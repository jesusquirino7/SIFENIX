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

const DATOS_PLANTA_TURCK = [
  { valor: "+900", etiqueta: "empleados" },
  { valor: "+175,000 ft²", etiqueta: "de planta" },
  { valor: "10 días", etiqueta: "de entrega típica" },
  { valor: "96%", etiqueta: "de la producción se exporta" },
];

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

      <div className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">
          Manufactura TURCK cerca de nosotros
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Como distribuidores autorizados de TURCK, vale la pena mencionar
          que buena parte de los productos de conectividad de la marca que
          representamos — cordsets, receptáculos y módulos de E/S — se
          fabrican en Norteamérica, en la planta que TURCK opera en Arteaga,
          dentro de la zona metropolitana de Saltillo, Coahuila (conocida
          internamente como &ldquo;Mirus&rdquo;). El proceso típico ahí es
          diseño y prototipo en EE. UU., seguido de validación, manufactura y
          control de calidad en esa planta antes del embarque.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DATOS_PLANTA_TURCK.map((dato) => (
            <div
              key={dato.etiqueta}
              className="rounded-lg border border-neutral-200 px-4 py-3 text-center"
            >
              <p className="text-lg font-semibold tracking-tight">
                {dato.valor}
              </p>
              <p className="text-xs text-neutral-500">{dato.etiqueta}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-neutral-400">
          Esta planta es de TURCK, no nuestra — la mencionamos como
          referencia de la manufactura que respalda a la marca que
          distribuimos, no como parte de nuestra fabricación OEM propia
          descrita arriba.
        </p>
      </div>

      <div className="mt-10 rounded-lg border border-neutral-200 p-5">
        <p className="text-neutral-600">
          ¿Necesitas un cable o arnés con especificaciones particulares?
          Cuéntanos qué necesitas y te cotizamos.
        </p>
        <Link
          href="/contacto"
          className="mt-3 inline-block rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
        >
          Solicitar cotización →
        </Link>
      </div>
    </main>
  );
}
