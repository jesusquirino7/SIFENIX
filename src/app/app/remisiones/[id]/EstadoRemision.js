"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import Badge from "@/components/app/Badge";
import ConfirmButton from "@/components/app/ConfirmButton";
import { REMISION_STATUS, REMISION_STATUS_FLOW } from "@/components/app/statusColors";

const CRITICAL = new Set(["cancelada"]);
const BUTTON_CLASS =
  "rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:border-[var(--brand-red)] hover:text-[var(--brand-red)] disabled:opacity-50";

export default function EstadoRemision({ remisionId, status }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const current = REMISION_STATUS[status] || REMISION_STATUS.entregada;
  const nextOptions = REMISION_STATUS_FLOW[status] || [];

  async function changeStatus(nextStatus) {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("remisiones")
      .update({ status: nextStatus })
      .eq("id", remisionId);
    setSaving(false);

    if (error) {
      showToast("No se pudo cambiar el estatus: " + error.message, "error");
      throw error;
    }

    showToast(`Remisión marcada como ${REMISION_STATUS[nextStatus].label.toLowerCase()}.`);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <Badge color={current.color}>{current.label}</Badge>
      {nextOptions.map((next) =>
        CRITICAL.has(next) ? (
          <ConfirmButton
            key={next}
            label={`Marcar como ${REMISION_STATUS[next].label.toLowerCase()}`}
            title={`¿Marcar como ${REMISION_STATUS[next].label.toLowerCase()}?`}
            description="Esta acción queda registrada en el historial de la remisión."
            variant="danger"
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
            Marcar como {REMISION_STATUS[next].label.toLowerCase()}
          </button>
        )
      )}
    </div>
  );
}
