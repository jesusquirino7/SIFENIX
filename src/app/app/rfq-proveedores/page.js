import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EmptyState from "@/components/app/EmptyState";
import Badge from "@/components/app/Badge";
import { RFQ_STATUS } from "@/components/app/statusColors";

export default async function RfqProveedoresPage() {
  const supabase = await createClient();
  const { data: rfqs } = await supabase
    .from("rfqs")
    .select(
      "id, rfq_number, status, suppliers(company_name), opportunities(id, opportunity_number, customers(company_name))"
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="RFQ Proveedores" />

      {!rfqs?.length ? (
        <EmptyState
          title="Todavía no hay RFQ enviadas"
          description="Una RFQ siempre nace desde una oportunidad: entra al detalle de la operación y da clic en 'Nueva RFQ'."
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
                <th className="px-4 py-3 font-medium">RFQ</th>
                <th className="px-4 py-3 font-medium">Proveedor</th>
                <th className="px-4 py-3 font-medium">Operación / Cliente</th>
                <th className="px-4 py-3 font-medium">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rfqs.map((rfq) => {
                const status = RFQ_STATUS[rfq.status] || RFQ_STATUS.draft;
                return (
                  <tr key={rfq.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/app/rfq-proveedores/${rfq.id}`}
                        className="font-medium text-neutral-900 hover:text-[var(--brand-red)]"
                      >
                        {rfq.rfq_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {rfq.suppliers?.company_name || "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {rfq.opportunities ? (
                        <Link
                          href={`/app/oportunidades/${rfq.opportunities.id}`}
                          className="hover:text-[var(--brand-red)]"
                        >
                          {rfq.opportunities.opportunity_number}
                        </Link>
                      ) : (
                        "—"
                      )}{" "}
                      <span className="text-neutral-400">
                        {rfq.opportunities?.customers?.company_name}
                      </span>
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
