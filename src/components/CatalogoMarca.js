import CategoryIcon from "@/components/CategoryIcon";
import PlaceholderBanner from "@/components/PlaceholderBanner";
import { CONTENIDO_ES_EJEMPLO } from "@/data/marcas";

function ProductThumb({ producto, categoriaId }) {
  if (producto.imagen) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="h-8 w-8 flex-shrink-0 rounded object-cover"
      />
    );
  }
  return (
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-neutral-100 text-neutral-400">
      <CategoryIcon id={categoriaId} className="h-4 w-4" />
    </div>
  );
}

export default function CatalogoMarca({ marca }) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {marca.nombre}
      </h1>
      <p className="mt-2 max-w-2xl text-neutral-600">{marca.resumen}</p>
      {CONTENIDO_ES_EJEMPLO && <PlaceholderBanner />}

      <div className="mt-6 flex flex-wrap gap-2">
        {marca.categorias.map((categoria) => (
          <a
            key={categoria.id}
            href={`#${categoria.id}`}
            className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-200"
          >
            {categoria.nombre} · {categoria.productos.length}
          </a>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-8">
        {marca.categorias.map((categoria) => (
          <section key={categoria.id} id={categoria.id} className="scroll-mt-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-base font-semibold tracking-tight">
                {categoria.nombre}
              </h2>
              <span className="text-xs text-neutral-400">
                {categoria.productos.length} productos
              </span>
            </div>
            <p className="mt-0.5 text-sm text-neutral-500">
              {categoria.descripcion}
            </p>

            <div className="mt-3 divide-y divide-neutral-200 rounded-lg border border-neutral-200">
              {categoria.productos.map((producto) => {
                const enlace = producto.enlaceOficial || categoria.enlaceOficial;
                return (
                  <div
                    key={producto.nombre}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    <ProductThumb producto={producto} categoriaId={categoria.id} />
                    <div className="min-w-0 flex-1">
                      {enlace ? (
                        <a
                          href={enlace}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-1 text-sm font-medium hover:underline hover:decoration-neutral-400 hover:underline-offset-2"
                        >
                          {producto.nombre}
                          <span className="text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100">
                            ↗
                          </span>
                        </a>
                      ) : (
                        <p className="text-sm font-medium">{producto.nombre}</p>
                      )}
                      <p className="truncate text-xs text-neutral-500">
                        {producto.descripcion}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
