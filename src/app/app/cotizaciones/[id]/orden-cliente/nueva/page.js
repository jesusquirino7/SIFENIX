import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import NuevaOrdenClienteForm from "./NuevaOrdenClienteForm";

export default async function NuevaOrdenClientePage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: quotation }, { data: items }] = await Promise.all([
    supabase
      .from("quotations")
      .select(
        "id, quotation_number, currency, opportunity_id, opportunities(opportunity_number, customers(company_name))"
      )
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

  return (
    <div>
      <PageHeader
        title="Nueva orden de cliente"
        breadcrumbs={[
          { label: "Cotizaciones", href: "/app/cotizaciones" },
          {
            label: quotation.quotation_number,
            href: `/app/cotizaciones/${quotation.id}`,
          },
          { label: "Nueva orden de cliente" },
        ]}
      />
      <div className="max-w-3xl">
        <p className="mb-4 text-sm text-neutral-500">
          Confirma la venta para{" "}
          <span className="font-medium text-neutral-700">
            {quotation.opportunities?.customers?.company_name}
          </span>{" "}
          — los productos y precios se prellenaron desde{" "}
          {quotation.quotation_number}.
        </p>
        <NuevaOrdenClienteForm
          quotationId={quotation.id}
          opportunityId={quotation.opportunity_id}
          currency={quotation.currency}
          initialItems={items || []}
        />
      </div>
    </div>
  );
}
