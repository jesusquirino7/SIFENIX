import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import AttachmentsPanel from "@/components/app/AttachmentsPanel";
import EmptyState from "@/components/app/EmptyState";
import Badge from "@/components/app/Badge";
import { SUPPLIER_ORDER_STATUS } from "@/components/app/statusColors";
import EstadoRfq from "./EstadoRfq";
import RfqItemsEditor from "./RfqItemsEditor";

export default async function RfqDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: rfq }, { data: items }, { data: attachments }, { data: orders }] =
    await Promise.all([
      supabase
        .from("rfqs")
        .select(
          "*, suppliers(id, company_name, email, phone), opportunities(id, opportunity_number, name, customers(company_name))"
        )
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("rfq_items")
        .select("*")
        .eq("rfq_id", id)
        .order("created_at", { ascending: true }),
      supabase
        .from("attachments")
        .select("*")
        .eq("entity_type", "rfq")
        .eq("entity_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("supplier_orders")
        .select("id, order_number, status")
        .eq("rfq_id", id)
        .order("created_at", { ascending: false }),
    ]);

  if (!rfq) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title={rfq.rfq_number}
        breadcrumbs={[
          { label: "RFQ Proveedores", href: "/app/rfq-proveedores" },
          { label: rfq.rfq_number },
        ]}
        action={<EstadoRfq rfqId={rfq.id} status={rfq.status} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-neutral-500">
              Productos solicitados
            </h2>
            <RfqItemsEditor items={items || []} />
          </div>

          {rfq.notes && (
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-neutral-500">
                Notas para el proveedor
              </h2>
              <p className="mt-2 text-sm text-neutral-600">{rfq.notes}</p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-500">
                Orden a proveedor
              </h2>
              <Link
                href={`/app/rfq-proveedores/${rfq.id}/orden-proveedor/nueva`}
                className="text-sm font-medium text-[var(--brand-red)] hover:opacity-80"
              >
                + Nueva orden a proveedor
              </Link>
            </div>
            <div className="mt-3">
              {!orders?.length ? (
                <EmptyState
                  title="Todavía no hay orden para este proveedor"
                  description="Cuando decidas comprarle a este proveedor, da clic en 'Nueva orden a proveedor'."
                />
              ) : (
                <div className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-white">
                  {orders.map((order) => {
                    const status =
                      SUPPLIER_ORDER_STATUS[order.status] || SUPPLIER_ORDER_STATUS.confirmed;
                    return (
                      <Link
                        key={order.id}
                        href={`/app/ordenes-proveedor/${order.id}`}
                        className="flex items-center justify-between px-4 py-3 text-sm hover:bg-neutral-50"
                      >
                        <span className="font-medium text-neutral-900">
                          {order.order_number}
                        </span>
                        <Badge color={status.color}>{status.label}</Badge>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <AttachmentsPanel
            entityType="rfq"
            entityId={rfq.id}
            attachments={attachments || []}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-neutral-500">Proveedor</h2>
            <p className="mt-2 font-medium text-neutral-900">
              {rfq.suppliers?.company_name}
            </p>
            {rfq.suppliers?.email && (
              <p className="text-sm text-neutral-600">{rfq.suppliers.email}</p>
            )}
            {rfq.suppliers?.phone && (
              <p className="text-sm text-neutral-600">{rfq.suppliers.phone}</p>
            )}
            {rfq.suppliers?.id && (
              <Link
                href={`/app/proveedores/${rfq.suppliers.id}`}
                className="mt-3 inline-block text-sm font-medium text-[var(--brand-red)] hover:opacity-80"
              >
                Ver proveedor →
              </Link>
            )}
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-neutral-500">Operación</h2>
            <p className="mt-2 font-medium text-neutral-900">
              {rfq.opportunities?.opportunity_number}
            </p>
            <p className="text-sm text-neutral-600">{rfq.opportunities?.name}</p>
            {rfq.opportunities?.id && (
              <Link
                href={`/app/oportunidades/${rfq.opportunities.id}`}
                className="mt-3 inline-block text-sm font-medium text-[var(--brand-red)] hover:opacity-80"
              >
                Ver operación →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
