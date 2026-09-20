import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EmptyState from "@/components/app/EmptyState";
import Badge from "@/components/app/Badge";
import { QUOTATION_STATUS } from "@/components/app/statusColors";

function computeTotal(items) {
  return (items || []).reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unit_price || 0),
    0
  );
}

export default async function CotizacionesPage() {
  const supabase = await createClient();
  const { data: quotations } = await supabase
    .from("quotations")
    .select(
      "id, quotation_number, status, currency, opportunities(id, opportunity_number, name, customers(company_name)), quotation_items(quantity, unit_price)"
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Cotizaciones" />

      {!quotations?.length ? (
        <EmptyState
          title="Todavía no hay cotizaciones"
          description="Una cotización siempre nace desde una oportunidad: entra al detalle de la operación y da clic en 'Nueva cotización'."
          action={
            <Link
              href="/app/oportunidades"
              className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Ir a Oportunidades
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Cotización</th>
                <th className="px-4 py-3 font-medium">Operación</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {quotations.map((quotation) => {
                const status =
                  QUOTATION_STATUS[quotation.status] || QUOTATION_STATUS.draft;
                return (
                  <tr key={quotation.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/app/cotizaciones/${quotation.id}`}
                        className="font-medium text-neutral-900 hover:text-[var(--brand-red)]"
                      >
                        {quotation.quotation_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {quotation.opportunities ? (
                        <Link
                          href={`/app/oportunidades/${quotation.opportunities.id}`}
                          className="hover:text-[var(--brand-red)]"
                        >
                          {quotation.opportunities.opportunity_number}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {quotation.opportunities?.customers?.company_name || "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {computeTotal(quotation.quotation_items).toLocaleString(
                        "es-MX",
                        { style: "currency", currency: quotation.currency }
                      )}
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
