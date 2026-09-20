import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import StatCard from "@/components/app/StatCard";
import EmptyState from "@/components/app/EmptyState";
import Badge from "@/components/app/Badge";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    opportunitiesResult,
    customersResult,
    suppliersResult,
    quotationsSentResult,
    quotationsAwaiting,
  ] = await Promise.all([
    supabase
      .from("opportunities")
      .select("id", { count: "exact", head: true })
      .in("status", ["open", "quoting"]),
    supabase
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("active", true),
    supabase
      .from("suppliers")
      .select("id", { count: "exact", head: true })
      .eq("active", true),
    supabase
      .from("quotations")
      .select("id", { count: "exact", head: true })
      .eq("status", "sent"),
    supabase
      .from("quotations")
      .select(
        "id, quotation_number, valid_until, opportunities(opportunity_number, customers(company_name))"
      )
      .eq("status", "sent")
      .order("valid_until", { ascending: true, nullsFirst: false }),
  ]);

  const awaiting = quotationsAwaiting.data || [];

  return (
    <div>
      <PageHeader title="Dashboard" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Oportunidades activas"
          value={opportunitiesResult.count ?? 0}
          hint="Abiertas o en cotización"
        />
        <StatCard
          label="Cotizaciones enviadas"
          value={quotationsSentResult.count ?? 0}
          hint="Esperando respuesta del cliente"
        />
        <StatCard
          label="Clientes activos"
          value={customersResult.count ?? 0}
        />
        <StatCard
          label="Proveedores activos"
          value={suppliersResult.count ?? 0}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
          Requiere atención
        </h2>
        <div className="mt-3">
          {!awaiting.length ? (
            <EmptyState
              title="Todavía no hay nada pendiente de revisar"
              description="Cuando una cotización se marque como enviada, va a aparecer aquí hasta que el cliente responda. Las RFQ sin respuesta y las órdenes atrasadas se activan en etapas posteriores."
            />
          ) : (
            <div className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-white">
              {awaiting.map((quotation) => (
                <Link
                  key={quotation.id}
                  href={`/app/cotizaciones/${quotation.id}`}
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-neutral-50"
                >
                  <div>
                    <span className="font-medium text-neutral-900">
                      {quotation.quotation_number}
                    </span>
                    <span className="ml-2 text-neutral-500">
                      {quotation.opportunities?.customers?.company_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {quotation.valid_until && (
                      <span className="text-xs text-neutral-400">
                        Vence {quotation.valid_until}
                      </span>
                    )}
                    <Badge color="blue">Esperando respuesta</Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
