import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import NuevaCotizacionForm from "./NuevaCotizacionForm";

export default async function NuevaCotizacionPage({ params }) {
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
        title="Nueva cotización"
        breadcrumbs={[
          { label: "Oportunidades", href: "/app/oportunidades" },
          {
            label: opportunity.opportunity_number,
            href: `/app/oportunidades/${opportunity.id}`,
          },
          { label: "Nueva cotización" },
        ]}
      />
      <div className="max-w-3xl">
        <p className="mb-4 text-sm text-neutral-500">
          Para <span className="font-medium text-neutral-700">{opportunity.customers?.company_name}</span> —
          los productos se prellenaron desde los que pidió cotizar en la
          oportunidad; ajusta cantidades y agrega el precio unitario.
        </p>
        <NuevaCotizacionForm opportunityId={opportunity.id} initialItems={items || []} />
      </div>
    </div>
  );
}
