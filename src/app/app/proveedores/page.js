import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EmptyState from "@/components/app/EmptyState";
import Badge from "@/components/app/Badge";
import NuevoProveedorButton from "./NuevoProveedorButton";

export default async function ProveedoresPage() {
  const supabase = await createClient();
  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("id, company_name, city, phone, email, active")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Proveedores" action={<NuevoProveedorButton />} />

      {!suppliers?.length ? (
        <EmptyState
          title="Todavía no hay proveedores registrados"
          description="Da de alta el primero con el botón 'Nuevo proveedor'."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Empresa</th>
                <th className="px-4 py-3 font-medium">Ciudad</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    <Link
                      href={`/app/proveedores/${supplier.id}`}
                      className="hover:text-[var(--brand-red)]"
                    >
                      {supplier.company_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {supplier.city || "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {supplier.email || supplier.phone || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={supplier.active ? "green" : "gray"}>
                      {supplier.active ? "Activo" : "Inactivo"}
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
