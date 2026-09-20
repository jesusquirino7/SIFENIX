import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import StatCard from "@/components/app/StatCard";
import EmptyState from "@/components/app/EmptyState";
import Badge from "@/components/app/Badge";

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    opportunitiesResult,
    customersResult,
    suppliersResult,
    quotationsSentResult,
    rfqsSentResult,
    quotationsAwaiting,
    rfqsAwaiting,
    supplierOrdersOpen,
  ] = await Promise.all([
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
    supabase
      .from("quotations")
      .select("id", { count: "exact", head: true })
      .eq("status", "sent"),
    supabase
      .from("rfqs")
      .select("id", { count: "exact", head: true })
      .eq("status", "sent"),
    supabase
      .from("quotations")
      .select(
        "id, quotation_number, valid_until, opportunities(customers(company_name))"
      )
      .eq("status", "sent")
      .order("valid_until", { ascending: true, nullsFirst: false }),
    supabase
      .from("rfqs")
      .select("id, rfq_number, sent_at, suppliers(company_name)")
      .eq("status", "sent")
      .order("sent_at", { ascending: true, nullsFirst: false }),
    supabase
      .from("supplier_orders")
      .select("id, order_number, expected_delivery_date, suppliers(company_name)")
      .in("status", ["confirmed", "in_process"]),
  ]);

  const today = new Date().toISOString().slice(0, 10);

  const attention = [
    ...(quotationsAwaiting.data || []).map((q) => ({
      key: `q-${q.id}`,
      href: `/app/cotizaciones/${q.id}`,
      title: q.quotation_number,
      subtitle: q.opportunities?.customers?.company_name,
      badge: "Cotización esperando respuesta",
      badgeColor: "blue",
      note: q.valid_until && `Vence ${q.valid_until}`,
    })),
    ...(rfqsAwaiting.data || []).map((r) => ({
      key: `r-${r.id}`,
      href: `/app/rfq-proveedores/${r.id}`,
      title: r.rfq_number,
      subtitle: r.suppliers?.company_name,
      badge: "RFQ sin respuesta",
      badgeColor: "amber",
    })),
    ...(supplierOrdersOpen.data || [])
      .filter((o) => o.expected_delivery_date && o.expected_delivery_date < today)
      .map((o) => ({
        key: `o-${o.id}`,
        href: `/app/ordenes-proveedor/${o.id}`,
        title: o.order_number,
        subtitle: o.suppliers?.company_name,
        badge: "Orden de proveedor atrasada",
        badgeColor: "red",
        note: `Se esperaba el ${o.expected_delivery_date}`,
      })),
  ];

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
          label="Cotizaciones enviadas"
          value={quotationsSentResult.count ?? 0}
          hint="Esperando respuesta del cliente"
        />
        <StatCard
          label="RFQ enviadas"
          value={rfqsSentResult.count ?? 0}
          hint="Esperando respuesta del proveedor"
        />
        <StatCard label="Clientes activos" value={customersResult.count ?? 0} />
        <StatCard
          label="Proveedores activos"
          value={suppliersResult.count ?? 0}
        />
        <StatCard
          label="Requiere atención"
          value={attention.length}
          hint="Ver detalle abajo"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight text-neutral-900">
          Requiere atención
        </h2>
        <div className="mt-3">
          {!attention.length ? (
            <EmptyState
              title="Todavía no hay nada pendiente de revisar"
              description="Cotizaciones y RFQ enviadas esperando respuesta, y órdenes de proveedor atrasadas van a aparecer aquí."
            />
          ) : (
            <div className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-white">
              {attention.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-neutral-50"
                >
                  <div>
                    <span className="font-medium text-neutral-900">
                      {item.title}
                    </span>
                    <span className="ml-2 text-neutral-500">
                      {item.subtitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.note && (
                      <span className="text-xs text-neutral-400">
                        {item.note}
                      </span>
                    )}
                    <Badge color={item.badgeColor}>{item.badge}</Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
