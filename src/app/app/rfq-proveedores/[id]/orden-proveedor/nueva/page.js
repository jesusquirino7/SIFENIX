import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import NuevaOrdenProveedorForm from "./NuevaOrdenProveedorForm";

export default async function NuevaOrdenProveedorPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: rfq }, { data: items }] = await Promise.all([
    supabase
      .from("rfqs")
      .select(
        "id, rfq_number, opportunity_id, supplier_id, suppliers(company_name), opportunities(opportunity_number, customers(company_name))"
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("rfq_items")
      .select("*")
      .eq("rfq_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (!rfq) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title="Nueva orden a proveedor"
        breadcrumbs={[
          { label: "RFQ Proveedores", href: "/app/rfq-proveedores" },
          { label: rfq.rfq_number, href: `/app/rfq-proveedores/${rfq.id}` },
          { label: "Nueva orden" },
        ]}
      />
      <div className="max-w-3xl">
        <p className="mb-4 text-sm text-neutral-500">
          Para{" "}
          <span className="font-medium text-neutral-700">
            {rfq.suppliers?.company_name}
          </span>{" "}
          — los productos y costos se prellenaron desde la respuesta de la
          RFQ {rfq.rfq_number}.
        </p>
        <NuevaOrdenProveedorForm
          opportunityId={rfq.opportunity_id}
          rfqId={rfq.id}
          supplierId={rfq.supplier_id}
          initialItems={items || []}
        />
      </div>
    </div>
  );
}
