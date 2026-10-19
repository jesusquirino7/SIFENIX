"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import Badge from "@/components/app/Badge";
import ConfirmButton from "@/components/app/ConfirmButton";
import {
  OPPORTUNITY_STATUS,
  OPPORTUNITY_STATUS_FLOW,
} from "@/components/app/statusColors";

// Ganar/perder/cancelar son decisiones que cierran la operación -
// piden confirmación. Reabrir (lost/cancelled -> open) y pasar a
// "Cotizando" son reversibles y no la piden.
const CRITICAL = new Set(["won", "lost", "cancelled"]);
const BUTTON_CLASS =
  "rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:border-[var(--brand-red)] hover:text-[var(--brand-red)] disabled:opacity-50";

export default function EstadoOportunidad({ opportunityId, status }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const current = OPPORTUNITY_STATUS[status] || OPPORTUNITY_STATUS.open;
  const nextOptions = OPPORTUNITY_STATUS_FLOW[status] || [];

  async function changeStatus(nextStatus) {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("opportunities")
      .update({ status: nextStatus })
      .eq("id", opportunityId);
    setSaving(false);

    if (error) {
      showToast("No se pudo cambiar el estatus: " + error.message, "error");
      throw error;
    }

    showToast(
      `Oportunidad marcada como ${OPPORTUNITY_STATUS[nextStatus].label.toLowerCase()}.`
    );
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <Badge color={current.color}>{current.label}</Badge>
      {nextOptions.map((next) =>
        CRITICAL.has(next) ? (
          <ConfirmButton
            key={next}
            label={`Marcar como ${OPPORTUNITY_STATUS[next].label.toLowerCase()}`}
            title={`¿Marcar como ${OPPORTUNITY_STATUS[next].label.toLowerCase()}?`}
            description="Esta oportunidad se va a mover de etapa y queda registrado en su historial."
            variant={next === "won" ? "default" : "danger"}
            disabled={saving}
            className={BUTTON_CLASS}
            onConfirm={() => changeStatus(next)}
          />
        ) : (
          <button
            key={next}
            type="button"
            disabled={saving}
            onClick={() => changeStatus(next)}
            className={BUTTON_CLASS}
          >
            Marcar como {OPPORTUNITY_STATUS[next].label.toLowerCase()}
          </button>
        )
      )}
    </div>
  );
}
