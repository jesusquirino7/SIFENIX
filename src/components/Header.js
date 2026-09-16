import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/marcas", label: "Marcas" },
  { href: "/oem", label: "OEM" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-horizontal-color.png"
            alt="SIFENIX — Servicios Industriales"
            className="h-9 w-auto"
          />
        </Link>
        <nav className="flex gap-6 text-sm font-medium text-neutral-600">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[var(--brand-red)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
