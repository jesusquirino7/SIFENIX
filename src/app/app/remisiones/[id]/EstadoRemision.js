"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import Badge from "@/components/app/Badge";
import { REMISION_STATUS, REMISION_STATUS_FLOW } from "@/components/app/statusColors";

export default function EstadoRemision({ remisionId, status }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const current = REMISION_STATUS[status] || REMISION_STATUS.entregada;
  // "formalizada" solo se llega via FormalizarRemision (necesita elegir la
  // orden de cliente) - aqui no se ofrece como botón directo.
  const nextOptions = (REMISION_STATUS_FLOW[status] || []).filter(
    (next) => next !== "formalizada"
  );

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
      return;
    }

    showToast(`Remisión marcada como ${REMISION_STATUS[nextStatus].label.toLowerCase()}.`);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <Badge color={current.color}>{current.label}</Badge>
      {nextOptions.map((next) => (
        <button
          key={next}
          type="button"
          disabled={saving}
          onClick={() => changeStatus(next)}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:border-[var(--brand-red)] hover:text-[var(--brand-red)] disabled:opacity-50"
        >
          Marcar como {REMISION_STATUS[next].label.toLowerCase()}
        </button>
      ))}
    </div>
  );
}
