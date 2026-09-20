import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EmptyState from "@/components/app/EmptyState";
import NuevaRfqForm from "./NuevaRfqForm";

export default async function NuevaRfqPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: opportunity }, { data: items }, { data: suppliers }] =
    await Promise.all([
      supabase
        .from("opportunities")
        .select("id, opportunity_number, name, customers(company_name)")
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("opportunity_items")
        .select("*")
        .eq("opportunity_id", id)
        .order("created_at", { ascending: true }),
      supabase
        .from("suppliers")
        .select("id, company_name")
        .eq("active", true)
        .order("company_name"),
    ]);

  if (!opportunity) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title="Nueva RFQ"
        breadcrumbs={[
          { label: "Oportunidades", href: "/app/oportunidades" },
          {
            label: opportunity.opportunity_number,
            href: `/app/oportunidades/${opportunity.id}`,
          },
          { label: "Nueva RFQ" },
        ]}
      />

      {!suppliers?.length ? (
        <EmptyState
          title="Necesitas al menos un proveedor activo"
          description="Da de alta un proveedor antes de enviar una RFQ."
          action={
            <Link
              href="/app/proveedores"
              className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Ir a Proveedores
            </Link>
          }
        />
      ) : (
        <div className="max-w-3xl">
          <p className="mb-4 text-sm text-neutral-500">
            Para la operación de{" "}
            <span className="font-medium text-neutral-700">
              {opportunity.customers?.company_name}
            </span>{" "}
            — los productos se prellenaron desde los que pidió cotizar el
            cliente; ajusta cantidades si el proveedor solo cotiza parte.
          </p>
          <NuevaRfqForm
            opportunityId={opportunity.id}
            suppliers={suppliers}
            initialItems={items || []}
          />
        </div>
      )}
    </div>
  );
}
