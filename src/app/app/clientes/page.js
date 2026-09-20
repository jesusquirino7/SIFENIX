import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EmptyState from "@/components/app/EmptyState";
import Badge from "@/components/app/Badge";
import NuevoClienteButton from "./NuevoClienteButton";

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data: customers } = await supabase
    .from("customers")
    .select("id, company_name, industry, city, phone, email, active")
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Clientes" action={<NuevoClienteButton />} />

      {!customers?.length ? (
        <EmptyState
          title="Todavía no hay clientes registrados"
          description="Da de alta el primero con el botón 'Nuevo cliente'."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Empresa</th>
                <th className="px-4 py-3 font-medium">Industria</th>
                <th className="px-4 py-3 font-medium">Ciudad</th>
                <th className="px-4 py-3 font-medium">Contacto</th>
                <th className="px-4 py-3 font-medium">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    <Link
                      href={`/app/clientes/${customer.id}`}
                      className="hover:text-[var(--brand-red)]"
                    >
                      {customer.company_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {customer.industry || "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {customer.city || "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {customer.email || customer.phone || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={customer.active ? "green" : "gray"}>
                      {customer.active ? "Activo" : "Inactivo"}
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
