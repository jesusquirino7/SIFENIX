export const OPPORTUNITY_STATUS = {
  open: { label: "Abierta", color: "blue" },
  quoting: { label: "Cotizando", color: "amber" },
  won: { label: "Ganada", color: "green" },
  lost: { label: "Perdida", color: "red" },
  cancelled: { label: "Cancelada", color: "gray" },
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
