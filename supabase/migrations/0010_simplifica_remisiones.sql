-- =========================================================
-- SIFENIX · Sistema interno — Simplifica el flujo de Remisiones
-- Ejecutar completo en: Supabase Dashboard > SQL Editor > New query
-- Requiere que 0009 (remisiones) ya este aplicada.
-- =========================================================

-- Quita el estatus "formalizada": antes era un paso aparte (un panel
-- separado de "Formalizar" con selector + boton, distinto al resto de
-- los estatus del sistema). Ahora customer_order_id es simplemente un
-- campo editable en cualquier momento (como cualquier otro dato de la
-- remision), sin un paso de "formalizacion" ni estatus propio - dos
-- estatus nada mas: entregada / cancelada.

-- Por si ya existe alguna remision en 'formalizada' (poco probable,
-- la migracion 0009 es reciente), la baja a 'entregada' antes de
-- endurecer el check.
update remisiones set status = 'entregada' where status = 'formalizada';

alter table remisiones drop constraint remisiones_status_check;
alter table remisiones add constraint remisiones_status_check
  check (status in ('entregada', 'cancelada'));
