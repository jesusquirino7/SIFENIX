import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EmptyState from "@/components/app/EmptyState";
import Badge from "@/components/app/Badge";
import { LEAD_STATUS } from "@/components/app/statusColors";

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("id, nombre, empresa, interes, estatus, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Solicitudes del sitio" />
      <p className="mb-4 max-w-2xl text-sm text-neutral-500">
        Cada vez que alguien manda el formulario de{" "}
        <a href="/contacto" target="_blank" rel="noopener" className="text-[var(--brand-red)] hover:opacity-80">
          /contacto
        </a>{" "}
        del sitio público, aparece aquí — además de llegar por correo.
      </p>

      {!leads?.length ? (
        <EmptyState
          title="Todavía no hay solicitudes"
          description="Aparecerán aquí en cuanto alguien mande el formulario público de contacto."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Empresa</th>
                <th className="px-4 py-3 font-medium">Interés</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
                <th className="px-4 py-3 font-medium">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {leads.map((lead) => {
                const status = LEAD_STATUS[lead.estatus] || LEAD_STATUS.nuevo;
                return (
                  <tr key={lead.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/app/leads/${lead.id}`}
                        className="font-medium text-neutral-900 hover:text-[var(--brand-red)]"
                      >
                        {lead.nombre}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {lead.empresa || "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {lead.interes || "—"}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {new Date(lead.created_at).toLocaleDateString("es-MX")}
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
