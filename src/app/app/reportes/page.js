import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import StatCard from "@/components/app/StatCard";
import EmptyState from "@/components/app/EmptyState";
import { OPPORTUNITY_STATUS } from "@/components/app/statusColors";

const STATUS_BAR_COLOR = {
  blue: "#3b82f6",
  green: "#10b981",
  amber: "#d97706",
  red: "#d71920",
  gray: "#a3a3a3",
};

function money(value, currency = "MXN") {
  return (value || 0).toLocaleString("es-MX", { style: "currency", currency });
}

function BarRow({ label, value, max, formatted, color }) {
  const pct = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="truncate font-medium text-neutral-700">{label}</span>
        <span className="shrink-0 text-neutral-500">{formatted}</span>
      </div>
      <div className="mt-1.5 h-2 rounded-full bg-neutral-100">
        <div
          className="h-2 rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default async function ReportesPage() {
  const supabase = await createClient();

  const [{ data: opportunities }, { data: customerOrders }, { data: supplierOrders }] =
    await Promise.all([
      supabase.from("opportunities").select("status, estimated_value"),
      supabase
        .from("customer_orders")
        .select(
          "status, currency, opportunities(customers(company_name)), customer_order_items(quantity, unit_price)"
        )
        .neq("status", "cancelled"),
      supabase
        .from("supplier_orders")
        .select("status, currency, suppliers(company_name), supplier_order_items(quantity, unit_cost)")
        .neq("status", "cancelled"),
    ]);

  // ---------- Rentabilidad ----------
  const revenue = (customerOrders || []).reduce(
    (sum, o) =>
      sum +
      (o.customer_order_items || []).reduce(
        (s, i) => s + (i.quantity || 0) * (i.unit_price || 0),
        0
      ),
    0
  );
  const cost = (supplierOrders || []).reduce(
    (sum, o) =>
      sum +
      (o.supplier_order_items || []).reduce(
        (s, i) => s + (i.quantity || 0) * (i.unit_cost || 0),
        0
      ),
    0
  );
  const margin = revenue - cost;
  const marginPct = revenue > 0 ? (margin / revenue) * 100 : null;

  // ---------- Embudo de oportunidades ----------
  const funnel = Object.keys(OPPORTUNITY_STATUS).map((status) => {
    const rows = (opportunities || []).filter((o) => o.status === status);
    return {
      status,
      label: OPPORTUNITY_STATUS[status].label,
      color: STATUS_BAR_COLOR[OPPORTUNITY_STATUS[status].color],
      count: rows.length,
      value: rows.reduce((s, o) => s + (o.estimated_value || 0), 0),
    };
  });
  const maxFunnelCount = Math.max(1, ...funnel.map((f) => f.count));
  const won = funnel.find((f) => f.status === "won")?.count || 0;
  const lost = funnel.find((f) => f.status === "lost")?.count || 0;
  const winRate = won + lost > 0 ? (won / (won + lost)) * 100 : null;

  // ---------- Top clientes / proveedores ----------
  const byClient = new Map();
  for (const o of customerOrders || []) {
    const name = o.opportunities?.customers?.company_name || "Sin cliente";
    const total = (o.customer_order_items || []).reduce(
      (s, i) => s + (i.quantity || 0) * (i.unit_price || 0),
      0
    );
    byClient.set(name, (byClient.get(name) || 0) + total);
  }
  const topClients = [...byClient.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxClient = Math.max(1, ...topClients.map((c) => c[1]));

  const bySupplier = new Map();
  for (const o of supplierOrders || []) {
    const name = o.suppliers?.company_name || "Sin proveedor";
    const total = (o.supplier_order_items || []).reduce(
      (s, i) => s + (i.quantity || 0) * (i.unit_cost || 0),
      0
    );
    bySupplier.set(name, (bySupplier.get(name) || 0) + total);
  }
  const topSuppliers = [...bySupplier.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxSupplier = Math.max(1, ...topSuppliers.map((s) => s[1]));

  return (
    <div>
      <PageHeader title="Reportes" />

      <h2 className="text-sm font-semibold text-neutral-500">Rentabilidad</h2>
      <p className="mt-1 max-w-2xl text-xs text-neutral-400">
        Total vendido (órdenes de cliente) contra total comprado (órdenes a
        proveedor), sin cancelar — margen de la operación en conjunto, no por
        producto.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total vendido" value={money(revenue)} />
        <StatCard label="Total comprado" value={money(cost)} />
        <StatCard
          label="Margen bruto"
          value={money(margin)}
          hint={marginPct != null ? `${marginPct.toFixed(1)}% de margen` : "Sin ventas todavía"}
        />
      </div>

      <h2 className="mt-10 text-sm font-semibold text-neutral-500">
        Embudo de oportunidades
      </h2>
      {!opportunities?.length ? (
        <div className="mt-3">
          <EmptyState
            title="Todavía no hay oportunidades"
            description="El embudo se llena conforme se crean operaciones."
          />
        </div>
      ) : (
        <div className="mt-3 rounded-lg border border-neutral-200 bg-white p-6">
          <div className="stack space-y-4">
            {funnel.map((f) => (
              <BarRow
                key={f.status}
                label={f.label}
                value={f.count}
                max={maxFunnelCount}
                formatted={`${f.count} · ${money(f.value)}`}
                color={f.color}
              />
            ))}
          </div>
          <p className="mt-5 border-t border-neutral-100 pt-4 text-sm text-neutral-500">
            Tasa de cierre ganado:{" "}
            <span className="font-semibold text-neutral-900">
              {winRate != null ? `${winRate.toFixed(0)}%` : "— (sin cierres todavía)"}
            </span>
          </p>
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-neutral-500">
            Top clientes por venta
          </h2>
          {!topClients.length ? (
            <div className="mt-3">
              <EmptyState
                title="Sin ventas confirmadas"
                description="Aparece en cuanto se confirme una orden de cliente."
              />
            </div>
          ) : (
            <div className="mt-3 space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
              {topClients.map(([name, total]) => (
                <BarRow
                  key={name}
                  label={name}
                  value={total}
                  max={maxClient}
                  formatted={money(total)}
                  color="#d71920"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-neutral-500">
            Top proveedores por compra
          </h2>
          {!topSuppliers.length ? (
            <div className="mt-3">
              <EmptyState
                title="Sin compras confirmadas"
                description="Aparece en cuanto se confirme una orden a proveedor."
              />
            </div>
          ) : (
            <div className="mt-3 space-y-4 rounded-lg border border-neutral-200 bg-white p-6">
              {topSuppliers.map(([name, total]) => (
                <BarRow
                  key={name}
                  label={name}
                  value={total}
                  max={maxSupplier}
                  formatted={money(total)}
                  color="#d71920"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
