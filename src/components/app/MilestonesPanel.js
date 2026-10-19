"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import Badge from "@/components/app/Badge";
import ConfirmButton from "@/components/app/ConfirmButton";
import {
  MILESTONE_TYPES_BY_ENTITY,
  MILESTONE_LABELS,
  getMilestoneHealth,
} from "@/components/app/milestones";

// Panel de pasos de confirmacion (pago, tracking, entrega, factura)
// para Ordenes de Cliente y Remisiones - ver migracion 0013. Cada
// Orden/Remision ya trae sus milestones sembrados por un trigger, asi
// que aqui solo se listan y se confirman, nunca se crean a mano.
export default function MilestonesPanel({ entityType, milestones }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [savingId, setSavingId] = useState(null);

  const order = MILESTONE_TYPES_BY_ENTITY[entityType] || [];
  const byType = Object.fromEntries((milestones || []).map((m) => [m.milestone_type, m]));

  async function confirm(milestone, comment) {
    const supabase = createClient();
    const { error } = await supabase
      .from("milestones")
      .update({ status: "confirmed", comment: comment || null })
      .eq("id", milestone.id);

    if (error) {
      showToast("No se pudo confirmar: " + error.message, "error");
      throw error;
    }

    showToast(`${MILESTONE_LABELS[milestone.milestone_type]} confirmado.`);
    router.refresh();
  }

  async function updateExpectedDate(milestone, value) {
    setSavingId(milestone.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("milestones")
      .update({ expected_date: value || null })
      .eq("id", milestone.id);
    setSavingId(null);

    if (error) {
      showToast("No se pudo guardar la fecha: " + error.message, "error");
      return;
    }
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <h2 className="text-sm font-semibold text-neutral-500">
        Seguimiento y confirmaciones
      </h2>
      <div className="mt-3 divide-y divide-neutral-100">
        {order.map((type) => {
          const milestone = byType[type];
          if (!milestone) return null;
          const health = getMilestoneHealth(milestone);
          const confirmed = milestone.status === "confirmed";

          return (
            <div key={type} className="flex items-center justify-between gap-3 py-3 text-sm">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-900">
                    {MILESTONE_LABELS[type]}
                  </span>
                  <Badge color={confirmed ? "green" : health?.color || "gray"}>
                    {confirmed ? "Confirmado" : health?.label || "Pendiente"}
                  </Badge>
                </div>
                {confirmed ? (
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {new Date(milestone.confirmed_at).toLocaleDateString("es-MX")}
                    {milestone.comment ? ` — ${milestone.comment}` : ""}
                  </p>
                ) : (
                  <label className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                    Fecha esperada
                    <input
                      type="date"
                      defaultValue={milestone.expected_date || ""}
                      disabled={savingId === milestone.id}
                      onBlur={(e) => updateExpectedDate(milestone, e.target.value)}
                      className="rounded border border-neutral-300 px-2 py-1 text-xs"
                    />
                  </label>
                )}
              </div>

              {!confirmed && (
                <ConfirmButton
                  label="Confirmar"
                  title={`Confirmar: ${MILESTONE_LABELS[type]}`}
                  description="Esta confirmación queda registrada con tu usuario y la fecha de hoy."
                  withComment
                  commentLabel="Comentario (opcional)"
                  onConfirm={(comment) => confirm(milestone, comment)}
                  className="shrink-0 rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:border-[var(--brand-red)] hover:text-[var(--brand-red)]"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
