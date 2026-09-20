import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EmptyState from "@/components/app/EmptyState";
import Badge from "@/components/app/Badge";
import NuevoProductoButton from "./NuevoProductoButton";

export default async function ProductosPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select(
      "id, part_number, manufacturer, category, default_price, currency, active"
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Productos" action={<NuevoProductoButton />} />

      {!products?.length ? (
        <EmptyState
          title="Todavía no hay productos en el catálogo"
          description="Da de alta el primero con el botón 'Nuevo producto'."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Part number</th>
                <th className="px-4 py-3 font-medium">Fabricante</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    <Link
                      href={`/app/productos/${product.id}`}
                      className="hover:text-[var(--brand-red)]"
                    >
                      {product.part_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {product.manufacturer || "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {product.category || "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {product.default_price != null
                      ? `${product.default_price} ${product.currency}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={product.active ? "green" : "gray"}>
                      {product.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
