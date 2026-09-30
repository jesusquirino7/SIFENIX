"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Agrupado por lo que se usa día a día (el proceso comercial) primero,
// catálogos de referencia después — antes iba todo en una sola lista
// alfabética/por tipo y Oportunidades (el punto de partida de cada
// operación) quedaba enterrada a la mitad.
const NAV_GROUPS = [
  {
    label: null,
    items: [
      { href: "/app/dashboard", label: "Dashboard" },
      { href: "/app/leads", label: "Solicitudes del sitio" },
    ],
  },
  {
    label: "Operación",
    items: [
      { href: "/app/oportunidades", label: "Oportunidades" },
      { href: "/app/cotizaciones", label: "Cotizaciones" },
      { href: "/app/rfq-proveedores", label: "RFQ Proveedores" },
      { href: "/app/ordenes-cliente", label: "Órdenes de Cliente" },
      { href: "/app/ordenes-proveedor", label: "Órdenes a Proveedores" },
      { href: "/app/remisiones", label: "Remisiones" },
    ],
  },
  {
    label: null,
    items: [
      { href: "/app/seguimiento", label: "Seguimiento" },
      { href: "/app/reportes", label: "Reportes" },
    ],
  },
  {
    label: "Catálogos",
    items: [
      { href: "/app/clientes", label: "Clientes" },
      { href: "/app/proveedores", label: "Proveedores" },
      { href: "/app/productos", label: "Productos" },
    ],
  },
  {
    label: null,
    items: [{ href: "/app/configuracion", label: "Configuración" }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-neutral-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-neutral-200 px-5">
        <Link
          href="/app/dashboard"
          className="text-lg font-semibold tracking-tight"
        >
          SI<span className="text-[var(--brand-red)]">FENIX</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group, groupIndex) => (
          <div key={group.label || groupIndex} className={groupIndex > 0 ? "mt-4" : ""}>
            {group.label && (
              <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-[var(--brand-red)]/10 text-[var(--brand-red)]"
                          : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-neutral-200 px-5 py-4">
        <Link
          href="/"
          className="text-xs font-medium text-neutral-400 hover:text-neutral-600"
        >
          ← Volver al sitio público
        </Link>
      </div>
    </aside>
  );
}
