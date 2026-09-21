import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/app/PageHeader";
import EmptyState from "@/components/app/EmptyState";
import UsuariosTable from "./UsuariosTable";
import InvitarUsuarioButton from "./InvitarUsuarioButton";

export default async function UsuariosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: myProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  const breadcrumbs = [
    { label: "Configuración", href: "/app/configuracion" },
    { label: "Usuarios" },
  ];

  if (myProfile?.role !== "super_admin") {
    return (
      <div>
        <PageHeader title="Usuarios" breadcrumbs={breadcrumbs} />
        <EmptyState
          title="No autorizado"
          description="Solo un super_admin puede ver y administrar usuarios."
        />
      </div>
    );
  }

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("full_name");

  return (
    <div>
      <PageHeader
        title="Usuarios"
        breadcrumbs={breadcrumbs}
        action={<InvitarUsuarioButton />}
      />
      <UsuariosTable profiles={profiles || []} currentUserId={user.id} />
    </div>
  );
}
