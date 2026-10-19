-- =========================================================
-- SIFENIX · Sistema interno — Fase 1 del rediseño operativo
-- Ejecutar completo en: Supabase Dashboard > SQL Editor > New query
-- Requiere que 0001 (set_updated_at, is_active_employee) ya este
-- aplicada. No modifica ni borra datos existentes - todo lo nuevo
-- aqui es aditivo (columnas con default, tablas nuevas, triggers).
-- =========================================================

-- =========================================================
-- 1) Historial de precios de productos
-- Solo registra cambios de default_price (el "precio" que pide el
-- requerimiento) - no default_cost. El trigger compara explicitamente
-- old vs new: si no cambio el precio, no se inserta nada, aunque se
-- hayan editado otros campos del producto.
-- =========================================================
create table product_price_history (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  previous_price numeric(12, 2),
  new_price numeric(12, 2) not null,
  changed_by uuid references profiles(id),
  changed_at timestamptz not null default now()
);
create index idx_product_price_history_product on product_price_history(product_id, changed_at desc);

alter table product_price_history enable row level security;
create policy "product_price_history: lectura empleados activos" on product_price_history
  for select using (is_active_employee());
-- Sin policy de insert para usuarios: solo lo escribe el trigger de
-- abajo (security definer, se salta RLS).

create or replace function log_product_price_change()
returns trigger as $$
declare
  actor_id uuid;
begin
  if new.default_price is distinct from old.default_price then
    select id into actor_id from public.profiles where user_id = auth.uid();
    insert into public.product_price_history (product_id, previous_price, new_price, changed_by)
    values (new.id, old.default_price, new.default_price, actor_id);
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_log_product_price_change
  before update on products
  for each row execute function log_product_price_change();

-- =========================================================
-- 2) Auditoria generica: quien creo / quien edito por ultima vez
-- Un solo trigger reutilizable en vez de tocar cada formulario uno
-- por uno - created_by/updated_by ya existian en el esquema desde la
-- migracion 0001 pero ningun formulario los llenaba. De aqui en
-- adelante se llenan solos, sin cambios en la app.
-- =========================================================
create or replace function set_actor_columns()
returns trigger as $$
declare
  actor_id uuid;
begin
  select id into actor_id from public.profiles where user_id = auth.uid();
  if tg_op = 'INSERT' then
    new.created_by := coalesce(new.created_by, actor_id);
    new.updated_by := actor_id;
  elsif tg_op = 'UPDATE' then
    new.updated_by := actor_id;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_actor_customers before insert or update on customers
  for each row execute function set_actor_columns();
create trigger trg_actor_suppliers before insert or update on suppliers
  for each row execute function set_actor_columns();
create trigger trg_actor_products before insert or update on products
  for each row execute function set_actor_columns();
create trigger trg_actor_opportunities before insert or update on opportunities
  for each row execute function set_actor_columns();
create trigger trg_actor_quotations before insert or update on quotations
  for each row execute function set_actor_columns();
create trigger trg_actor_rfqs before insert or update on rfqs
  for each row execute function set_actor_columns();
create trigger trg_actor_customer_orders before insert or update on customer_orders
  for each row execute function set_actor_columns();
create trigger trg_actor_supplier_orders before insert or update on supplier_orders
  for each row execute function set_actor_columns();
create trigger trg_actor_remisiones before insert or update on remisiones
  for each row execute function set_actor_columns();

-- leads: insert lo hace un visitante publico (sin profile), asi que
-- solo se marca updated_by cuando un empleado le cambia el estatus.
create or replace function set_lead_updated_by()
returns trigger as $$
declare
  actor_id uuid;
begin
  select id into actor_id from public.profiles where user_id = auth.uid();
  new.updated_by := actor_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_actor_leads before update on leads
  for each row execute function set_lead_updated_by();

-- attachments: uploaded_by tampoco se llenaba desde AttachmentsPanel.js.
create or replace function set_attachment_uploaded_by()
returns trigger as $$
declare
  actor_id uuid;
begin
  select id into actor_id from public.profiles where user_id = auth.uid();
  new.uploaded_by := actor_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_actor_attachments before insert on attachments
  for each row execute function set_attachment_uploaded_by();

-- =========================================================
-- 3) Historial de estatus (reutiliza audit_log, esqueleto creado
-- desde la migracion 0001 y nunca conectado - no se crea una tabla
-- paralela). Un trigger generico aplicado a las 6 tablas con columna
-- `status`: cada vez que cambia, queda el antes/despues/quien/cuando.
-- =========================================================
create or replace function log_status_change()
returns trigger as $$
declare
  actor_id uuid;
begin
  if new.status is distinct from old.status then
    select id into actor_id from public.profiles where user_id = auth.uid();
    insert into public.audit_log (table_name, record_id, action, changed_by, old_data, new_data)
    values (
      tg_table_name,
      new.id,
      'status_change',
      actor_id,
      jsonb_build_object('status', old.status),
      jsonb_build_object('status', new.status)
    );
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_status_log_opportunities after update on opportunities
  for each row execute function log_status_change();
create trigger trg_status_log_quotations after update on quotations
  for each row execute function log_status_change();
create trigger trg_status_log_rfqs after update on rfqs
  for each row execute function log_status_change();
create trigger trg_status_log_customer_orders after update on customer_orders
  for each row execute function log_status_change();
create trigger trg_status_log_supplier_orders after update on supplier_orders
  for each row execute function log_status_change();
create trigger trg_status_log_remisiones after update on remisiones
  for each row execute function log_status_change();

-- RLS de audit_log ya existia (0001): solo lectura para empleados
-- activos. No se toca.

-- =========================================================
-- 4) Entidad que realiza la venta: Sifenix / SiReyes
-- Solo interno (no afecta el sitio publico ni la marca SIFENIX ahi).
-- Default 'sifenix' para que las oportunidades existentes no se
-- rompan - Postgres lo aplica automaticamente a los renglones ya
-- creados al agregar la columna con DEFAULT + NOT NULL en un mismo
-- paso.
-- =========================================================
alter table opportunities
  add column sale_entity text not null default 'sifenix'
    check (sale_entity in ('sifenix', 'sireyes'));
create index idx_opportunities_sale_entity on opportunities(sale_entity);
