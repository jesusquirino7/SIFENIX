import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EmptyState from "@/components/app/EmptyState";
import NuevaOportunidadForm from "./NuevaOportunidadForm";

export default async function NuevaOportunidadPage() {
  const supabase = await createClient();
  const { data: customers } = await supabase
    .from("customers")
    .select("id, company_name")
    .eq("active", true)
    .order("company_name");

  return (
    <div>
      <PageHeader
        title="Nueva oportunidad"
        breadcrumbs={[
          { label: "Oportunidades", href: "/app/oportunidades" },
          { label: "Nueva" },
        ]}
      />

      {!customers?.length ? (
        <EmptyState
          title="Necesitas al menos un cliente activo"
          description="Da de alta un cliente antes de crear una oportunidad."
          action={
            <Link
              href="/app/clientes"
              className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Ir a Clientes
            </Link>
          }
        />
      ) : (
        <div className="max-w-2xl">
          <NuevaOportunidadForm customers={customers} />
        </div>
      )}
    </div>
  );
}
