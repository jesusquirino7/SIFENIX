import ContactoForm from "@/components/ContactoForm";

export const metadata = {
  title: "Contacto | Servicios Industriales Fenix",
};

const CORREO_CONTACTO = "compras1@sifenix.com";

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
          ¿Prefieres contactarnos directo? Escríbenos a{" "}
          <a
            href={`mailto:${CORREO_CONTACTO}`}
            className="font-medium text-[var(--brand-red)] underline underline-offset-2"
          >
            {CORREO_CONTACTO}
          </a>
        </p>
      </div>
    </main>
  );
}
