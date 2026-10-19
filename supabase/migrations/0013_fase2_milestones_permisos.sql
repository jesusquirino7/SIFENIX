-- =========================================================
-- SIFENIX · Sistema interno — Fase 2 del rediseño operativo
-- Ejecutar completo en: Supabase Dashboard > SQL Editor > New query
-- Requiere que 0001-0012 ya esten aplicadas. Aditivo: no borra ni
-- modifica datos existentes.
-- =========================================================

-- =========================================================
-- 1) Milestones: pasos de confirmacion sobre Ordenes de Cliente y
-- Remisiones (pago, tracking, entrega, factura) que NO existian como
-- status en esas tablas. Se modelan aparte (generico entity_type +
-- entity_id, mismo patron que "attachments") en vez de agregarlos al
-- enum de status de customer_orders/remisiones, para no romper toda
-- la logica que ya depende de esos valores simples (Dashboard,
-- Seguimiento, nextAction.js, Reportes, semaforo de entrega).
-- Son solo pasos de confirmacion + comentario + fecha esperada (para
-- recordatorios) - sin API de paqueteria ni tracking en tiempo real,
-- segun lo confirmado por el dueño.
-- =========================================================
create table milestones (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('customer_order', 'remision')),
  entity_id uuid not null,
  milestone_type text not null check (milestone_type in (
    'pago', 'tracking', 'entrega',
    'factura_solicitada', 'factura_enviada', 'factura_firmada'
  )),
  status text not null default 'pending' check (status in ('pending', 'confirmed')),
  expected_date date,
  comment text,
  confirmed_at timestamptz,
  confirmed_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (entity_type, entity_id, milestone_type)
);
create index idx_milestones_entity on milestones(entity_type, entity_id);

alter table milestones enable row level security;
-- Mismo criterio que el resto del sistema: sin restriccion por role
-- (el dueño solo pidio ocultar ARCHIVOS de ordenes/remisiones a
-- ventas, no el estatus de pago/entrega/factura - ver seccion 3).
create policy "milestones: acceso empleados activos" on milestones
  for all using (is_active_employee()) with check (is_active_employee());

create or replace function set_milestone_confirmed_by()
returns trigger as $$
declare
  actor_id uuid;
begin
  if new.status = 'confirmed' and old.status is distinct from 'confirmed' then
    select id into actor_id from public.profiles where user_id = auth.uid();
    new.confirmed_by := actor_id;
    new.confirmed_at := coalesce(new.confirmed_at, now());
  end if;
  new.updated_at := now();
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_milestone_confirmed_by
  before update on milestones
  for each row execute function set_milestone_confirmed_by();

-- Siembra automatica: cada Orden de Cliente nueva recibe sus 6
-- milestones en 'pending'; cada Remision nueva recibe solo 'entrega'
-- (su propia factura ya la cubre el status entregada/facturada/
-- confirmada existente, ver 0010/0011).
create or replace function seed_customer_order_milestones()
returns trigger as $$
begin
  insert into public.milestones (entity_type, entity_id, milestone_type)
  values
    ('customer_order', new.id, 'pago'),
    ('customer_order', new.id, 'tracking'),
    ('customer_order', new.id, 'entrega'),
    ('customer_order', new.id, 'factura_solicitada'),
    ('customer_order', new.id, 'factura_enviada'),
    ('customer_order', new.id, 'factura_firmada')
  on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_seed_customer_order_milestones
  after insert on customer_orders
  for each row execute function seed_customer_order_milestones();

create or replace function seed_remision_milestones()
returns trigger as $$
begin
  insert into public.milestones (entity_type, entity_id, milestone_type)
  values ('remision', new.id, 'entrega')
  on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_seed_remision_milestones
  after insert on remisiones
  for each row execute function seed_remision_milestones();

-- Backfill: las Ordenes de Cliente y Remisiones que ya existian antes
-- de esta migracion no dispararon el trigger de arriba - se siembran
-- aqui una sola vez para que no se queden sin sus milestones.
insert into milestones (entity_type, entity_id, milestone_type)
select 'customer_order', co.id, mt.milestone_type
from customer_orders co
cross join (
  values ('pago'), ('tracking'), ('entrega'),
         ('factura_solicitada'), ('factura_enviada'), ('factura_firmada')
) as mt(milestone_type)
on conflict do nothing;

insert into milestones (entity_type, entity_id, milestone_type)
select 'remision', r.id, 'entrega'
from remisiones r
on conflict do nothing;

-- =========================================================
-- 2) Matriz de permisos: helper is_sales_only(), mismo criterio que
-- is_super_admin() (0007) - security definer, stable.
-- =========================================================
create or replace function is_sales_only()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and active = true and role = 'sales'
  );
$$ language sql stable security definer set search_path = public;

-- =========================================================
-- 3) Restriccion para ventas: no puede ver ni subir archivos de
-- Ordenes de Cliente ni Remisiones (si de Cotizaciones, RFQ y Ordenes
-- a Proveedor - el dueño solo mencino ordenes/remisiones/facturas).
-- Reemplaza la policy unica "attachments: acceso empleados activos"
-- de 0003 por 4 mas especificas (mismo efecto para todos los roles
-- excepto ventas en esos 2 entity_type).
-- =========================================================
drop policy "attachments: acceso empleados activos" on attachments;

create policy "attachments: lectura (ventas sin ordenes/remisiones)" on attachments
  for select using (
    is_active_employee()
    and not (is_sales_only() and entity_type in ('customer_order', 'remision'))
  );

create policy "attachments: carga (ventas sin ordenes/remisiones)" on attachments
  for insert with check (
    is_active_employee()
    and not (is_sales_only() and entity_type in ('customer_order', 'remision'))
  );

create policy "attachments: edicion (ventas sin ordenes/remisiones)" on attachments
  for update using (
    is_active_employee()
    and not (is_sales_only() and entity_type in ('customer_order', 'remision'))
  );

create policy "attachments: borrado (ventas sin ordenes/remisiones)" on attachments
  for delete using (
    is_active_employee()
    and not (is_sales_only() and entity_type in ('customer_order', 'remision'))
  );

-- Mismo criterio en el bucket de Storage: la ruta de cada archivo
-- empieza con "<entity_type>/<entity_id>/..." (ver AttachmentsPanel.js),
-- asi que el primer segmento de la ruta es el entity_type.
drop policy "documents bucket: acceso empleados activos" on storage.objects;

create policy "documents bucket: acceso (ventas sin ordenes/remisiones)" on storage.objects
  for all
  using (
    bucket_id = 'documents' and public.is_active_employee()
    and not (
      public.is_sales_only()
      and (storage.foldername(name))[1] in ('customer_order', 'remision')
    )
  )
  with check (
    bucket_id = 'documents' and public.is_active_employee()
    and not (
      public.is_sales_only()
      and (storage.foldername(name))[1] in ('customer_order', 'remision')
    )
  );
