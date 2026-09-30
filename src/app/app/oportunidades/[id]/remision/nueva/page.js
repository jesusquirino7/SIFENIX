import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import NuevaRemisionForm from "./NuevaRemisionForm";

export default async function NuevaRemisionPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: opportunity }, { data: items }] = await Promise.all([
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
  ]);

  if (!opportunity) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title="Nueva remisión"
        breadcrumbs={[
          { label: "Oportunidades", href: "/app/oportunidades" },
          {
            label: opportunity.opportunity_number,
            href: `/app/oportunidades/${opportunity.id}`,
          },
          { label: "Nueva remisión" },
        ]}
      />
      <div className="max-w-3xl">
        <p className="mb-4 text-sm text-neutral-500">
          Para{" "}
          <span className="font-medium text-neutral-700">
            {opportunity.customers?.company_name}
          </span>{" "}
          — captura lo que realmente sale de existencia hoy. El proceso
          formal (cotización, orden de compra) se puede hacer después y
          ligarse a esta remisión.
        </p>
        <NuevaRemisionForm opportunityId={opportunity.id} initialItems={items || []} />
      </div>
    </div>
  );
}
