// Muestra el historial de cambios de estatus de un documento,
// leyendo "audit_log" (poblado por el trigger log_status_change() de
// la migracion 0012 - antes se guardaba y nadie lo podia consultar).
// `statusMap` es uno de los *_STATUS de statusColors.js, para mostrar
// la etiqueta en español en vez del valor crudo de la columna.
export default function HistorialEstatusTile({ entries, statusMap = {} }) {
  function label(status) {
    return statusMap[status]?.label || status || "—";
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-neutral-500">
        Historial de estatus
      </h2>
      {!entries?.length ? (
        <p className="mt-2 text-sm text-neutral-500">
          Sin cambios de estatus registrados todavía.
        </p>
      ) : (
        <div className="mt-2 divide-y divide-neutral-100">
          {entries.map((entry) => (
            <div key={entry.id} className="py-3 text-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-neutral-900">
                  {label(entry.old_data?.status)} → {label(entry.new_data?.status)}
                </span>
                <span className="shrink-0 text-xs text-neutral-400">
                  {new Date(entry.changed_at).toLocaleDateString("es-MX")}
                </span>
              </div>
              <p className="mt-0.5 text-neutral-500">
                {entry.profiles?.full_name || "Usuario desconocido"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
