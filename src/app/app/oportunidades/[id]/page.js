import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import Badge from "@/components/app/Badge";
import EmptyState from "@/components/app/EmptyState";
import { OPPORTUNITY_STATUS } from "@/components/app/statusColors";

export default async function OportunidadDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: opportunity }, { data: items }] = await Promise.all([
    supabase
      .from("opportunities")
      .select("*, customers(id, company_name, email, phone)")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("opportunity_items")
      .select("*")
      .eq("opportunity_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (!opportunity) {
    notFound();
  }

  const status = OPPORTUNITY_STATUS[opportunity.status] || OPPORTUNITY_STATUS.open;

  return (
    <div>
      <PageHeader
        title={opportunity.opportunity_number}
        breadcrumbs={[
          { label: "Oportunidades", href: "/app/oportunidades" },
          { label: opportunity.opportunity_number },
        ]}
        action={<Badge color={status.color}>{status.label}</Badge>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold tracking-tight">
              {opportunity.name}
            </h2>
            {opportunity.description && (
              <p className="mt-2 text-sm text-neutral-600">
                {opportunity.description}
              </p>
            )}
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-neutral-500">Valor estimado</dt>
                <dd className="font-medium text-neutral-900">
                  {opportunity.estimated_value != null
                    ? `${opportunity.estimated_value} ${opportunity.currency}`
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">Cierre esperado</dt>
                <dd className="font-medium text-neutral-900">
                  {opportunity.expected_close_date || "—"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-neutral-500">
              Productos solicitados
            </h2>
            {!items?.length ? (
              <p className="mt-3 text-sm text-neutral-500">
                Sin productos capturados todavía.
              </p>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
                    <tr>
                      <th className="py-2 pr-4 font-medium">Part number</th>
                      <th className="py-2 pr-4 font-medium">Fabricante</th>
                      <th className="py-2 pr-4 font-medium">Descripción</th>
                      <th className="py-2 pr-4 font-medium">Cant.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2 pr-4 font-medium text-neutral-900">
                          {item.part_number || "—"}
                        </td>
                        <td className="py-2 pr-4 text-neutral-600">
                          {item.manufacturer || "—"}
                        </td>
                        <td className="py-2 pr-4 text-neutral-600">
                          {item.description || "—"}
                        </td>
                        <td className="py-2 pr-4 text-neutral-600">
                          {item.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-sm font-semibold text-neutral-500">
              Documentos relacionados
            </h2>
            <div className="mt-3">
              <EmptyState
                title="Todavía no hay documentos ligados a esta operación"
                description="Aquí van a aparecer la cotización al cliente, las RFQ a proveedores, sus respuestas, el comparativo y las órdenes de compra en cuanto esos módulos entren en operación (Etapa 2 en adelante)."
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-neutral-500">Cliente</h2>
          <p className="mt-2 font-medium text-neutral-900">
            {opportunity.customers?.company_name}
          </p>
          {opportunity.customers?.email && (
            <p className="mt-1 text-sm text-neutral-600">
              {opportunity.customers.email}
            </p>
          )}
          {opportunity.customers?.phone && (
            <p className="text-sm text-neutral-600">
              {opportunity.customers.phone}
            </p>
          )}
          {opportunity.customers?.id && (
            <Link
              href={`/app/clientes/${opportunity.customers.id}`}
              className="mt-3 inline-block text-sm font-medium text-[var(--brand-red)] hover:opacity-80"
            >
              Ver cliente →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
