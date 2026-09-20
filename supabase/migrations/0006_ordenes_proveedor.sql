-- =========================================================
-- SIFENIX · Sistema interno — Etapa 6: Ordenes de compra a proveedores
-- Ejecutar completo en: Supabase Dashboard > SQL Editor > New query
-- Requiere que 0001 y 0004 (rfqs) ya esten aplicadas.
-- =========================================================

-- =========================================================
-- supplier_orders
-- Confirma la decision del comparativo: siempre nace desde una RFQ
-- respondida (rfq_id) y hereda su oportunidad y proveedor.
-- =========================================================
create sequence supplier_order_number_seq;

create or replace function generate_supplier_order_number()
returns trigger as $$
begin
  if new.order_number is null then
    new.order_number := 'OCP-' || to_char(now(), 'YYYY') || '-' ||
      lpad(nextval('supplier_order_number_seq')::text, 5, '0');
  end if;
  return new;
end;
$$ language plpgsql;

create table supplier_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  rfq_id uuid references rfqs(id),
  supplier_id uuid not null references suppliers(id),
  status text not null default 'confirmed'
    check (status in ('confirmed', 'in_process', 'received', 'cancelled')),
  expected_delivery_date date,
  currency text not null default 'MXN',
  notes text,
  created_by uuid references profiles(id),
  updated_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_supplier_orders_number before insert on supplier_orders
  for each row execute function generate_supplier_order_number();
create trigger trg_supplier_orders_updated_at before update on supplier_orders
  for each row execute function set_updated_at();
create index idx_supplier_orders_opportunity on supplier_orders(opportunity_id);
create index idx_supplier_orders_rfq on supplier_orders(rfq_id);
create index idx_supplier_orders_supplier on supplier_orders(supplier_id);
create index idx_supplier_orders_status on supplier_orders(status);

-- =========================================================
-- supplier_order_items
-- Se prellenan desde rfq_items (part number, cantidad y el costo que
-- respondio el proveedor).
-- =========================================================
create table supplier_order_items (
  id uuid primary key default gen_random_uuid(),
  supplier_order_id uuid not null references supplier_orders(id) on delete cascade,
  product_id uuid references products(id),
  part_number text,
  manufacturer text,
  description text,
  quantity numeric(12, 2) not null default 1,
  unit_cost numeric(12, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_supplier_order_items_updated_at before update on supplier_order_items
  for each row execute function set_updated_at();
create index idx_supplier_order_items_order on supplier_order_items(supplier_order_id);

-- =========================================================
-- Row Level Security
-- =========================================================
alter table supplier_orders enable row level security;
alter table supplier_order_items enable row level security;

create policy "supplier_orders: acceso empleados activos" on supplier_orders
  for all using (is_active_employee()) with check (is_active_employee());
create policy "supplier_order_items: acceso empleados activos" on supplier_order_items
  for all using (is_active_employee()) with check (is_active_employee());

-- =========================================================
-- attachments: agrega 'supplier_order' como entity_type valido.
-- =========================================================
alter table attachments drop constraint attachments_entity_type_check;
alter table attachments add constraint attachments_entity_type_check
  check (entity_type in ('quotation', 'rfq', 'customer_order', 'supplier_order'));
