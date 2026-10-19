import { MILESTONE_LABELS } from "@/components/app/milestones";

// Calcula las etapas del pipeline visual de una Oportunidad a partir
// de lo que ya existe (cotizaciones, rfqs, ordenes, milestones) - no
// hay una tabla de "etapas", son derivadas, igual que nextAction.js
// (que resuelve "que sigue"; esto resuelve "donde esta parado todo").
// El flujo NO es estrictamente lineal (confirmado por el dueño): una
// etapa puede estar "bloqueado" esperando la anterior, pero ninguna
// se salta por diseño si los datos ya avanzaron.
function summarizeMilestones(milestones, types) {
  const relevant = milestones.filter((m) => types.includes(m.milestone_type));
  const total = relevant.length;
  const confirmed = relevant.filter((m) => m.status === "confirmed").length;
  const pendingLabels = relevant
    .filter((m) => m.status !== "confirmed")
    .map((m) => MILESTONE_LABELS[m.milestone_type]);
  return { total, confirmed, pendingLabels };
}

export function computePipelineStages({
  opportunity,
  quotations = [],
  rfqs = [],
  customerOrders = [],
  supplierOrders = [],
  remisiones = [],
  orderMilestones = [],
  remisionMilestones = [],
}) {
  const stages = [];

  // 1) Cotizacion a Proveedores (opcional por diseno: si ya se tiene
  // precio de referencia, se puede saltar directo a cotizar al cliente).
  {
    const responded = rfqs.filter((r) => r.status === "responded").length;
    const sent = rfqs.filter((r) => r.status === "sent").length;
    let state = "pendiente";
    let summary = "Sin cotizar a proveedores todavía (opcional si ya hay precio de referencia).";
    if (rfqs.length) {
      if (responded > 0) {
        state = "completado";
        summary = `${responded}/${rfqs.length} proveedor${rfqs.length === 1 ? "" : "es"} respondió con precio.`;
      } else {
        state = "actual";
        summary = `${sent}/${rfqs.length} enviada${rfqs.length === 1 ? "" : "s"}, esperando respuesta.`;
      }
    }
    stages.push({
      key: "rfq",
      label: "Cotización a Proveedores",
      state,
      summary,
      href: rfqs.length
        ? `/app/rfq-proveedores/${rfqs[0].id}`
        : `/app/oportunidades/${opportunity.id}/rfq/nueva`,
    });
  }

  // 2) Cotizacion a Cliente (ya viene ordenado desc por created_at).
  {
    const latest = quotations[0];
    let state = "pendiente";
    let summary = "Todavía no se ha generado una cotización para el cliente.";
    let href = `/app/oportunidades/${opportunity.id}/cotizaciones/nueva`;
    if (latest) {
      href = `/app/cotizaciones/${latest.id}`;
      if (latest.status === "accepted") {
        state = "completado";
        summary = `${latest.quotation_number} aceptada por el cliente.`;
      } else if (latest.status === "rejected" || latest.status === "expired") {
        state = "bloqueado";
        summary = `${latest.quotation_number} ${
          latest.status === "rejected" ? "rechazada" : "vencida"
        } — necesita renovarse.`;
      } else if (latest.status === "sent") {
        state = "actual";
        summary = `${latest.quotation_number} enviada, esperando respuesta del cliente.`;
      } else {
        state = "actual";
        summary = `${latest.quotation_number} en borrador, falta enviarla.`;
      }
    }
    stages.push({ key: "quotation", label: "Cotización a Cliente", state, summary, href });
  }

  // 3) Resultado de la oportunidad.
  {
    let state = "pendiente";
    let summary = "Sigue abierta.";
    if (opportunity.status === "won") {
      state = "completado";
      summary = "Ganada.";
    } else if (opportunity.status === "lost") {
      state = "cancelado";
      summary = "Perdida.";
    } else if (opportunity.status === "cancelled") {
      state = "cancelado";
      summary = "Cancelada.";
    } else if (opportunity.status === "quoting") {
      state = "actual";
      summary = "En proceso de cotización.";
    }
    stages.push({ key: "result", label: "Resultado", state, summary, href: null });
  }

  // Si se perdió o canceló, las etapas de ejecución ya no aplican -
  // se verían todas "bloqueadas" sin aportar nada.
  if (opportunity.status === "lost" || opportunity.status === "cancelled") {
    return stages;
  }

  // 4) Orden de Cliente.
  {
    const accepted = quotations.find((q) => q.status === "accepted");
    let state = "bloqueado";
    let summary = "Esperando que el cliente acepte una cotización.";
    let href = accepted ? `/app/cotizaciones/${accepted.id}` : null;
    if (customerOrders.length) {
      state = "completado";
      const delivered = customerOrders.filter((o) => o.status === "delivered").length;
      summary = `${customerOrders.length} orden${
        customerOrders.length === 1 ? "" : "es"
      }, ${delivered} entregada${delivered === 1 ? "" : "s"}.`;
      href = `/app/ordenes-cliente/${customerOrders[0].id}`;
    } else if (accepted) {
      state = "actual";
      summary = "Cotización aceptada — falta crear la orden de cliente.";
    }
    stages.push({ key: "customer-order", label: "Orden de Cliente", state, summary, href });
  }

  // 5) Orden(es) a Proveedor.
  {
    const respondedRfq = rfqs.find((r) => r.status === "responded");
    let state = "bloqueado";
    let summary = "Esperando una cotización de proveedor respondida.";
    let href = respondedRfq ? `/app/rfq-proveedores/${respondedRfq.id}` : null;
    if (supplierOrders.length) {
      state = "completado";
      const received = supplierOrders.filter((o) => o.status === "received").length;
      summary = `${supplierOrders.length} orden${
        supplierOrders.length === 1 ? "" : "es"
      }, ${received} recibida${received === 1 ? "" : "s"}.`;
      href = `/app/ordenes-proveedor/${supplierOrders[0].id}`;
    } else if (respondedRfq || customerOrders.length) {
      state = "actual";
      summary = "Falta generar la orden a proveedor.";
    }
    stages.push({ key: "supplier-order", label: "Orden(es) a Proveedor", state, summary, href });
  }

  // 6) Entrega (milestone "entrega" de ordenes de cliente y remisiones).
  {
    const entregaMilestones = [
      ...orderMilestones.filter((m) => m.milestone_type === "entrega"),
      ...remisionMilestones.filter((m) => m.milestone_type === "entrega"),
    ];
    let state = "bloqueado";
    let summary = "Todavía no hay nada que entregar.";
    if (entregaMilestones.length) {
      const confirmed = entregaMilestones.filter((m) => m.status === "confirmed").length;
      if (confirmed === entregaMilestones.length) {
        state = "completado";
        summary = `Entrega confirmada (${confirmed}/${entregaMilestones.length}).`;
      } else {
        state = "actual";
        summary = `${confirmed}/${entregaMilestones.length} entregas confirmadas.`;
      }
    }
    stages.push({
      key: "entrega",
      label: "Entrega",
      state,
      summary,
      href: customerOrders[0]
        ? `/app/ordenes-cliente/${customerOrders[0].id}`
        : remisiones[0]
        ? `/app/remisiones/${remisiones[0].id}`
        : null,
    });
  }

  // 7) Pago y Factura (solo ordenes de cliente - las remisiones usan
  // su propio status entregada/facturada/confirmada).
  {
    const types = ["pago", "factura_solicitada", "factura_enviada", "factura_firmada"];
    const { total, confirmed, pendingLabels } = summarizeMilestones(orderMilestones, types);
    let state = "bloqueado";
    let summary = "Todavía no aplica (no hay orden de cliente).";
    if (total) {
      if (confirmed === total) {
        state = "completado";
        summary = "Pago y factura confirmados.";
      } else {
        state = "actual";
        summary = `Falta: ${pendingLabels.join(", ")}.`;
      }
    }
    stages.push({
      key: "pago-factura",
      label: "Pago y Factura",
      state,
      summary,
      href: customerOrders[0] ? `/app/ordenes-cliente/${customerOrders[0].id}` : null,
    });
  }

  return stages;
}
