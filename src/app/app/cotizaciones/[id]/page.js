import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EstadoCotizacion from "./EstadoCotizacion";

export default async function CotizacionDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: quotation }, { data: items }] = await Promise.all([
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
  ]);

  if (!quotation) {
    notFound();
  }

  const total = (items || []).reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unit_price || 0),
    0
  );

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
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-neutral-500">
              Productos cotizados
            </h2>
            {!items?.length ? (
              <p className="mt-3 text-sm text-neutral-500">
                Sin productos capturados.
              </p>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
                    <tr>
                      <th className="py-2 pr-4 font-medium">Part number</th>
                      <th className="py-2 pr-4 font-medium">Descripción</th>
                      <th className="py-2 pr-4 font-medium">Cant.</th>
                      <th className="py-2 pr-4 font-medium">P. unitario</th>
                      <th className="py-2 pr-4 font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2 pr-4 font-medium text-neutral-900">
                          {item.part_number || "—"}
                        </td>
                        <td className="py-2 pr-4 text-neutral-600">
                          {item.description || item.manufacturer || "—"}
                        </td>
                        <td className="py-2 pr-4 text-neutral-600">
                          {item.quantity}
                        </td>
                        <td className="py-2 pr-4 text-neutral-600">
                          {item.unit_price != null
                            ? item.unit_price.toLocaleString("es-MX", {
                                style: "currency",
                                currency: quotation.currency,
                              })
                            : "—"}
                        </td>
                        <td className="py-2 pr-4 font-medium text-neutral-900">
                          {(
                            (item.quantity || 0) * (item.unit_price || 0)
                          ).toLocaleString("es-MX", {
                            style: "currency",
                            currency: quotation.currency,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={4} className="pt-3 text-right font-semibold text-neutral-500">
                        Total
                      </td>
                      <td className="pt-3 font-semibold text-neutral-900">
                        {total.toLocaleString("es-MX", {
                          style: "currency",
                          currency: quotation.currency,
                        })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {quotation.notes && (
            <div className="rounded-lg border border-neutral-200 bg-white p-6">
              <h2 className="text-sm font-semibold text-neutral-500">Notas</h2>
              <p className="mt-2 text-sm text-neutral-600">{quotation.notes}</p>
            </div>
          )}
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
