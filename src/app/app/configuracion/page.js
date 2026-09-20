import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import Badge from "@/components/app/Badge";

export default async function ConfiguracionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <div>
      <PageHeader title="Configuración" />
      <div className="max-w-lg rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-neutral-500">Mi cuenta</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-neutral-500">Nombre</dt>
            <dd className="font-medium text-neutral-900">
              {profile?.full_name || "—"}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-neutral-500">Correo</dt>
            <dd className="font-medium text-neutral-900">
              {profile?.email || user.email}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-neutral-500">Rol</dt>
            <dd>
              <Badge color="red">
                {profile?.role?.replace("_", " ") || "—"}
              </Badge>
            </dd>
          </div>
        </dl>
        <p className="mt-6 text-xs text-neutral-400">
          La gestión de usuarios y permisos por rol se agrega en una etapa
          posterior. Por ahora, los roles se asignan directamente en el Table
          Editor de Supabase (tabla <code>profiles</code>).
        </p>
      </div>
    </div>
  );
}
