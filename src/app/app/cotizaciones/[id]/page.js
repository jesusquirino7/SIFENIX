import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import AttachmentsPanel from "@/components/app/AttachmentsPanel";
import EmptyState from "@/components/app/EmptyState";
import Badge from "@/components/app/Badge";
import { CUSTOMER_ORDER_STATUS } from "@/components/app/statusColors";
import EstadoCotizacion from "./EstadoCotizacion";
import CotizacionEditor from "./CotizacionEditor";

export default async function CotizacionDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: quotation }, { data: items }, { data: attachments }, { data: orders }] =
    await Promise.all([
      supabase
        .from("quotations")
        .select("*, opportunities(id, opportunity_number, name, customers(id, company_name, email))")
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("quotation_items")
        .select("*")
        .eq("quotation_id", id)
        .order("created_at", { ascending: true }),
      supabase
        .from("attachments")
        .select("*")
        .eq("entity_type", "quotation")
        .eq("entity_id", id)
        .order("created_at", { ascending: false }),
      supabase
        .from("customer_orders")
        .select("id, order_number, status")
        .eq("quotation_id", id)
        .order("created_at", { ascending: false }),
    ]);

  if (!quotation) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title={quotation.quotation_number}
        breadcrumbs={[
          { label: "Cotizaciones", href: "/app/cotizaciones" },
          { label: quotation.quotation_number },
        ]}
        action={
          <EstadoCotizacion quotationId={quotation.id} status={quotation.status} />
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <CotizacionEditor
            quotation={quotation}
            items={items || []}
            editable={quotation.status === "draft"}
          />

          {quotation.notes && (
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-neutral-500">Notas</h2>
              <p className="mt-2 text-sm text-neutral-600">{quotation.notes}</p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-neutral-500">
                Orden de cliente
              </h2>
              <Link
                href={`/app/cotizaciones/${quotation.id}/orden-cliente/nueva`}
                className="text-sm font-medium text-[var(--brand-red)] hover:opacity-80"
              >
                + Nueva orden de cliente
              </Link>
            </div>
            <div className="mt-3">
              {!orders?.length ? (
                <EmptyState
                  title="Todavía no se ha confirmado como venta"
                  description="Cuando el cliente confirme, da clic en 'Nueva orden de cliente' para registrar su orden de compra."
                />
              ) : (
                <div className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-white">
                  {orders.map((order) => {
                    const status =
                      CUSTOMER_ORDER_STATUS[order.status] || CUSTOMER_ORDER_STATUS.confirmed;
                    return (
                      <Link
                        key={order.id}
                        href={`/app/ordenes-cliente/${order.id}`}
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
            entityType="quotation"
            entityId={quotation.id}
            attachments={attachments || []}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-neutral-500">Operación</h2>
            <p className="mt-2 font-medium text-neutral-900">
              {quotation.opportunities?.opportunity_number}
            </p>
            <p className="text-sm text-neutral-600">
              {quotation.opportunities?.name}
            </p>
            {quotation.opportunities?.id && (
              <Link
                href={`/app/oportunidades/${quotation.opportunities.id}`}
                className="mt-3 inline-block text-sm font-medium text-[var(--brand-red)] hover:opacity-80"
              >
                Ver operación →
              </Link>
            )}
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-neutral-500">Cliente</h2>
            <p className="mt-2 font-medium text-neutral-900">
              {quotation.opportunities?.customers?.company_name}
            </p>
            {quotation.opportunities?.customers?.email && (
              <p className="text-sm text-neutral-600">
                {quotation.opportunities.customers.email}
              </p>
            )}
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-neutral-500">Vigencia</h2>
            <p className="mt-2 text-sm text-neutral-600">
              {quotation.valid_until || "Sin fecha límite"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
