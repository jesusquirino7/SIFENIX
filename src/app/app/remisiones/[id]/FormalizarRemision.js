"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import { inputClass, labelClass } from "@/components/app/formStyles";

export default function FormalizarRemision({ remisionId, customerOrders }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [orderId, setOrderId] = useState(customerOrders[0]?.id || "");
  const [saving, setSaving] = useState(false);

  async function handleFormalizar() {
    if (!orderId) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("remisiones")
      .update({ customer_order_id: orderId, status: "formalizada" })
      .eq("id", remisionId);
    setSaving(false);

    if (error) {
      showToast("No se pudo formalizar: " + error.message, "error");
      return;
    }

    showToast("Remisión formalizada.");
    router.refresh();
  }

  if (!customerOrders.length) {
    return (
      <p className="text-sm text-neutral-500">
        Todavía no hay una Orden de Cliente para esta operación. Cuando el
        proceso formal esté listo (cotización → orden de cliente), regresa
        aquí para ligarla.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <label className={labelClass}>Orden de cliente</label>
        <select
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className={inputClass}
        >
          {customerOrders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.order_number}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        disabled={saving}
        onClick={handleFormalizar}
        className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {saving ? "Formalizando…" : "Formalizar"}
      </button>
    </div>
  );
}
