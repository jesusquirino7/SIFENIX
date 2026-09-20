import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import StatCard from "@/components/app/StatCard";
import EmptyState from "@/components/app/EmptyState";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [opportunitiesResult, customersResult, suppliersResult] =
    await Promise.all([
      supabase
        .from("opportunities")
        .select("id", { count: "exact", head: true })
        .in("status", ["open", "quoting"]),
      supabase
        .from("customers")
        .select("id", { count: "exact", head: true })
        .eq("active", true),
      supabase
        .from("suppliers")
        .select("id", { count: "exact", head: true })
        .eq("active", true),
    ]);

  return (
    <div>
      <PageHeader title="Dashboard" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Oportunidades activas"
          value={opportunitiesResult.count ?? 0}
          hint="Abiertas o en cotización"
        />
        <StatCard
          label="Clientes activos"
          value={customersResult.count ?? 0}
        />
        <StatCard
          label="Proveedores activos"
          value={suppliersResult.count ?? 0}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
          Requiere atención
        </h2>
        <div className="mt-3">
          <EmptyState
            title="Todavía no hay nada pendiente de revisar"
            description="Aquí van a aparecer cotizaciones esperando respuesta, RFQ sin respuesta de proveedor y órdenes atrasadas en cuanto esos módulos entren en operación (Etapa 2 en adelante)."
          />
        </div>
      </div>
    </div>
  );
}
