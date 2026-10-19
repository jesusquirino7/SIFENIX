function formatPrice(value, currency) {
  if (value == null) return "—";
  return Number(value).toLocaleString("es-MX", {
    style: "currency",
    currency: currency || "MXN",
  });
}

export default function HistorialPreciosTile({ history, currency }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-neutral-500">
        Historial de precios
      </h2>
      {!history?.length ? (
        <p className="mt-2 text-sm text-neutral-500">
          Todavía no hay cambios de precio registrados para este producto.
        </p>
      ) : (
        <div className="mt-2 divide-y divide-neutral-100">
          {history.map((entry) => (
            <div key={entry.id} className="py-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-neutral-900">
                  {formatPrice(entry.previous_price, currency)} →{" "}
                  {formatPrice(entry.new_price, currency)}
                </span>
                <span className="shrink-0 text-xs text-neutral-400">
                  {new Date(entry.changed_at).toLocaleDateString("es-MX")}
                </span>
              </div>
              <p className="mt-1 text-neutral-500">
                {entry.profiles?.full_name || "Usuario desconocido"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
