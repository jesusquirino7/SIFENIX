-- =========================================================
-- SIFENIX · Sistema interno — Remisiones: cierre por factura informal
-- Ejecutar completo en: Supabase Dashboard > SQL Editor > New query
-- Requiere que 0010 (simplifica remisiones) ya este aplicada.
-- =========================================================

-- Caso real: a veces la venta fue por una cotizacion informal (no por
-- el flujo formal de Cotizacion -> Orden de Cliente) - ahi no hace
-- falta ligar una Orden de Cliente, solo mandar la factura y que el
-- comprador confirme que la recibio. Se agregan 2 estatus intermedios,
-- mismo patron simple de boton+badge que el resto del sistema (no un
-- panel aparte):
--   entregada -> facturada -> confirmada
--             -> cancelada (desde entregada o facturada)
alter table remisiones drop constraint remisiones_status_check;
alter table remisiones add constraint remisiones_status_check
  check (status in ('entregada', 'facturada', 'confirmada', 'cancelada'));
