"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import Badge from "@/components/app/Badge";
import {
  OPPORTUNITY_STATUS,
  OPPORTUNITY_STATUS_FLOW,
} from "@/components/app/statusColors";

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
      return;
    }

    showToast(
      `Oportunidad marcada como ${OPPORTUNITY_STATUS[nextStatus].label.toLowerCase()}.`
    );
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
          Marcar como {OPPORTUNITY_STATUS[next].label.toLowerCase()}
        </button>
      ))}
    </div>
  );
}
