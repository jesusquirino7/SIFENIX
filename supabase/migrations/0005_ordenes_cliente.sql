-- =========================================================
-- SIFENIX · Sistema interno — Etapa 5: Ordenes de compra de clientes
-- Ejecutar completo en: Supabase Dashboard > SQL Editor > New query
-- Requiere que 0001 y 0002 (quotations) ya esten aplicadas.
-- =========================================================

-- =========================================================
-- customer_orders
-- Confirma una cotizacion como venta: siempre nace desde una
-- cotizacion (quotation_id) y hereda su oportunidad. customer_po_number
-- es el numero de orden que asigna EL CLIENTE (distinto a nuestro folio
-- interno order_number).
-- =========================================================
create sequence customer_order_number_seq;

create or replace function generate_customer_order_number()
returns trigger as $$
begin
  if new.order_number is null then
    new.order_number := 'OC-' || to_char(now(), 'YYYY') || '-' ||
      lpad(nextval('customer_order_number_seq')::text, 5, '0');
  end if;
  return new;
end;
$$ language plpgsql;

create table customer_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique,
  opportunity_id uuid not null references opportunities(id) on delete cascade,
  quotation_id uuid references quotations(id),
  customer_po_number text,
  status text not null default 'confirmed'
    check (status in ('confirmed', 'in_process', 'delivered', 'cancelled')),
  currency text not null default 'MXN',
  notes text,
  created_by uuid references profiles(id),
  updated_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_customer_orders_number before insert on customer_orders
  for each row execute function generate_customer_order_number();
create trigger trg_customer_orders_updated_at before update on customer_orders
  for each row execute function set_updated_at();
create index idx_customer_orders_opportunity on customer_orders(opportunity_id);
create index idx_customer_orders_quotation on customer_orders(quotation_id);
create index idx_customer_orders_status on customer_orders(status);

-- =========================================================
-- customer_order_items
-- Se prellenan desde quotation_items (part number, cantidad y precio
-- ya acordado con el cliente).
-- =========================================================
create table customer_order_items (
  id uuid primary key default gen_random_uuid(),
  customer_order_id uuid not null references customer_orders(id) on delete cascade,
  product_id uuid references products(id),
  part_number text,
  manufacturer text,
  description text,
  quantity numeric(12, 2) not null default 1,
  unit_price numeric(12, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_customer_order_items_updated_at before update on customer_order_items
  for each row execute function set_updated_at();
create index idx_customer_order_items_order on customer_order_items(customer_order_id);

-- =========================================================
-- Row Level Security
-- =========================================================
alter table customer_orders enable row level security;
alter table customer_order_items enable row level security;

create policy "customer_orders: acceso empleados activos" on customer_orders
  for all using (is_active_employee()) with check (is_active_employee());
create policy "customer_order_items: acceso empleados activos" on customer_order_items
  for all using (is_active_employee()) with check (is_active_employee());

-- =========================================================
-- attachments: agrega 'customer_order' como entity_type valido, para
-- reutilizar AttachmentsPanel tal cual (subir el PDF de la orden que
-- manda el cliente, por ejemplo).
-- =========================================================
alter table attachments drop constraint attachments_entity_type_check;
alter table attachments add constraint attachments_entity_type_check
  check (entity_type in ('quotation', 'rfq', 'customer_order'));
