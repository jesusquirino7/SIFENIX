-- =========================================================
-- SIFENIX · Sistema interno — Etapa 1: infraestructura base
-- Ejecutar completo en: Supabase Dashboard > SQL Editor > New query
-- =========================================================

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ---------- función utilitaria: updated_at automático ----------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =========================================================
-- profiles
-- =========================================================
create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null default 'sales'
    check (role in ('super_admin', 'admin', 'sales', 'purchasing', 'operations')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

-- Crea automáticamente un profile (role 'sales' por defecto) cuando alguien
-- se registra en Supabase Auth. El primer super_admin se promueve a mano
-- desde Table Editor > profiles > role, una sola vez.
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email), new.email);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Helper de RLS: ¿el usuario autenticado es un empleado activo?
-- security definer para evitar recursión al consultar profiles desde sus
-- propias policies.
create or replace function is_active_employee()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and active = true
  );
$$ language sql stable security definer set search_path = public;

-- =========================================================
-- customers / customer_contacts
-- =========================================================
create table customers (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  tax_id text,
  industry text,
  phone text,
  email text,
  website text,
  address text,
  city text,
  state text,
  country text,
  postal_code text,
  notes text,
  active boolean not null default true,
  created_by uuid references profiles(id),
  updated_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_customers_updated_at before update on customers
  for each row execute function set_updated_at();

create table customer_contacts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  name text not null,
  position text,
  email text,
  phone text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_customer_contacts_updated_at before update on customer_contacts
  for each row execute function set_updated_at();
create index idx_customer_contacts_customer on customer_contacts(customer_id);

-- =========================================================
-- suppliers / supplier_contacts
-- =========================================================
create table suppliers (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  tax_id text,
  phone text,
  email text,
  website text,
  address text,
  city text,
  state text,
  country text,
  postal_code text,
  notes text,
  active boolean not null default true,
  created_by uuid references profiles(id),
  updated_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_suppliers_updated_at before update on suppliers
  for each row execute function set_updated_at();

create table supplier_contacts (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references suppliers(id) on delete cascade,
  name text not null,
  position text,
  email text,
  phone text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_supplier_contacts_updated_at before update on supplier_contacts
  for each row execute function set_updated_at();
create index idx_supplier_contacts_supplier on supplier_contacts(supplier_id);

-- =========================================================
-- products
-- =========================================================
create table products (
  id uuid primary key default gen_random_uuid(),
  part_number text not null,
  manufacturer text,
  description text,
  category text,
  unit text,
  default_cost numeric(12, 2),
  default_price numeric(12, 2),
  currency text not null default 'MXN',
  active boolean not null default true,
  created_by uuid references profiles(id),
  updated_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_products_updated_at before update on products
  for each row execute function set_updated_at();
create unique index idx_products_part_number_manufacturer
  on products (part_number, coalesce(manufacturer, ''));

-- =========================================================
-- opportunities (con numeración automática OP-2026-00001)
-- =========================================================
create sequence opportunity_number_seq;

create or replace function generate_opportunity_number()
returns trigger as $$
begin
  if new.opportunity_number is null then
    new.opportunity_number := 'OP-' || to_char(now(), 'YYYY') || '-' ||
      lpad(nextval('opportunity_number_seq')::text, 5, '0');
  end if;
  return new;
end;
$$ language plpgsql;

create table opportunities (
  id uuid primary key default gen_random_uuid(),
  opportunity_number text unique,
  customer_id uuid not null references customers(id),
  name text not null,
  description text,
  status text not null default 'open'
    check (status in ('open', 'quoting', 'won', 'lost', 'cancelled')),
  owner_id uuid references profiles(id),
  estimated_value numeric(14, 2),
  currency text not null default 'MXN',
  expected_close_date date,
  created_by uuid references profiles(id),
  updated_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_opportunities_number before insert on opportunities
  for each row execute function generate_opportunity_number();
create trigger trg_opportunities_updated_at before update on opportunities
  for each row execute function set_updated_at();
create index idx_opportunities_customer on opportunities(customer_id);
create index idx_opportunities_status on opportunities(status);

-- =========================================================
-- opportunity_items
-- Productos que el cliente pidió cotizar dentro de una oportunidad.
-- product_id es opcional: permite capturar un part number que todavía no
-- existe en el catálogo `products`.
-- =========================================================
create table opportunity_items (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  product_id uuid references products(id),
  part_number text,
  manufacturer text,
  description text,
  quantity numeric(12, 2) not null default 1,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_opportunity_items_updated_at before update on opportunity_items
  for each row execute function set_updated_at();
create index idx_opportunity_items_opportunity on opportunity_items(opportunity_id);

-- =========================================================
-- audit_log
-- Esqueleto para auditoría (quién/cuándo/qué cambió). Todavía no se conecta
-- con triggers automáticos en las demás tablas — eso se activa en una etapa
-- posterior sin tener que cambiar este esquema.
-- =========================================================
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id uuid not null,
  action text not null check (action in ('insert', 'update', 'delete', 'status_change')),
  changed_by uuid references profiles(id),
  changed_at timestamptz not null default now(),
  old_data jsonb,
  new_data jsonb
);
create index idx_audit_log_record on audit_log(table_name, record_id);

-- =========================================================
-- Row Level Security
-- Etapa 1: cualquier empleado activo (profiles.active = true) puede leer y
-- escribir en todas las tablas operativas. La restricción por `role` se
-- agrega en una etapa posterior reemplazando estas policies, sin tocar
-- el esquema ni los datos.
-- =========================================================
alter table profiles enable row level security;
alter table customers enable row level security;
alter table customer_contacts enable row level security;
alter table suppliers enable row level security;
alter table supplier_contacts enable row level security;
alter table products enable row level security;
alter table opportunities enable row level security;
alter table opportunity_items enable row level security;
alter table audit_log enable row level security;

create policy "profiles: select empleados activos" on profiles
  for select using (is_active_employee());
create policy "profiles: update propio perfil" on profiles
  for update using (user_id = auth.uid());

create policy "customers: acceso empleados activos" on customers
  for all using (is_active_employee()) with check (is_active_employee());
create policy "customer_contacts: acceso empleados activos" on customer_contacts
  for all using (is_active_employee()) with check (is_active_employee());
create policy "suppliers: acceso empleados activos" on suppliers
  for all using (is_active_employee()) with check (is_active_employee());
create policy "supplier_contacts: acceso empleados activos" on supplier_contacts
  for all using (is_active_employee()) with check (is_active_employee());
create policy "products: acceso empleados activos" on products
  for all using (is_active_employee()) with check (is_active_employee());
create policy "opportunities: acceso empleados activos" on opportunities
  for all using (is_active_employee()) with check (is_active_employee());
create policy "opportunity_items: acceso empleados activos" on opportunity_items
  for all using (is_active_employee()) with check (is_active_employee());
create policy "audit_log: lectura empleados activos" on audit_log
  for select using (is_active_employee());
