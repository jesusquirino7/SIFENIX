export const OPPORTUNITY_STATUS = {
  open: { label: "Abierta", color: "blue" },
  quoting: { label: "Cotizando", color: "amber" },
  won: { label: "Ganada", color: "green" },
  lost: { label: "Perdida", color: "red" },
  cancelled: { label: "Cancelada", color: "gray" },
};

export const OPPORTUNITY_STATUS_FLOW = {
  open: ["quoting", "cancelled"],
  quoting: ["won", "lost", "cancelled"],
  won: [],
  lost: ["open"],
  cancelled: ["open"],
};

export const QUOTATION_STATUS = {
  draft: { label: "Borrador", color: "gray" },
  sent: { label: "Enviada", color: "blue" },
  accepted: { label: "Aceptada", color: "green" },
  rejected: { label: "Rechazada", color: "red" },
  expired: { label: "Vencida", color: "amber" },
};

export const QUOTATION_STATUS_FLOW = {
  draft: ["sent"],
  sent: ["accepted", "rejected", "expired"],
  accepted: [],
  rejected: ["draft"],
  expired: ["draft"],
};

export const RFQ_STATUS = {
  draft: { label: "Borrador", color: "gray" },
  sent: { label: "Enviada", color: "blue" },
  responded: { label: "Respondida", color: "green" },
  expired: { label: "Vencida", color: "amber" },
};

export const RFQ_STATUS_FLOW = {
  draft: ["sent"],
  sent: ["responded", "expired"],
  responded: ["draft", "expired"],
  expired: ["draft"],
};

export const CUSTOMER_ORDER_STATUS = {
  confirmed: { label: "Confirmada", color: "blue" },
  in_process: { label: "En proceso", color: "amber" },
  delivered: { label: "Entregada", color: "green" },
  cancelled: { label: "Cancelada", color: "red" },
};

export const CUSTOMER_ORDER_STATUS_FLOW = {
  confirmed: ["in_process", "cancelled"],
  in_process: ["delivered", "cancelled"],
  delivered: [],
  cancelled: ["confirmed"],
};

export const SUPPLIER_ORDER_STATUS = {
  confirmed: { label: "Confirmada", color: "blue" },
  in_process: { label: "En tránsito", color: "amber" },
  received: { label: "Recibida", color: "green" },
  cancelled: { label: "Cancelada", color: "red" },
};

export const SUPPLIER_ORDER_STATUS_FLOW = {
  confirmed: ["in_process", "cancelled"],
  in_process: ["received", "cancelled"],
  received: [],
  cancelled: ["confirmed"],
};

// Indicador de "salud de entrega" para ordenes con expected_delivery_date:
// compara la fecha esperada contra hoy (independiente del status
// confirmada/en transito/etc.) para saber si esta atrasada, por cumplir
// pronto, o ya cumplida.
export function getDeliveryHealth(order, { dueSoonDays = 3 } = {}) {
  if (order.status === "received") {
    return { label: "Cumplida", color: "green" };
  }
  if (order.status === "cancelled" || !order.expected_delivery_date) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(order.expected_delivery_date + "T00:00:00");
  const diffDays = Math.round((due - today) / 86400000);

  if (diffDays < 0) return { label: "Atrasada", color: "red" };
  if (diffDays <= dueSoonDays) return { label: "Por cumplir", color: "amber" };
  return { label: "En tiempo", color: "blue" };
}
