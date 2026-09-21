import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import AttachmentsPanel from "@/components/app/AttachmentsPanel";
import Badge from "@/components/app/Badge";
import { getDeliveryHealth } from "@/components/app/statusColors";
import EstadoOrdenProveedor from "./EstadoOrdenProveedor";
import OrdenProveedorEditor from "./OrdenProveedorEditor";

export default async function OrdenProveedorDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: order }, { data: items }, { data: attachments }] =
    await Promise.all([
      supabase
        .from("supplier_orders")
        .select(
          "*, suppliers(id, company_name, email, phone), opportunities(id, opportunity_number, name), rfqs(id, rfq_number)"
        )
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("supplier_order_items")
        .select("*")
        .eq("supplier_order_id", id)
        .order("created_at", { ascending: true }),
      supabase
        .from("attachments")
        .select("*")
        .eq("entity_type", "supplier_order")
        .eq("entity_id", id)
        .order("created_at", { ascending: false }),
    ]);

  if (!order) {
    notFound();
  }

  const health = getDeliveryHealth(order);

  return (
    <div>
      <PageHeader
        title={order.order_number}
        breadcrumbs={[
          { label: "Órdenes a Proveedores", href: "/app/ordenes-proveedor" },
          { label: order.order_number },
        ]}
        action={<EstadoOrdenProveedor orderId={order.id} status={order.status} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <OrdenProveedorEditor
            order={order}
            items={items || []}
            editable={order.status === "confirmed"}
          />

          {order.notes && (
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-neutral-500">Notas</h2>
              <p className="mt-2 text-sm text-neutral-600">{order.notes}</p>
            </div>
          )}

          <AttachmentsPanel
            entityType="supplier_order"
            entityId={order.id}
            attachments={attachments || []}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-neutral-500">
              Entrega esperada
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-sm text-neutral-600">
                {order.expected_delivery_date || "Sin fecha capturada"}
              </p>
              {health && <Badge color={health.color}>{health.label}</Badge>}
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-neutral-500">Proveedor</h2>
            <p className="mt-2 font-medium text-neutral-900">
              {order.suppliers?.company_name}
            </p>
            {order.suppliers?.email && (
              <p className="text-sm text-neutral-600">{order.suppliers.email}</p>
            )}
            {order.suppliers?.id && (
              <Link
                href={`/app/proveedores/${order.suppliers.id}`}
                className="mt-3 inline-block text-sm font-medium text-[var(--brand-red)] hover:opacity-80"
              >
                Ver proveedor →
              </Link>
            )}
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-neutral-500">Operación</h2>
            <p className="mt-2 font-medium text-neutral-900">
              {order.opportunities?.opportunity_number}
            </p>
            <p className="text-sm text-neutral-600">{order.opportunities?.name}</p>
            {order.opportunities?.id && (
              <Link
                href={`/app/oportunidades/${order.opportunities.id}`}
                className="mt-3 inline-block text-sm font-medium text-[var(--brand-red)] hover:opacity-80"
              >
                Ver operación →
              </Link>
            )}
          </div>

          {order.rfqs?.id && (
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-neutral-500">
                RFQ de origen
              </h2>
              <Link
                href={`/app/rfq-proveedores/${order.rfqs.id}`}
                className="mt-2 inline-block text-sm font-medium text-[var(--brand-red)] hover:opacity-80"
              >
                {order.rfqs.rfq_number} →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
