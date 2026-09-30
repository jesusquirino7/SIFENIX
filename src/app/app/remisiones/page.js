import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EmptyState from "@/components/app/EmptyState";
import Badge from "@/components/app/Badge";
import { REMISION_STATUS } from "@/components/app/statusColors";

export default async function RemisionesPage() {
  const supabase = await createClient();
  const { data: remisiones } = await supabase
    .from("remisiones")
    .select(
      "id, remision_number, status, delivered_at, opportunities(id, opportunity_number, customers(company_name)), customer_order_id"
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Remisiones" />
      <p className="mb-4 max-w-2xl text-sm text-neutral-500">
        Entregas de material que salió de existencia antes de que existiera
        una orden de compra formal — se crean desde el detalle de una
        oportunidad.
      </p>

      {!remisiones?.length ? (
        <EmptyState
          title="Todavía no hay remisiones"
          description="Se crean desde el detalle de una oportunidad con 'Nueva remisión'."
          action={
            <Link
              href="/app/oportunidades"
              className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Ir a Oportunidades
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Remisión</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Operación</th>
                <th className="px-4 py-3 font-medium">Entregada</th>
                <th className="px-4 py-3 font-medium">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {remisiones.map((remision) => {
                const status =
                  REMISION_STATUS[remision.status] || REMISION_STATUS.entregada;
                return (
                  <tr key={remision.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/app/remisiones/${remision.id}`}
                        className="font-medium text-neutral-900 hover:text-[var(--brand-red)]"
                      >
                        {remision.remision_number}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {remision.opportunities?.customers?.company_name || "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {remision.opportunities ? (
                        <Link
                          href={`/app/oportunidades/${remision.opportunities.id}`}
                          className="hover:text-[var(--brand-red)]"
                        >
                          {remision.opportunities.opportunity_number}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {remision.delivered_at}
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
