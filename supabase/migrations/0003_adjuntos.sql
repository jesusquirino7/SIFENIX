-- =========================================================
-- SIFENIX · Sistema interno — Archivos adjuntos (Cotizaciones y RFQ)
-- Ejecutar completo en: Supabase Dashboard > SQL Editor > New query
-- Requiere que 0001_sistema_interno_inicial.sql ya este aplicado
-- (usa is_active_employee()).
-- =========================================================

-- Bucket privado (no publico: solo accesible via URL firmada, y solo
-- para empleados activos segun la policy de storage.objects de abajo).
insert into storage.buckets (id, name, public, file_size_limit)
values ('documents', 'documents', false, 20971520) -- 20 MB por archivo
on conflict (id) do nothing;

-- =========================================================
-- attachments
-- Tabla generica de adjuntos: "entity_type" + "entity_id" liga el
-- archivo a cualquier documento del sistema sin una tabla por modulo.
-- Hoy solo se usa para 'quotation'; se agrega 'rfq' cuando ese modulo
-- entre en operacion (Etapa 3) - agregar un valor nuevo al check es
-- un ALTER TABLE de una linea, no un cambio de esquema.
-- =========================================================
create table attachments (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('quotation', 'rfq')),
  entity_id uuid not null,
  file_name text not null,
  storage_path text not null,
  file_size bigint,
  content_type text,
  uploaded_by uuid references profiles(id),
  created_at timestamptz not null default now()
);
create index idx_attachments_entity on attachments(entity_type, entity_id);

alter table attachments enable row level security;
create policy "attachments: acceso empleados activos" on attachments
  for all using (is_active_employee()) with check (is_active_employee());

-- storage.objects ya tiene RLS activado por Supabase de fabrica; solo
-- agregamos la policy para el bucket 'documents'.
create policy "documents bucket: acceso empleados activos" on storage.objects
  for all
  using (bucket_id = 'documents' and public.is_active_employee())
  with check (bucket_id = 'documents' and public.is_active_employee());
