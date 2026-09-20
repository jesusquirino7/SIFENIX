import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EditarProveedorForm from "./EditarProveedorForm";

export default async function ProveedorDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: supplier } = await supabase
    .from("suppliers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!supplier) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title={supplier.company_name}
        breadcrumbs={[
          { label: "Proveedores", href: "/app/proveedores" },
          { label: supplier.company_name },
        ]}
      />
      <div className="max-w-2xl">
        <EditarProveedorForm supplier={supplier} />
      </div>
    </div>
  );
}
