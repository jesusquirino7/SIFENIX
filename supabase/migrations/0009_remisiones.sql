-- =========================================================
-- SIFENIX · Sistema interno — Remisiones (entregas antes de OC formal)
-- Ejecutar completo en: Supabase Dashboard > SQL Editor > New query
-- Requiere que 0001 y 0005 (customer_orders) ya esten aplicadas.
-- =========================================================

-- =========================================================
-- remisiones
-- A veces el material ya esta en existencia y se entrega al cliente de
-- una vez, con solo una nota de remision - el proceso formal (cotizacion,
-- orden de cliente) se hace DESPUES. Por eso remisiones nace directo de
-- la oportunidad (no de una cotizacion/orden, que pueden no existir
-- todavia), y customer_order_id se llena despues, al "formalizarla".
-- =========================================================
create sequence remision_number_seq;

create or replace function generate_remision_number()
returns trigger as $$
begin
  if new.remision_number is null then
    new.remision_number := 'REM-' || to_char(now(), 'YYYY') || '-' ||
      lpad(nextval('remision_number_seq')::text, 5, '0');
  end if;
  return new;
end;
$$ language plpgsql;

create table remisiones (
  id uuid primary key default gen_random_uuid(),
  remision_number text unique,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  customer_order_id uuid references customer_orders(id),
  delivered_at date not null default current_date,
  notes text,
  status text not null default 'entregada'
    check (status in ('entregada', 'formalizada', 'cancelada')),
  created_by uuid references profiles(id),
  updated_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_remisiones_number before insert on remisiones
  for each row execute function generate_remision_number();
create trigger trg_remisiones_updated_at before update on remisiones
  for each row execute function set_updated_at();
create index idx_remisiones_opportunity on remisiones(opportunity_id);
create index idx_remisiones_customer_order on remisiones(customer_order_id);
create index idx_remisiones_status on remisiones(status);

-- =========================================================
-- remision_items
-- Sin precio a proposito: una remision es prueba de entrega fisica, no
-- un documento de cobro. Se prellenan desde opportunity_items al crear.
-- =========================================================
create table remision_items (
  id uuid primary key default gen_random_uuid(),
  remision_id uuid not null references remisiones(id) on delete cascade,
  product_id uuid references products(id),
  part_number text,
  manufacturer text,
  description text,
  quantity numeric(12, 2) not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_remision_items_updated_at before update on remision_items
  for each row execute function set_updated_at();
create index idx_remision_items_remision on remision_items(remision_id);

-- =========================================================
-- Row Level Security
-- =========================================================
alter table remisiones enable row level security;
alter table remision_items enable row level security;

create policy "remisiones: acceso empleados activos" on remisiones
  for all using (is_active_employee()) with check (is_active_employee());
create policy "remision_items: acceso empleados activos" on remision_items
  for all using (is_active_employee()) with check (is_active_employee());

-- =========================================================
-- attachments: agrega 'remision' como entity_type valido (ej. foto de
-- firma de recibido, PDF de la remision escaneada).
-- =========================================================
alter table attachments drop constraint attachments_entity_type_check;
alter table attachments add constraint attachments_entity_type_check
  check (entity_type in ('quotation', 'rfq', 'customer_order', 'supplier_order', 'remision'));
