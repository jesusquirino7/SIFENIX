import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EditarProductoForm from "./EditarProductoForm";
import HistorialPreciosTile from "./HistorialPreciosTile";

export default async function ProductoDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: product }, { data: priceHistory }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("product_price_history")
      .select("id, previous_price, new_price, changed_at, profiles(full_name)")
      .eq("product_id", id)
      .order("changed_at", { ascending: false }),
  ]);

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
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EditarProductoForm product={product} />
        </div>
        <div className="lg:col-span-1">
          <HistorialPreciosTile
            history={priceHistory}
            currency={product.currency}
          />
        </div>
      </div>
    </div>
  );
}
