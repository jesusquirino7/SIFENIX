"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import { inputClass } from "@/components/app/formStyles";
import MoneyInput from "@/components/app/MoneyInput";

export default function RfqItemsEditor({ items: initialItems, locked = false }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [items, setItems] = useState(
    initialItems.map((item) => ({
      ...item,
      supplier_unit_cost: item.supplier_unit_cost ?? "",
      supplier_lead_time_days: item.supplier_lead_time_days ?? "",
    }))
  );
  const [saving, setSaving] = useState(false);

  function updateItem(index, field, value) {
    setItems((current) =>
      current.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();

    const results = await Promise.all(
      items.map((item) =>
        supabase
          .from("rfq_items")
          .update({
            supplier_unit_cost:
              item.supplier_unit_cost === "" ? null : Number(item.supplier_unit_cost),
            supplier_lead_time_days:
              item.supplier_lead_time_days === ""
                ? null
                : Number(item.supplier_lead_time_days),
          })
          .eq("id", item.id)
      )
    );

    setSaving(false);

    const failed = results.find((r) => r.error);
    if (failed) {
      showToast("No se pudo guardar: " + failed.error.message, "error");
      return;
    }

    showToast("Respuesta del proveedor guardada.");
    router.refresh();
  }

  if (!items.length) {
    return <p className="mt-3 text-sm text-neutral-500">Sin productos capturados.</p>;
  }

  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
          <tr>
            <th className="py-2 pr-4 font-medium">Part number</th>
            <th className="py-2 pr-4 font-medium">Descripción</th>
            <th className="py-2 pr-4 font-medium">Cant.</th>
            <th className="py-2 pr-4 font-medium">Costo unitario</th>
            <th className="py-2 pr-4 font-medium">Entrega (días)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {items.map((item, index) => (
            <tr key={item.id}>
              <td className="py-2 pr-4 font-medium text-neutral-900">
                {item.part_number || "—"}
              </td>
              <td className="py-2 pr-4 text-neutral-600">
                {item.description || item.manufacturer || "—"}
              </td>
              <td className="py-2 pr-4 text-neutral-600">{item.quantity}</td>
              <td className="py-2 pr-4">
                <MoneyInput
                  disabled={locked}
                  value={item.supplier_unit_cost}
                  onChange={(v) => updateItem(index, "supplier_unit_cost", v)}
                  className={`${inputClass} mt-0 w-28 disabled:opacity-60`}
                />
              </td>
              <td className="py-2 pr-4">
                <input
                  type="number"
                  min="0"
                  disabled={locked}
                  value={item.supplier_lead_time_days}
                  onChange={(e) =>
                    updateItem(index, "supplier_lead_time_days", e.target.value)
                  }
                  className={`${inputClass} mt-0 w-24 disabled:opacity-60`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {locked ? (
        <p className="mt-4 text-xs text-neutral-400">
          Ya no se puede editar — la RFQ está marcada como respondida o vencida.
          Reábrela (botón "Marcar como borrador") si necesitas corregir algo.
        </p>
      ) : (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Guardando…" : "Guardar respuesta del proveedor"}
          </button>
        </div>
      )}
    </div>
  );
}
