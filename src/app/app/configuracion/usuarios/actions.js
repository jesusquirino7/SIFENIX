"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const VALID_ROLES = ["super_admin", "admin", "sales", "purchasing", "operations"];

async function assertCallerIsSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "No hay sesión activa." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "super_admin" || !profile.active) {
    return { ok: false, error: "Solo un super_admin puede hacer esto." };
  }

  return { ok: true };
}

export async function inviteUser({ email, fullName, role }) {
  const guard = await assertCallerIsSuperAdmin();
  if (!guard.ok) return guard;

  if (!email?.trim()) {
    return { ok: false, error: "El correo es obligatorio." };
  }
  if (!VALID_ROLES.includes(role)) {
    return { ok: false, error: "Rol inválido." };
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email.trim(), {
    data: { full_name: fullName?.trim() || email.trim() },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  // El trigger handle_new_user() ya creo el profile con role 'sales' por
  // defecto - si se eligio otro rol al invitar, lo actualizamos.
  if (role !== "sales" && data.user) {
    const supabase = await createClient();
    await supabase.from("profiles").update({ role }).eq("user_id", data.user.id);
  }

  revalidatePath("/app/configuracion/usuarios");
  return { ok: true };
}
