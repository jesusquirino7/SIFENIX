"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import { inputClass } from "@/components/app/formStyles";

// Antes esto era un paso aparte ("Formalizar", con su propio panel y
// estatus). Ahora es solo un campo mas de la remision, editable en
// cualquier momento — no bloquea nada ni cambia el estatus.
export default function OrdenClienteRelacionada({ remisionId, currentOrderId, customerOrders }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);

  async function handleChange(e) {
    const value = e.target.value || null;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("remisiones")
      .update({ customer_order_id: value })
      .eq("id", remisionId);
    setSaving(false);

    if (error) {
      showToast("No se pudo guardar: " + error.message, "error");
      return;
    }

    showToast("Cambios guardados.");
    router.refresh();
  }

  if (!customerOrders.length && !currentOrderId) {
    return (
      <p className="text-sm text-neutral-500">
        Todavía no hay una Orden de Cliente para esta operación. En cuanto se
        cree, va a poder elegirse aquí.
      </p>
    );
  }

  return (
    <select
      value={currentOrderId || ""}
      disabled={saving}
      onChange={handleChange}
      className={inputClass}
    >
      <option value="">Ninguna todavía</option>
      {customerOrders.map((order) => (
        <option key={order.id} value={order.id}>
          {order.order_number}
        </option>
      ))}
    </select>
  );
}
