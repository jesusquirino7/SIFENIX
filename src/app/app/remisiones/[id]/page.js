import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import AttachmentsPanel from "@/components/app/AttachmentsPanel";
import EstadoRemision from "./EstadoRemision";
import RemisionItemsEditor from "./RemisionItemsEditor";
import FormalizarRemision from "./FormalizarRemision";

export default async function RemisionDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: remision }, { data: items }, { data: attachments }] =
    await Promise.all([
      supabase
        .from("remisiones")
        .select(
          "*, opportunities(id, opportunity_number, name, customers(id, company_name, email)), customer_orders(id, order_number)"
        )
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("remision_items")
        .select("*")
        .eq("remision_id", id)
        .order("created_at", { ascending: true }),
      supabase
        .from("attachments")
        .select("*")
        .eq("entity_type", "remision")
        .eq("entity_id", id)
        .order("created_at", { ascending: false }),
    ]);

  if (!remision) {
    notFound();
  }

  let availableOrders = [];
  if (remision.status === "entregada") {
    const { data: orders } = await supabase
      .from("customer_orders")
      .select("id, order_number")
      .eq("opportunity_id", remision.opportunity_id)
      .order("created_at", { ascending: false });
    availableOrders = orders || [];
  }

  return (
    <div>
      <PageHeader
        title={remision.remision_number}
        breadcrumbs={[
          { label: "Remisiones", href: "/app/remisiones" },
          { label: remision.remision_number },
        ]}
        action={<EstadoRemision remisionId={remision.id} status={remision.status} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RemisionItemsEditor
            remisionId={remision.id}
            items={items || []}
            editable={remision.status === "entregada"}
          />

          {remision.notes && (
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-neutral-500">Notas</h2>
              <p className="mt-2 text-sm text-neutral-600">{remision.notes}</p>
            </div>
          )}

          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-neutral-500">
              Formalización
            </h2>
            <div className="mt-3">
              {remision.customer_orders?.id ? (
                <p className="text-sm text-neutral-600">
                  Ligada a la orden de cliente{" "}
                  <Link
                    href={`/app/ordenes-cliente/${remision.customer_orders.id}`}
                    className="font-medium text-[var(--brand-red)] hover:opacity-80"
                  >
                    {remision.customer_orders.order_number}
                  </Link>
                  .
                </p>
              ) : remision.status === "cancelada" ? (
                <p className="text-sm text-neutral-500">
                  Remisión cancelada — no aplica formalizar.
                </p>
              ) : (
                <FormalizarRemision
                  remisionId={remision.id}
                  customerOrders={availableOrders}
                />
              )}
            </div>
          </div>

          <AttachmentsPanel
            entityType="remision"
            entityId={remision.id}
            attachments={attachments || []}
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-neutral-500">
              Fecha de entrega
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              {remision.delivered_at}
            </p>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-neutral-500">Operación</h2>
            <p className="mt-2 font-medium text-neutral-900">
              {remision.opportunities?.opportunity_number}
            </p>
            <p className="text-sm text-neutral-600">{remision.opportunities?.name}</p>
            {remision.opportunities?.id && (
              <Link
                href={`/app/oportunidades/${remision.opportunities.id}`}
                className="mt-3 inline-block text-sm font-medium text-[var(--brand-red)] hover:opacity-80"
              >
                Ver operación →
              </Link>
            )}
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-neutral-500">Cliente</h2>
            <p className="mt-2 font-medium text-neutral-900">
              {remision.opportunities?.customers?.company_name}
            </p>
            {remision.opportunities?.customers?.email && (
              <p className="text-sm text-neutral-600">
                {remision.opportunities.customers.email}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
