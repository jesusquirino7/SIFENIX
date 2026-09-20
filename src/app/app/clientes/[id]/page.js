import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EditarClienteForm from "./EditarClienteForm";

export default async function ClienteDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!customer) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title={customer.company_name}
        breadcrumbs={[
          { label: "Clientes", href: "/app/clientes" },
          { label: customer.company_name },
        ]}
      />
      <div className="max-w-2xl">
        <EditarClienteForm customer={customer} />
      </div>
    </div>
  );
}
