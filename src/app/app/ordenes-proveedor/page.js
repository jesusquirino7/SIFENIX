import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EmptyState from "@/components/app/EmptyState";
import Badge from "@/components/app/Badge";
import { SUPPLIER_ORDER_STATUS, getDeliveryHealth } from "@/components/app/statusColors";

function computeTotal(items) {
  return (items || []).reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unit_cost || 0),
    0
  );
}

export default async function OrdenesProveedorPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("supplier_orders")
    .select(
      "id, order_number, status, currency, expected_delivery_date, suppliers(company_name), opportunities(id, opportunity_number), supplier_order_items(quantity, unit_cost)"
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Órdenes a Proveedores" />

      {!orders?.length ? (
        <EmptyState
          title="Todavía no hay órdenes a proveedores"
          description="Una orden a proveedor siempre nace desde una RFQ respondida: entra a la RFQ y da clic en 'Nueva orden a proveedor'."
          action={
            <Link
              href="/app/rfq-proveedores"
              className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Ir a RFQ Proveedores
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Orden</th>
                <th className="px-4 py-3 font-medium">Proveedor</th>
                <th className="px-4 py-3 font-medium">Operación</th>
                <th className="px-4 py-3 font-medium">Entrega esperada</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((order) => {
                const status =
                  SUPPLIER_ORDER_STATUS[order.status] || SUPPLIER_ORDER_STATUS.confirmed;
                const health = getDeliveryHealth(order);
                return (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/app/ordenes-proveedor/${order.id}`}
                        className="font-medium text-neutral-900 hover:text-[var(--brand-red)]"
                      >
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {order.suppliers?.company_name || "—"}
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
                    <td className="px-4 py-3">
                      {order.expected_delivery_date ? (
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-600">
                            {order.expected_delivery_date}
                          </span>
                          {health && (
                            <Badge color={health.color}>{health.label}</Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {computeTotal(order.supplier_order_items).toLocaleString(
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
