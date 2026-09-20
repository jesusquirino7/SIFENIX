-- =========================================================
-- SIFENIX · Sistema interno — Etapa 3: RFQ y cotizaciones de proveedores
-- Ejecutar completo en: Supabase Dashboard > SQL Editor > New query
-- Requiere que 0001_sistema_interno_inicial.sql ya este aplicado
-- (usa set_updated_at() e is_active_employee()).
-- =========================================================

-- =========================================================
-- rfqs
-- Una RFQ (solicitud de cotizacion) siempre nace de una oportunidad y
-- va dirigida a UN proveedor especifico - una oportunidad puede tener
-- varias RFQ (una por proveedor) para poder comparar despues (Etapa 4).
-- =========================================================
create sequence rfq_number_seq;

create or replace function generate_rfq_number()
returns trigger as $$
begin
  if new.rfq_number is null then
    new.rfq_number := 'RFQ-' || to_char(now(), 'YYYY') || '-' ||
      lpad(nextval('rfq_number_seq')::text, 5, '0');
  end if;
  return new;
end;
$$ language plpgsql;

create table rfqs (
  id uuid primary key default gen_random_uuid(),
  rfq_number text unique,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  supplier_id uuid not null references suppliers(id),
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'responded', 'expired')),
  sent_at timestamptz,
  responded_at timestamptz,
  notes text,
  created_by uuid references profiles(id),
  updated_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_rfqs_number before insert on rfqs
  for each row execute function generate_rfq_number();
create trigger trg_rfqs_updated_at before update on rfqs
  for each row execute function set_updated_at();
create index idx_rfqs_opportunity on rfqs(opportunity_id);
create index idx_rfqs_supplier on rfqs(supplier_id);
create index idx_rfqs_status on rfqs(status);

-- =========================================================
-- rfq_items
-- Se prellenan desde opportunity_items al crear la RFQ (solo part
-- number/descripcion/cantidad - lo que se le pide al proveedor).
-- supplier_unit_cost y supplier_lead_time_days se llenan despues,
-- cuando el proveedor responde - por eso viven editables en el
-- detalle de la RFQ, no solo al crearla.
-- =========================================================
create table rfq_items (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references rfqs(id) on delete cascade,
  product_id uuid references products(id),
  part_number text,
  manufacturer text,
  description text,
  quantity numeric(12, 2) not null default 1,
  supplier_unit_cost numeric(12, 2),
  supplier_lead_time_days integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_rfq_items_updated_at before update on rfq_items
  for each row execute function set_updated_at();
create index idx_rfq_items_rfq on rfq_items(rfq_id);

-- =========================================================
-- Row Level Security (mismo criterio que el resto: cualquier empleado
-- activo tiene acceso completo por ahora)
-- =========================================================
alter table rfqs enable row level security;
alter table rfq_items enable row level security;

create policy "rfqs: acceso empleados activos" on rfqs
  for all using (is_active_employee()) with check (is_active_employee());
create policy "rfq_items: acceso empleados activos" on rfq_items
  for all using (is_active_employee()) with check (is_active_employee());
