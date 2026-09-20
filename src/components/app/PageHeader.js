import Link from "next/link";

export default function PageHeader({ title, breadcrumbs = [], action }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="mb-1 flex flex-wrap items-center gap-1.5 text-xs text-neutral-400">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-1.5">
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-neutral-600">
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <span>/</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
      </div>
      {action}
    </div>
  );
}
