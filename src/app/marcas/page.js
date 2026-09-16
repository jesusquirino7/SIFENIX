import Link from "next/link";
import { marcas } from "@/data/marcas";

export const metadata = {
  title: "Marcas | Distribuidor Autorizado",
};

export default function MarcasPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Marcas que representamos
      </h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        Distribuidor autorizado de las siguientes marcas de automatización
        industrial.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {marcas.map((marca) => (
          <Link
            key={marca.slug}
            href={`/marcas/${marca.slug}`}
            className="rounded-lg border border-neutral-200 p-6 transition hover:border-neutral-400"
          >
            <h2 className="text-lg font-semibold tracking-tight">
              {marca.nombre}
            </h2>
            <p className="mt-1 text-sm text-neutral-600">{marca.resumen}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {marca.categorias.map((categoria) => (
                <li
                  key={categoria.id}
                  className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600"
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
