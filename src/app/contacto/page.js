import ContactoForm from "@/components/ContactoForm";

export const metadata = {
  title: "Contacto | Servicios Industriales Fenix",
};

const CONTACTOS_DIRECTOS = [
  {
    nombre: "Victor Tellez",
    correo: "victortellez@sifenix.com",
    telefono: "899-346-589",
  },
  {
    nombre: "Jose de Leon",
    correo: "compras1@sifenix.com",
    telefono: "899-332-3720",
  },
];

export default function ContactoPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Contacto y cotización
      </h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        Déjanos tus datos y lo que necesitas — te contactamos con tu
        cotización o la información que busques.
      </p>

      <ContactoForm />

      <div className="mt-10 border-t border-neutral-200 pt-6">
        <p className="text-sm text-neutral-500">
          ¿Prefieres contactarnos directo?
        </p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:gap-8">
          {CONTACTOS_DIRECTOS.map((contacto) => (
            <div key={contacto.nombre} className="text-sm text-neutral-600">
              <p className="font-medium text-neutral-800">
                {contacto.nombre}
              </p>
              <p>{contacto.correo}</p>
              <p>{contacto.telefono}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
