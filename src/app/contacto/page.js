export const metadata = {
  title: "Contacto | Servicios Industriales Fenix",
};

const CONTACTO = [
  { label: "Teléfono", valor: "899-332-3720" },
  { label: "Correo", valor: "ventas@sireyes.com" },
  { label: "WhatsApp", valor: "899-873-4596 — Juan Carlos González" },
];

export default function ContactoPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Contacto y cotización
      </h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        Escríbenos para una cotización o para más información de nuestro
        catálogo.
      </p>

      <div className="mt-8 flex flex-col gap-2 rounded-lg border border-neutral-200 p-5 sm:max-w-sm">
        {CONTACTO.map((c) => (
          <div key={c.label} className="text-sm">
            <span className="text-neutral-500">{c.label}: </span>
            <span className="font-medium">{c.valor}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        El formulario de cotización en línea se conecta en la Fase 04. Por
        ahora, usa los datos de contacto de arriba.
      </div>
    </main>
  );
}
