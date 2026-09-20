"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import Badge from "@/components/app/Badge";
import { RFQ_STATUS, RFQ_STATUS_FLOW } from "@/components/app/statusColors";

export default function EstadoRfq({ rfqId, status }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  const current = RFQ_STATUS[status] || RFQ_STATUS.draft;
  const nextOptions = RFQ_STATUS_FLOW[status] || [];

  async function changeStatus(nextStatus) {
    setSaving(true);
    const supabase = createClient();
    const patch = { status: nextStatus };
    if (nextStatus === "sent") patch.sent_at = new Date().toISOString();
    if (nextStatus === "responded") patch.responded_at = new Date().toISOString();

    const { error } = await supabase.from("rfqs").update(patch).eq("id", rfqId);
    setSaving(false);

    if (error) {
      showToast("No se pudo cambiar el estatus: " + error.message, "error");
      return;
    }

    showToast(`RFQ marcada como ${RFQ_STATUS[nextStatus].label.toLowerCase()}.`);
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
          Marcar como {RFQ_STATUS[next].label.toLowerCase()}
        </button>
      ))}
    </div>
  );
}
