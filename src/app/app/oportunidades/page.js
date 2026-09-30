import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EmptyState from "@/components/app/EmptyState";
import Badge from "@/components/app/Badge";
import { OPPORTUNITY_STATUS } from "@/components/app/statusColors";
import { computeNextAction } from "./nextAction";

export default async function OportunidadesPage() {
  const supabase = await createClient();
  const { data: opportunities } = await supabase
    .from("opportunities")
    .select(
      `id, opportunity_number, name, status, estimated_value, currency, customers(company_name),
       quotations(id, status, created_at),
       rfqs(id, status),
       customer_orders(id, status),
       supplier_orders(id, status)`
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Oportunidades"
        action={
          <Link
            href="/app/oportunidades/nueva"
            className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Nueva oportunidad
          </Link>
        }
      />
      <p className="mb-4 max-w-2xl text-sm text-neutral-500">
        "Siguiente paso" se calcula solo, revisando hasta dónde llegó cada
        operación — no hace falta entrar a cada una para saber qué sigue.
      </p>

      {!opportunities?.length ? (
        <EmptyState
          title="Todavía no hay oportunidades registradas"
          description="Crea la primera con el botón 'Nueva oportunidad'. Necesitas al menos un cliente dado de alta."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Operación</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Estatus</th>
                <th className="px-4 py-3 font-medium">Siguiente paso</th>
                <th className="px-4 py-3 font-medium">Valor estimado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {opportunities.map((opportunity) => {
                const status =
                  OPPORTUNITY_STATUS[opportunity.status] ||
                  OPPORTUNITY_STATUS.open;
                const next = computeNextAction(opportunity);
                const pendingDecision =
                  opportunity.status === "open" || opportunity.status === "quoting";
                return (
                  <tr
                    key={opportunity.id}
                    className={
                      next?.tone === "red"
                        ? "border-l-2 border-red-400 bg-red-50/50 hover:bg-red-50"
                        : pendingDecision
                        ? "border-l-2 border-amber-400 bg-amber-50/60 hover:bg-amber-50"
                        : "hover:bg-neutral-50"
                    }
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/app/oportunidades/${opportunity.id}`}
                        className="font-medium text-neutral-900 hover:text-[var(--brand-red)]"
                      >
                        {opportunity.opportunity_number}
                      </Link>
                      <p className="text-xs text-neutral-500">
                        {opportunity.name}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {opportunity.customers?.company_name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={status.color}>{status.label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {!next ? (
                        <span className="text-neutral-400">—</span>
                      ) : (
                        <div>
                          <Badge color={next.tone}>{next.label}</Badge>
                          {next.href ? (
                            <Link
                              href={next.href}
                              className="mt-1 block text-xs font-medium text-[var(--brand-red)] hover:opacity-80"
                            >
                              {next.action} →
                            </Link>
                          ) : (
                            <p className="mt-1 text-xs text-neutral-500">
                              {next.action}
                            </p>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {opportunity.estimated_value != null
                        ? `${opportunity.estimated_value} ${opportunity.currency}`
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
