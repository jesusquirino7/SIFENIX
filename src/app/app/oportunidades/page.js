import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EmptyState from "@/components/app/EmptyState";
import Badge from "@/components/app/Badge";
import { OPPORTUNITY_STATUS } from "@/components/app/statusColors";

export default async function OportunidadesPage() {
  const supabase = await createClient();
  const { data: opportunities } = await supabase
    .from("opportunities")
    .select(
      "id, opportunity_number, name, status, estimated_value, currency, customers(company_name)"
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
                <th className="px-4 py-3 font-medium">Valor estimado</th>
                <th className="px-4 py-3 font-medium">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {opportunities.map((opportunity) => {
                const status =
                  OPPORTUNITY_STATUS[opportunity.status] ||
                  OPPORTUNITY_STATUS.open;
                return (
                  <tr key={opportunity.id} className="hover:bg-neutral-50">
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
                    <td className="px-4 py-3 text-neutral-600">
                      {opportunity.estimated_value != null
                        ? `${opportunity.estimated_value} ${opportunity.currency}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge color={status.color}>{status.label}</Badge>
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
