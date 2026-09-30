// Calcula, para una oportunidad, cuál fue el último avance real (entre
// cotización, RFQ, orden de cliente y orden a proveedor) y qué sigue -
// para no tener que entrar a cada documento a averiguarlo. Reglas fijas,
// sin contar cuántos documentos exactos hacen falta (a propósito: una
// orden de cliente puede derivar en varias órdenes a proveedor).
export function computeNextAction(opportunity) {
  if (["won", "lost", "cancelled"].includes(opportunity.status)) {
    return null;
  }

  const quotations = [...(opportunity.quotations || [])].sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  );
  const rfqs = opportunity.rfqs || [];
  const customerOrders = opportunity.customer_orders || [];
  const supplierOrders = opportunity.supplier_orders || [];

  if (!quotations.length) {
    return {
      label: "Cotización no anexada",
      action: "Realizar cotización",
      tone: "red",
      href: `/app/oportunidades/${opportunity.id}/cotizaciones/nueva`,
    };
  }

  const latest = quotations[0];

  if (latest.status === "draft") {
    return {
      label: "Cotización en borrador",
      action: "Enviarla al cliente",
      tone: "amber",
      href: `/app/cotizaciones/${latest.id}`,
    };
  }
  if (latest.status === "sent") {
    return {
      label: "Cotización enviada",
      action: "Pendiente seguimiento",
      tone: "blue",
      href: `/app/cotizaciones/${latest.id}`,
    };
  }
  if (latest.status === "rejected") {
    return {
      label: "Cotización rechazada",
      action: "Revisar con el cliente",
      tone: "red",
      href: `/app/cotizaciones/${latest.id}`,
    };
  }
  if (latest.status === "expired") {
    return {
      label: "Cotización vencida",
      action: "Renovar o cerrar",
      tone: "red",
      href: `/app/cotizaciones/${latest.id}`,
    };
  }

  // latest.status === "accepted" de aquí en adelante
  if (!customerOrders.length) {
    return {
      label: "Cotización aceptada",
      action: "Crear orden de cliente",
      tone: "amber",
      href: `/app/cotizaciones/${latest.id}`,
    };
  }

  if (!rfqs.length && !supplierOrders.length) {
    return {
      label: "Orden de compra recibida",
      action: "Hay que poner PO al proveedor",
      tone: "red",
      href: `/app/oportunidades/${opportunity.id}/rfq/nueva`,
    };
  }

  const pendingSupplierOrder = supplierOrders.find(
    (o) => o.status === "confirmed" || o.status === "in_process"
  );
  if (pendingSupplierOrder) {
    return {
      label: "Compra en tránsito",
      action: "Dar seguimiento a la entrega del proveedor",
      tone: "blue",
      href: `/app/ordenes-proveedor/${pendingSupplierOrder.id}`,
    };
  }

  if (
    supplierOrders.length &&
    supplierOrders.every((o) => o.status === "received" || o.status === "cancelled")
  ) {
    const pendingDelivery = customerOrders.find(
      (o) => o.status !== "delivered" && o.status !== "cancelled"
    );
    if (pendingDelivery) {
      return {
        label: "Material recibido de proveedor",
        action: "Entregar al cliente",
        tone: "amber",
        href: `/app/ordenes-cliente/${pendingDelivery.id}`,
      };
    }
    return { label: "Completada", action: "Sin pendientes", tone: "green", href: null };
  }

  if (!supplierOrders.length && rfqs.length) {
    const respondedRfq = rfqs.find((r) => r.status === "responded");
    if (respondedRfq) {
      return {
        label: "RFQ respondida",
        action: "Generar orden a proveedor",
        tone: "amber",
        href: `/app/rfq-proveedores/${respondedRfq.id}`,
      };
    }
    const sentRfq = rfqs.find((r) => r.status === "sent");
    return {
      label: "RFQ enviada",
      action: "Esperando respuesta del proveedor",
      tone: "blue",
      href: sentRfq ? `/app/rfq-proveedores/${sentRfq.id}` : null,
    };
  }

  return { label: "En proceso", action: "Revisar operación", tone: "gray", href: null };
}
