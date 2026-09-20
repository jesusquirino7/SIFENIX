import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EmptyState from "@/components/app/EmptyState";
import Badge from "@/components/app/Badge";
import { getDeliveryHealth } from "@/components/app/statusColors";

const TIPOS = [
  { value: "cotizacion", label: "Cotizaciones" },
  { value: "rfq", label: "RFQ" },
  { value: "orden-cliente", label: "Órdenes de Cliente" },
  { value: "orden-proveedor", label: "Órdenes a Proveedor" },
];

const TONE_RANK = { red: 0, amber: 1, blue: 2, gray: 3 };

function buildItems({ quotations, rfqs, customerOrders, supplierOrders }) {
  const today = new Date().toISOString().slice(0, 10);
  const items = [];

  for (const q of quotations || []) {
    if (q.status === "draft") {
      items.push({
        key: `cot-${q.id}`,
        tipo: "cotizacion",
        tipoLabel: "Cotización",
        href: `/app/cotizaciones/${q.id}`,
        folio: q.quotation_number,
        party: q.opportunities?.customers?.company_name,
        operation: q.opportunities?.opportunity_number,
        tone: "gray",
        label: "Sin enviar",
        date: null,
      });
    } else if (q.status === "sent") {
      const overdue = q.valid_until && q.valid_until < today;
      items.push({
        key: `cot-${q.id}`,
        tipo: "cotizacion",
        tipoLabel: "Cotización",
        href: `/app/cotizaciones/${q.id}`,
        folio: q.quotation_number,
        party: q.opportunities?.customers?.company_name,
        operation: q.opportunities?.opportunity_number,
        tone: overdue ? "red" : "blue",
        label: overdue ? "Vencida sin marcar" : "Esperando respuesta",
        date: q.valid_until,
      });
    }
  }

  for (const r of rfqs || []) {
    if (r.status === "draft") {
      items.push({
        key: `rfq-${r.id}`,
        tipo: "rfq",
        tipoLabel: "RFQ",
        href: `/app/rfq-proveedores/${r.id}`,
        folio: r.rfq_number,
        party: r.suppliers?.company_name,
        operation: r.opportunities?.opportunity_number,
        tone: "gray",
        label: "Sin enviar",
        date: null,
      });
    } else if (r.status === "sent") {
      items.push({
        key: `rfq-${r.id}`,
        tipo: "rfq",
        tipoLabel: "RFQ",
        href: `/app/rfq-proveedores/${r.id}`,
        folio: r.rfq_number,
        party: r.suppliers?.company_name,
        operation: r.opportunities?.opportunity_number,
        tone: "blue",
        label: "Esperando respuesta",
        date: r.sent_at?.slice(0, 10) || null,
      });
    }
  }

  for (const o of customerOrders || []) {
    items.push({
      key: `oc-${o.id}`,
      tipo: "orden-cliente",
      tipoLabel: "Orden de Cliente",
      href: `/app/ordenes-cliente/${o.id}`,
      folio: o.order_number,
      party: o.opportunities?.customers?.company_name,
      operation: o.opportunities?.opportunity_number,
      tone: "amber",
      label: o.status === "in_process" ? "En proceso" : "Confirmada, en curso",
      date: null,
    });
  }

  for (const o of supplierOrders || []) {
    const health = getDeliveryHealth(o);
    items.push({
      key: `ocp-${o.id}`,
      tipo: "orden-proveedor",
      tipoLabel: "Orden a Proveedor",
      href: `/app/ordenes-proveedor/${o.id}`,
      folio: o.order_number,
      party: o.suppliers?.company_name,
      operation: o.opportunities?.opportunity_number,
      tone: health?.color || "blue",
      label: health?.label || "En curso",
      date: o.expected_delivery_date,
    });
  }

  return items.sort((a, b) => {
    const rankDiff = (TONE_RANK[a.tone] ?? 9) - (TONE_RANK[b.tone] ?? 9);
    if (rankDiff !== 0) return rankDiff;
    if (a.date && b.date) return a.date < b.date ? -1 : 1;
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });
}

export default async function SeguimientoPage({ searchParams }) {
  const sp = await searchParams;
  const tipoFiltro = sp?.tipo || "";
  const q = (sp?.q || "").trim().toLowerCase();

  const supabase = await createClient();

  const [
    { data: quotations },
    { data: rfqs },
    { data: customerOrders },
    { data: supplierOrders },
  ] = await Promise.all([
    supabase
      .from("quotations")
      .select("id, quotation_number, status, valid_until, opportunities(opportunity_number, customers(company_name))")
      .in("status", ["draft", "sent"]),
    supabase
      .from("rfqs")
      .select("id, rfq_number, status, sent_at, suppliers(company_name), opportunities(opportunity_number)")
      .in("status", ["draft", "sent"]),
    supabase
      .from("customer_orders")
      .select("id, order_number, status, opportunities(opportunity_number, customers(company_name))")
      .in("status", ["confirmed", "in_process"]),
    supabase
      .from("supplier_orders")
      .select("id, order_number, status, expected_delivery_date, suppliers(company_name), opportunities(opportunity_number)")
      .in("status", ["confirmed", "in_process"]),
  ]);

  const allItems = buildItems({ quotations, rfqs, customerOrders, supplierOrders });

  const counts = TIPOS.reduce((acc, t) => {
    acc[t.value] = allItems.filter((i) => i.tipo === t.value).length;
    return acc;
  }, {});

  let items = tipoFiltro ? allItems.filter((i) => i.tipo === tipoFiltro) : allItems;
  if (q) {
    items = items.filter((i) =>
      [i.folio, i.party, i.operation].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }

  function pillHref(tipo) {
    const params = new URLSearchParams();
    if (tipo) params.set("tipo", tipo);
    if (q) params.set("q", q);
    const qs = params.toString();
    return qs ? `/app/seguimiento?${qs}` : "/app/seguimiento";
  }

  return (
    <div>
      <PageHeader
        title="Seguimiento"
        breadcrumbs={[]}
      />
      <p className="mb-4 max-w-2xl text-sm text-neutral-500">
        Todo lo que sigue en curso en el sistema — {allItems.length} pendiente
        {allItems.length === 1 ? "" : "s"} en total.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={pillHref("")}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
            !tipoFiltro
              ? "border-[var(--brand-red)] bg-[var(--brand-red)]/10 text-[var(--brand-red)]"
              : "border-neutral-300 text-neutral-600 hover:border-neutral-400"
          }`}
        >
          Todos ({allItems.length})
        </Link>
        {TIPOS.map((t) => (
          <Link
            key={t.value}
            href={pillHref(t.value)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
              tipoFiltro === t.value
                ? "border-[var(--brand-red)] bg-[var(--brand-red)]/10 text-[var(--brand-red)]"
                : "border-neutral-300 text-neutral-600 hover:border-neutral-400"
            }`}
          >
            {t.label} ({counts[t.value]})
          </Link>
        ))}

        <form method="GET" className="ml-auto flex items-center gap-2">
          {tipoFiltro && <input type="hidden" name="tipo" value={tipoFiltro} />}
          <input
            type="search"
            name="q"
            defaultValue={sp?.q || ""}
            placeholder="Buscar cliente, proveedor o folio…"
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm focus:border-[var(--brand-red)] focus:outline-none"
          />
        </form>
      </div>

      <div className="mt-6">
        {!items.length ? (
          <EmptyState
            title="Nada pendiente con este filtro"
            description="Prueba con otro tipo de documento o borra la búsqueda."
          />
        ) : (
          <div className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-white">
            {items.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm hover:bg-neutral-50"
              >
                <span className="w-32 shrink-0 text-xs font-medium uppercase tracking-wide text-neutral-400">
                  {item.tipoLabel}
                </span>
                <span className="font-medium text-neutral-900">{item.folio}</span>
                <span className="text-neutral-600">{item.party || "—"}</span>
                {item.operation && (
                  <span className="text-xs text-neutral-400">{item.operation}</span>
                )}
                <span className="ml-auto flex items-center gap-3">
                  {item.date && (
                    <span className="text-xs text-neutral-400">{item.date}</span>
                  )}
                  <Badge color={item.tone}>{item.label}</Badge>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
