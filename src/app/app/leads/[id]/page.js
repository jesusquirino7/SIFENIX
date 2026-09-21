import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EstadoLead from "./EstadoLead";

export default async function LeadDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!lead) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title={lead.nombre}
        breadcrumbs={[
          { label: "Solicitudes del sitio", href: "/app/leads" },
          { label: lead.nombre },
        ]}
        action={<EstadoLead leadId={lead.id} status={lead.estatus} />}
      />

      <div className="max-w-2xl space-y-6">
        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-neutral-500">Empresa</dt>
              <dd className="font-medium text-neutral-900">
                {lead.empresa || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Interés</dt>
              <dd className="font-medium text-neutral-900">
                {lead.interes || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Correo</dt>
              <dd className="font-medium text-neutral-900">
                <a href={`mailto:${lead.correo}`} className="hover:text-[var(--brand-red)]">
                  {lead.correo}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Teléfono</dt>
              <dd className="font-medium text-neutral-900">
                {lead.telefono || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Recibida</dt>
              <dd className="font-medium text-neutral-900">
                {new Date(lead.created_at).toLocaleString("es-MX")}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500">Origen</dt>
              <dd className="font-medium text-neutral-900">{lead.origen}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-neutral-500">Mensaje</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700">
            {lead.mensaje || "Sin mensaje."}
          </p>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-semibold text-neutral-500">Siguiente paso</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Si el contacto es real, da de alta la empresa en{" "}
            <Link href="/app/clientes" className="text-[var(--brand-red)] hover:opacity-80">
              Clientes
            </Link>{" "}
            y crea su{" "}
            <Link href="/app/oportunidades/nueva" className="text-[var(--brand-red)] hover:opacity-80">
              Oportunidad
            </Link>{" "}
            — después márcala aquí como "Convertida".
          </p>
        </div>
      </div>
    </div>
  );
}
