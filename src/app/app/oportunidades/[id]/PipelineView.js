import Link from "next/link";

const STATE_STYLES = {
  completado: { dot: "bg-emerald-500", text: "text-neutral-900", badge: "Completado", badgeColor: "text-emerald-700 bg-emerald-50" },
  actual: { dot: "bg-blue-500", text: "text-neutral-900", badge: "En curso", badgeColor: "text-blue-700 bg-blue-50" },
  pendiente: { dot: "bg-neutral-300", text: "text-neutral-500", badge: "Pendiente", badgeColor: "text-neutral-500 bg-neutral-100" },
  bloqueado: { dot: "bg-amber-400", text: "text-neutral-500", badge: "Bloqueado", badgeColor: "text-amber-700 bg-amber-50" },
  cancelado: { dot: "bg-red-500", text: "text-neutral-500", badge: "Cancelado", badgeColor: "text-[var(--brand-red)] bg-red-50" },
};

// Pipeline visual de la Oportunidad - reemplaza el panel derecho que
// antes solo tenía la tarjeta de Cliente. Cada etapa se deriva de los
// documentos reales (ver pipelineStages.js), no es un checklist manual.
export default function PipelineView({ stages }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-neutral-500">Pipeline</h2>
      <ol className="mt-4 space-y-5">
        {stages.map((stage, i) => {
          const style = STATE_STYLES[stage.state] || STATE_STYLES.pendiente;
          const isLast = i === stages.length - 1;
          const content = (
            <>
              <div className="flex items-center justify-between gap-2">
                <p className={`text-sm font-medium ${style.text}`}>{stage.label}</p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${style.badgeColor}`}
                >
                  {style.badge}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-neutral-500">{stage.summary}</p>
            </>
          );

          return (
            <li key={stage.key} className="relative flex gap-3">
              <div className="flex flex-col items-center">
                <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />
                {!isLast && <span className="mt-1 w-px flex-1 bg-neutral-200" />}
              </div>
              <div className="min-w-0 flex-1 pb-1">
                {stage.href ? (
                  <Link href={stage.href} className="block hover:opacity-80">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
