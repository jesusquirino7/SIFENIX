-- =========================================================
-- SIFENIX · Sistema interno — Etapa 2: Cotizaciones a clientes
-- Ejecutar completo en: Supabase Dashboard > SQL Editor > New query
-- Requiere que 0001_sistema_interno_inicial.sql ya este aplicado
-- (usa set_updated_at() e is_active_employee() de esa migracion).
-- =========================================================

-- =========================================================
-- quotations
-- Una cotizacion siempre nace de una oportunidad (nunca aislada) -
-- ver src/app/app/oportunidades/[id]/cotizaciones/nueva.
-- =========================================================
create sequence quotation_number_seq;

create or replace function generate_quotation_number()
returns trigger as $$
begin
  if new.quotation_number is null then
    new.quotation_number := 'COT-' || to_char(now(), 'YYYY') || '-' ||
      lpad(nextval('quotation_number_seq')::text, 5, '0');
  end if;
  return new;
end;
$$ language plpgsql;

create table quotations (
  id uuid primary key default gen_random_uuid(),
  quotation_number text unique,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  valid_until date,
  notes text,
  currency text not null default 'MXN',
  created_by uuid references profiles(id),
  updated_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_quotations_number before insert on quotations
  for each row execute function generate_quotation_number();
create trigger trg_quotations_updated_at before update on quotations
  for each row execute function set_updated_at();
create index idx_quotations_opportunity on quotations(opportunity_id);
create index idx_quotations_status on quotations(status);

-- =========================================================
-- quotation_items
-- Lineas de la cotizacion, con el precio unitario que ya no vive en
-- opportunity_items (esa tabla es solo "que pidio cotizar el cliente",
-- sin precio). Se prellenan a partir de opportunity_items al crear la
-- cotizacion, pero viven independientes desde ahi.
-- =========================================================
create table quotation_items (
  id uuid primary key default gen_random_uuid(),
  quotation_id uuid not null references quotations(id) on delete cascade,
  product_id uuid references products(id),
  part_number text,
  manufacturer text,
  description text,
  quantity numeric(12, 2) not null default 1,
  unit_price numeric(12, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_quotation_items_updated_at before update on quotation_items
  for each row execute function set_updated_at();
create index idx_quotation_items_quotation on quotation_items(quotation_id);

-- =========================================================
-- Row Level Security (mismo criterio que la migracion 0001: cualquier
-- empleado activo tiene acceso completo por ahora)
-- =========================================================
alter table quotations enable row level security;
alter table quotation_items enable row level security;

create policy "quotations: acceso empleados activos" on quotations
  for all using (is_active_employee()) with check (is_active_employee());
create policy "quotation_items: acceso empleados activos" on quotation_items
  for all using (is_active_employee()) with check (is_active_employee());
