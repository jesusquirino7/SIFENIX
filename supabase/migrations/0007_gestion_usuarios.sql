-- =========================================================
-- SIFENIX · Sistema interno — Gestion de usuarios (roles y permisos)
-- Ejecutar completo en: Supabase Dashboard > SQL Editor > New query
-- Requiere que 0001 ya este aplicada.
-- =========================================================

-- Helper de RLS: ¿el usuario autenticado es super_admin?
-- security definer, mismo criterio que is_active_employee().
create or replace function is_super_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and active = true and role = 'super_admin'
  );
$$ language sql stable security definer set search_path = public;

-- Hasta ahora la unica policy de UPDATE en profiles dejaba a cada quien
-- editar solo su propio registro (profiles: update propio perfil, de la
-- migracion 0001). Esta la complementa: un super_admin activo puede
-- actualizar el perfil de cualquiera (para cambiar role o active).
create policy "profiles: super_admin actualiza cualquiera" on profiles
  for update using (is_super_admin());
