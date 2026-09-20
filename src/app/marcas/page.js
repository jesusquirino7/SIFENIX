import Link from "next/link";
import { marcas } from "@/data/marcas";

export const metadata = {
  title: "Marcas | Distribuidor Autorizado",
};

export default function MarcasPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Marcas que representamos
      </h1>
      <p className="mt-3 max-w-2xl text-base text-neutral-600 sm:text-lg">
        Distribuidor autorizado de las siguientes marcas de automatización
        industrial.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {marcas.map((marca) => (
          <Link
            key={marca.slug}
            href={`/marcas/${marca.slug}`}
            className="rounded-lg border border-neutral-200 p-7 transition hover:border-neutral-400"
          >
            {marca.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={marca.logo}
                alt={marca.nombre}
                className="h-10 w-auto object-contain"
              />
            )}
            <h2 className="mt-4 text-xl font-semibold tracking-tight">
              {marca.nombre}
            </h2>
            <p className="mt-1 text-base text-neutral-600">{marca.resumen}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {marca.categorias.map((categoria) => (
                <li
                  key={categoria.id}
                  className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm text-neutral-600"
                >
                  {categoria.nombre}
                </li>
              ))}
            </ul>
          </Link>
        ))}
      </div>
    </main>
  );
}
