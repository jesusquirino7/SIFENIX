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
        className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
      />
    );
  }
  return (
    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400">
      <CategoryIcon id={categoriaId} className="h-8 w-8" />
    </div>
  );
}

export default function CatalogoMarca({ marca }) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      {marca.logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={marca.logo}
          alt={marca.nombre}
          className="h-16 w-auto object-contain"
        />
      )}
      <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
        {marca.nombre}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-neutral-600 sm:text-xl">
        {marca.resumen}
      </p>
      {CONTENIDO_ES_EJEMPLO && <PlaceholderBanner />}

      <div className="mt-8 flex flex-wrap gap-3">
        {marca.categorias.map((categoria) => (
          <a
            key={categoria.id}
            href={`#${categoria.id}`}
            className="rounded-full bg-neutral-100 px-5 py-2 text-base font-medium text-neutral-600 hover:bg-[var(--brand-red)] hover:text-white"
          >
            {categoria.nombre} · {categoria.productos.length}
          </a>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-14">
        {marca.categorias.map((categoria) => (
          <section key={categoria.id} id={categoria.id} className="scroll-mt-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {categoria.imagen ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={categoria.imagen}
                    alt={categoria.nombre}
                    className="h-20 w-20 flex-shrink-0 rounded-lg border border-neutral-200 object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400">
                    <CategoryIcon id={categoria.id} className="h-9 w-9" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {categoria.nombre}
                  </h2>
                  <p className="mt-1 text-base text-neutral-600">
                    {categoria.descripcion}
                  </p>
                </div>
              </div>
              <span className="flex-shrink-0 text-base text-neutral-400">
                {categoria.productos.length} productos
              </span>
            </div>

            <div className="mt-4 divide-y divide-neutral-200 rounded-lg border border-neutral-200">
              {categoria.productos.map((producto) => {
                const enlace = producto.enlaceOficial || categoria.enlaceOficial;
                return (
                  <div
                    key={producto.nombre}
                    className="flex items-center gap-5 px-6 py-5"
                  >
                    <ProductThumb producto={producto} categoriaId={categoria.id} />
                    <div className="min-w-0 flex-1">
                      {enlace ? (
                        <a
                          href={enlace}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-1.5 text-lg font-semibold hover:text-[var(--brand-red)] hover:underline hover:decoration-[var(--brand-red)] hover:underline-offset-2"
                        >
                          {producto.nombre}
                          <span className="text-[var(--brand-red)] opacity-0 transition-opacity group-hover:opacity-100">
                            ↗
                          </span>
                        </a>
                      ) : (
                        <p className="text-lg font-semibold">{producto.nombre}</p>
                      )}
                      <p className="mt-1 truncate text-base text-neutral-500">
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
