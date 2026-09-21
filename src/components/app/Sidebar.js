"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/leads", label: "Solicitudes del sitio" },
  { href: "/app/clientes", label: "Clientes" },
  { href: "/app/proveedores", label: "Proveedores" },
  { href: "/app/productos", label: "Productos" },
  { href: "/app/oportunidades", label: "Oportunidades" },
  { href: "/app/cotizaciones", label: "Cotizaciones" },
  { href: "/app/rfq-proveedores", label: "RFQ Proveedores" },
  { href: "/app/ordenes-cliente", label: "Órdenes de Cliente" },
  { href: "/app/ordenes-proveedor", label: "Órdenes a Proveedores" },
  { href: "/app/seguimiento", label: "Seguimiento" },
  { href: "/app/reportes", label: "Reportes" },
  { href: "/app/configuracion", label: "Configuración" },
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
        <ul className="space-y-0.5">
          {NAV.map((item) => {
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
