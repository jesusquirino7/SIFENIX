-- =========================================================
-- SIFENIX · Sistema interno — Leads del formulario de contacto publico
-- Ejecutar completo en: Supabase Dashboard > SQL Editor > New query
-- Requiere que 0001 ya este aplicada (usa set_updated_at() e
-- is_active_employee()).
-- =========================================================

-- =========================================================
-- leads
-- Cada envio de /contacto (sitio publico) crea un renglon aqui. Es la
-- UNICA tabla en todo el sistema con INSERT publico (sin sesion) -
-- todo lo demas requiere ser empleado activo. opportunity_id queda
-- preparado para cuando un empleado convierta el lead en una
-- oportunidad real (Clientes/Oportunidades), pero esa conversion es
-- manual por ahora, no automatica.
-- =========================================================
create table leads (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  empresa text,
  correo text not null,
  telefono text,
  interes text,
  mensaje text,
  origen text not null default 'sitio web',
  estatus text not null default 'nuevo'
    check (estatus in ('nuevo', 'contactado', 'convertido', 'descartado')),
  opportunity_id uuid references opportunities(id),
  updated_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_leads_updated_at before update on leads
  for each row execute function set_updated_at();
create index idx_leads_estatus on leads(estatus);

alter table leads enable row level security;

-- Cualquier visitante (sin sesion) puede crear un lead - es el buzón de
-- entrada del sitio publico. No puede leer, actualizar ni borrar nada.
create policy "leads: cualquiera puede enviar" on leads
  for insert with check (true);

-- Solo empleados activos pueden ver y dar seguimiento.
create policy "leads: empleados activos gestionan" on leads
  for select using (is_active_employee());
create policy "leads: empleados activos actualizan" on leads
  for update using (is_active_employee());
