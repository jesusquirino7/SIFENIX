import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EmptyState from "@/components/app/EmptyState";
import Badge from "@/components/app/Badge";
import { RFQ_STATUS } from "@/components/app/statusColors";

function matchKey(item) {
  return (item.part_number || item.description || "").trim().toLowerCase();
}

function formatMoney(value, currency) {
  if (value == null) return "—";
  return value.toLocaleString("es-MX", { style: "currency", currency });
}

export default async function ComparativoPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: opportunity }, { data: opportunityItems }, { data: rfqs }] =
    await Promise.all([
      supabase
        .from("opportunities")
        .select("id, opportunity_number, name, currency, customers(company_name)")
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("opportunity_items")
        .select("*")
        .eq("opportunity_id", id)
        .order("created_at", { ascending: true }),
      supabase
        .from("rfqs")
        .select("id, rfq_number, status, suppliers(id, company_name), rfq_items(*)")
        .eq("opportunity_id", id)
        .order("created_at", { ascending: true }),
    ]);

  if (!opportunity) {
    notFound();
  }

  const currency = opportunity.currency || "MXN";

  // Arma la union de renglones (part number / descripcion) a comparar:
  // primero los productos originales de la oportunidad, y cualquier
  // renglon extra que algun proveedor haya agregado en su RFQ.
  const rowsByKey = new Map();
  for (const item of opportunityItems || []) {
    const key = matchKey(item);
    if (key) rowsByKey.set(key, { partNumber: item.part_number, description: item.description });
  }
  for (const rfq of rfqs || []) {
    for (const item of rfq.rfq_items || []) {
      const key = matchKey(item);
      if (key && !rowsByKey.has(key)) {
        rowsByKey.set(key, { partNumber: item.part_number, description: item.description });
      }
    }
  }

  const rows = Array.from(rowsByKey.entries()).map(([key, label]) => {
    const bySupplier = (rfqs || []).map((rfq) => {
      const match = (rfq.rfq_items || []).find((item) => matchKey(item) === key);
      const subtotal =
        match?.supplier_unit_cost != null
          ? (match.quantity || 0) * match.supplier_unit_cost
          : null;
      return { rfqId: rfq.id, item: match, subtotal };
    });

    const bestSubtotal = bySupplier.reduce((min, s) => {
      if (s.subtotal == null) return min;
      return min == null || s.subtotal < min ? s.subtotal : min;
    }, null);

    return { key, label, bySupplier, bestSubtotal };
  });

  const totalsBySupplier = (rfqs || []).map((rfq) =>
    rows.reduce((sum, row) => {
      const s = row.bySupplier.find((s) => s.rfqId === rfq.id);
      return sum + (s?.subtotal || 0);
    }, 0)
  );
  const bestTotal = totalsBySupplier.length ? Math.min(...totalsBySupplier) : null;

  return (
    <div>
      <PageHeader
        title="Comparativo de proveedores"
        breadcrumbs={[
          { label: "Oportunidades", href: "/app/oportunidades" },
          {
            label: opportunity.opportunity_number,
            href: `/app/oportunidades/${opportunity.id}`,
          },
          { label: "Comparativo" },
        ]}
      />

      {!rfqs?.length ? (
        <EmptyState
          title="Todavía no hay RFQ que comparar"
          description="Crea al menos una RFQ a un proveedor desde el detalle de la operación."
          action={
            <Link
              href={`/app/oportunidades/${opportunity.id}`}
              className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Ver operación
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Producto</th>
                {rfqs.map((rfq) => {
                  const status = RFQ_STATUS[rfq.status] || RFQ_STATUS.draft;
                  return (
                    <th key={rfq.id} className="px-4 py-3 font-medium">
                      <Link
                        href={`/app/rfq-proveedores/${rfq.id}`}
                        className="block normal-case text-neutral-900 hover:text-[var(--brand-red)]"
                      >
                        {rfq.suppliers?.company_name}
                      </Link>
                      <span className="mt-1 inline-block">
                        <Badge color={status.color}>{status.label}</Badge>
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((row) => (
                <tr key={row.key}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutral-900">
                      {row.label.partNumber || "—"}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {row.label.description}
                    </p>
                  </td>
                  {row.bySupplier.map(({ rfqId, item, subtotal }) => (
                    <td key={rfqId} className="px-4 py-3">
                      {!item ? (
                        <span className="text-neutral-400">No cotizado</span>
                      ) : item.supplier_unit_cost == null ? (
                        <span className="text-neutral-400">Sin precio aún</span>
                      ) : (
                        <div
                          className={
                            row.bestSubtotal != null && subtotal === row.bestSubtotal
                              ? "rounded-md bg-emerald-50 px-2 py-1"
                              : ""
                          }
                        >
                          <p className="font-medium text-neutral-900">
                            {formatMoney(subtotal, currency)}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {item.quantity} × {formatMoney(item.supplier_unit_cost, currency)}
                            {item.supplier_lead_time_days != null &&
                              ` · ${item.supplier_lead_time_days} días`}
                          </p>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-neutral-200 bg-neutral-50">
                <td className="px-4 py-3 font-semibold text-neutral-500">Total</td>
                {rfqs.map((rfq, i) => (
                  <td key={rfq.id} className="px-4 py-3">
                    <span
                      className={
                        bestTotal != null && totalsBySupplier[i] === bestTotal && bestTotal > 0
                          ? "rounded-md bg-emerald-100 px-2 py-1 font-semibold text-emerald-800"
                          : "font-semibold text-neutral-900"
                      }
                    >
                      {formatMoney(totalsBySupplier[i], currency)}
                    </span>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
