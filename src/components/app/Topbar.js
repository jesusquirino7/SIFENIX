import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default function Topbar({ profile }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 lg:px-6">
      <Link
        href="/app/dashboard"
        className="text-base font-semibold tracking-tight lg:hidden"
      >
        SI<span className="text-[var(--brand-red)]">FENIX</span>
      </Link>
      <div className="ml-auto flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-neutral-800">
            {profile?.full_name || profile?.email || "Usuario"}
          </p>
          <p className="text-xs capitalize text-neutral-400">
            {profile?.role?.replace("_", " ") || ""}
          </p>
        </div>
        <SignOutButton />
      </div>
    </header>
  );
}
