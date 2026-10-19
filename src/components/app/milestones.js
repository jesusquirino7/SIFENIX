// Pasos de confirmacion por tipo de entidad (ver migracion 0013). El
// orden de este arreglo es el orden en que se muestran en el panel.
export const MILESTONE_TYPES_BY_ENTITY = {
  customer_order: [
    "pago",
    "tracking",
    "entrega",
    "factura_solicitada",
    "factura_enviada",
    "factura_firmada",
  ],
  remision: ["entrega"],
};

export const MILESTONE_LABELS = {
  pago: "Pago confirmado",
  tracking: "Tracking / seguimiento",
  entrega: "Entrega confirmada",
  factura_solicitada: "Factura solicitada",
  factura_enviada: "Factura enviada",
  factura_firmada: "Factura firmada",
};

// Mismo criterio que getDeliveryHealth() en statusColors.js: compara
// la fecha esperada contra hoy para avisar si un milestone pendiente
// se esta acercando o ya se paso, sin tocar su status.
export function getMilestoneHealth(milestone, { dueSoonDays = 3 } = {}) {
  if (milestone.status === "confirmed" || !milestone.expected_date) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(milestone.expected_date + "T00:00:00");
  const diffDays = Math.round((due - today) / 86400000);

  if (diffDays < 0) return { label: "Atrasado", color: "red" };
  if (diffDays <= dueSoonDays) return { label: "Por cumplir", color: "amber" };
  return { label: "En tiempo", color: "blue" };
}
