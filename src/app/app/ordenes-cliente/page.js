import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EmptyState from "@/components/app/EmptyState";
import Badge from "@/components/app/Badge";
import { CUSTOMER_ORDER_STATUS } from "@/components/app/statusColors";

function computeTotal(items) {
  return (items || []).reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unit_price || 0),
    0
  );
}

export default async function OrdenesClientePage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("customer_orders")
    .select(
      "id, order_number, customer_po_number, status, currency, opportunities(id, opportunity_number, customers(company_name)), customer_order_items(quantity, unit_price)"
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Órdenes de Cliente" />

      {!orders?.length ? (
        <EmptyState
          title="Todavía no hay órdenes de cliente"
          description="Una orden de cliente siempre nace desde una cotización aceptada: entra a la cotización y da clic en 'Nueva orden de cliente'."
          action={
            <Link
              href="/app/cotizaciones"
              className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Ir a Cotizaciones
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Orden</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Operación</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((order) => {
                const status =
                  CUSTOMER_ORDER_STATUS[order.status] || CUSTOMER_ORDER_STATUS.confirmed;
                return (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/app/ordenes-cliente/${order.id}`}
                        className="font-medium text-neutral-900 hover:text-[var(--brand-red)]"
                      >
                        {order.order_number}
                      </Link>
                      {order.customer_po_number && (
                        <p className="text-xs text-neutral-500">
                          PO: {order.customer_po_number}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {order.opportunities?.customers?.company_name || "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {order.opportunities ? (
                        <Link
                          href={`/app/oportunidades/${order.opportunities.id}`}
                          className="hover:text-[var(--brand-red)]"
                        >
                          {order.opportunities.opportunity_number}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {computeTotal(order.customer_order_items).toLocaleString(
                        "es-MX",
                        { style: "currency", currency: order.currency }
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
