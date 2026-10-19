import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import StatCard from "@/components/app/StatCard";
import EmptyState from "@/components/app/EmptyState";
import { OPPORTUNITY_STATUS } from "@/components/app/statusColors";
import { SALE_ENTITIES, saleEntityLabel } from "@/components/app/saleEntity";

// Reportes incluye datos de pagos, facturas y margenes — el dueño
// pidio que ventas no pueda entrar aqui (si al resto de roles).

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

function sumRevenue(customerOrders) {
  return (customerOrders || []).reduce(
    (sum, o) =>
      sum +
      (o.customer_order_items || []).reduce(
        (s, i) => s + (i.quantity || 0) * (i.unit_price || 0),
        0
      ),
    0
  );
}

function sumCost(supplierOrders) {
  return (supplierOrders || []).reduce(
    (sum, o) =>
      sum +
      (o.supplier_order_items || []).reduce(
        (s, i) => s + (i.quantity || 0) * (i.unit_cost || 0),
        0
      ),
    0
  );
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

export default async function ReportesPage({ searchParams }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: myProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (myProfile?.role === "sales") {
    return (
      <div>
        <PageHeader title="Reportes" />
        <EmptyState
          title="No autorizado"
          description="Los reportes de rentabilidad, pagos y facturas no están disponibles para el rol de ventas."
        />
      </div>
    );
  }

  const sp = await searchParams;
  const ventaFiltro = sp?.venta || "";

  const [{ data: opportunities }, { data: customerOrders }, { data: supplierOrders }] =
    await Promise.all([
      supabase.from("opportunities").select("status, estimated_value, sale_entity"),
      supabase
        .from("customer_orders")
        .select(
          "status, currency, opportunities(customers(company_name), sale_entity), customer_order_items(quantity, unit_price)"
        )
        .neq("status", "cancelled"),
      supabase
        .from("supplier_orders")
        .select(
          "status, currency, suppliers(company_name), opportunities(sale_entity), supplier_order_items(quantity, unit_cost)"
        )
        .neq("status", "cancelled"),
    ]);

  function pillHref(venta) {
    const params = new URLSearchParams();
    if (venta) params.set("venta", venta);
    const qs = params.toString();
    return qs ? `/app/reportes?${qs}` : "/app/reportes";
  }

  // ---------- Rentabilidad consolidada + desglose por entidad (no
  // respeta el filtro de pills - siempre se ve el total y el desglose
  // juntos, segun lo pedido: "totales consolidados + desglose"). ----------
  const breakdown = SALE_ENTITIES.map((entity) => {
    const entityOrders = (customerOrders || []).filter(
      (o) => o.opportunities?.sale_entity === entity.value
    );
    const entitySupplierOrders = (supplierOrders || []).filter(
      (o) => o.opportunities?.sale_entity === entity.value
    );
    const rev = sumRevenue(entityOrders);
    const cst = sumCost(entitySupplierOrders);
    return { ...entity, revenue: rev, cost: cst, margin: rev - cst };
  });
  const consolidatedRevenue = sumRevenue(customerOrders);
  const consolidatedCost = sumCost(supplierOrders);

  // ---------- A partir de aqui, todo respeta el filtro de pills ----------
  const filteredOpportunities = ventaFiltro
    ? (opportunities || []).filter((o) => o.sale_entity === ventaFiltro)
    : opportunities;
  const filteredCustomerOrders = ventaFiltro
    ? (customerOrders || []).filter((o) => o.opportunities?.sale_entity === ventaFiltro)
    : customerOrders;
  const filteredSupplierOrders = ventaFiltro
    ? (supplierOrders || []).filter((o) => o.opportunities?.sale_entity === ventaFiltro)
    : supplierOrders;

  const revenue = sumRevenue(filteredCustomerOrders);
  const cost = sumCost(filteredSupplierOrders);
  const margin = revenue - cost;
  const marginPct = revenue > 0 ? (margin / revenue) * 100 : null;

  // ---------- Embudo de oportunidades ----------
  const funnel = Object.keys(OPPORTUNITY_STATUS).map((status) => {
    const rows = (filteredOpportunities || []).filter((o) => o.status === status);
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
  for (const o of filteredCustomerOrders || []) {
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
  for (const o of filteredSupplierOrders || []) {
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

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={pillHref("")}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
            !ventaFiltro
              ? "border-[var(--brand-red)] bg-[var(--brand-red)]/10 text-[var(--brand-red)]"
              : "border-neutral-300 text-neutral-600 hover:border-neutral-400"
          }`}
        >
          Todos (consolidado)
        </Link>
        {SALE_ENTITIES.map((e) => (
          <Link
            key={e.value}
            href={pillHref(e.value)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
              ventaFiltro === e.value
                ? "border-[var(--brand-red)] bg-[var(--brand-red)]/10 text-[var(--brand-red)]"
                : "border-neutral-300 text-neutral-600 hover:border-neutral-400"
            }`}
          >
            {e.label}
          </Link>
        ))}
      </div>
      <p className="mt-2 max-w-2xl text-xs text-neutral-400">
        El embudo, top clientes y top proveedores de abajo respetan este
        filtro. La rentabilidad por entidad (justo abajo) siempre muestra el
        consolidado y el desglose juntos.
      </p>

      <h2 className="mt-6 text-sm font-semibold text-neutral-500">
        Rentabilidad por entidad
      </h2>
      <div className="mt-3 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Entidad</th>
              <th className="px-4 py-3 font-medium">Vendido</th>
              <th className="px-4 py-3 font-medium">Comprado</th>
              <th className="px-4 py-3 font-medium">Margen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {breakdown.map((e) => (
              <tr key={e.value}>
                <td className="px-4 py-3 font-medium text-neutral-900">{e.label}</td>
                <td className="px-4 py-3 text-neutral-600">{money(e.revenue)}</td>
                <td className="px-4 py-3 text-neutral-600">{money(e.cost)}</td>
                <td className="px-4 py-3 text-neutral-600">{money(e.margin)}</td>
              </tr>
            ))}
            <tr className="bg-neutral-50 font-semibold text-neutral-900">
              <td className="px-4 py-3">Consolidado</td>
              <td className="px-4 py-3">{money(consolidatedRevenue)}</td>
              <td className="px-4 py-3">{money(consolidatedCost)}</td>
              <td className="px-4 py-3">{money(consolidatedRevenue - consolidatedCost)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-sm font-semibold text-neutral-500">
        Rentabilidad {ventaFiltro ? `— ${saleEntityLabel(ventaFiltro)}` : "— consolidada"}
      </h2>
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
      {!filteredOpportunities?.length ? (
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
