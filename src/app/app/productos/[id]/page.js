import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EditarProductoForm from "./EditarProductoForm";

export default async function ProductoDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!product) {
    notFound();
  }

  return (
    <div>
      <PageHeader
        title={product.part_number}
        breadcrumbs={[
          { label: "Productos", href: "/app/productos" },
          { label: product.part_number },
        ]}
      />
      <div className="max-w-2xl">
        <EditarProductoForm product={product} />
      </div>
    </div>
  );
}
