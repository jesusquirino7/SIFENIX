"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import Badge from "@/components/app/Badge";
import { LEAD_STATUS, LEAD_STATUS_FLOW } from "@/components/app/statusColors";

export default function EstadoLead({ leadId, status }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const current = LEAD_STATUS[status] || LEAD_STATUS.nuevo;
  const nextOptions = LEAD_STATUS_FLOW[status] || [];

  async function changeStatus(nextStatus) {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("leads")
      .update({ estatus: nextStatus })
      .eq("id", leadId);
    setSaving(false);

    if (error) {
      showToast("No se pudo cambiar el estatus: " + error.message, "error");
      return;
    }

    showToast(`Marcada como ${LEAD_STATUS[nextStatus].label.toLowerCase()}.`);
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
          Marcar como {LEAD_STATUS[next].label.toLowerCase()}
        </button>
      ))}
    </div>
  );
}
