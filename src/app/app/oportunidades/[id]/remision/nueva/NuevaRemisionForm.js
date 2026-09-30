"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import { inputClass, labelClass } from "@/components/app/formStyles";

const EMPTY_ROW = { part_number: "", manufacturer: "", description: "", quantity: 1 };

function fromOpportunityItem(item) {
  return {
    part_number: item.part_number || "",
    manufacturer: item.manufacturer || "",
    description: item.description || "",
    quantity: item.quantity || 1,
  };
}

export default function NuevaRemisionForm({ opportunityId, initialItems }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [deliveredAt, setDeliveredAt] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes] = useState("");
  const [rows, setRows] = useState(
    initialItems.length ? initialItems.map(fromOpportunityItem) : [{ ...EMPTY_ROW }]
  );

  function updateRow(index, field, value) {
    setRows((r) => r.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  }
  function addRow() {
    setRows((r) => [...r, { ...EMPTY_ROW }]);
  }
  function removeRow(index) {
    setRows((r) => r.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    const { data: remision, error } = await supabase
      .from("remisiones")
      .insert({
        opportunity_id: opportunityId,
        delivered_at: deliveredAt,
        notes: notes || null,
      })
      .select("id")
      .single();

    if (error) {
      setSaving(false);
      showToast("No se pudo crear la remisión: " + error.message, "error");
      return;
    }

    const validRows = rows
      .filter((r) => r.part_number.trim() || r.description.trim())
      .map((r) => ({
        remision_id: remision.id,
        part_number: r.part_number || null,
        manufacturer: r.manufacturer || null,
        description: r.description || null,
        quantity: r.quantity === "" ? 1 : Number(r.quantity),
      }));

    if (validRows.length > 0) {
      const { error: itemsError } = await supabase
        .from("remision_items")
        .insert(validRows);

      if (itemsError) {
        setSaving(false);
        showToast(
          "La remisión se creó, pero no se pudieron guardar los productos: " +
            itemsError.message,
          "error"
        );
        router.push(`/app/remisiones/${remision.id}`);
        return;
      }
    }

    setSaving(false);
    showToast("Remisión creada correctamente.");
    router.push(`/app/remisiones/${remision.id}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6"
    >
      <div>
        <label className={labelClass}>Fecha de entrega</label>
        <input
          type="date"
          required
          value={deliveredAt}
          onChange={(e) => setDeliveredAt(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Notas</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Quién recibió, número de vehículo, referencias, etc."
          className={inputClass}
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className={labelClass}>Productos entregados</label>
          <button
            type="button"
            onClick={addRow}
            className="text-sm font-medium text-[var(--brand-red)] hover:opacity-80"
          >
            + Agregar producto
          </button>
        </div>
        <div className="mt-2 space-y-3">
          {rows.map((row, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-2 rounded-md border border-neutral-200 p-3"
            >
              <input
                value={row.part_number}
                onChange={(e) => updateRow(index, "part_number", e.target.value)}
                placeholder="Part number"
                className={`${inputClass} col-span-4 mt-0`}
              />
              <input
                value={row.manufacturer}
                onChange={(e) => updateRow(index, "manufacturer", e.target.value)}
                placeholder="Fabricante"
                className={`${inputClass} col-span-3 mt-0`}
              />
              <input
                value={row.description}
                onChange={(e) => updateRow(index, "description", e.target.value)}
                placeholder="Descripción"
                className={`${inputClass} col-span-3 mt-0`}
              />
              <input
                type="number"
                min="1"
                value={row.quantity}
                onChange={(e) => updateRow(index, "quantity", e.target.value)}
                placeholder="Cant."
                className={`${inputClass} col-span-1 mt-0`}
              />
              <button
                type="button"
                onClick={() => removeRow(index)}
                disabled={rows.length === 1}
                className="col-span-1 text-sm text-neutral-400 hover:text-red-600 disabled:opacity-30"
                aria-label="Quitar producto"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Crear remisión"}
        </button>
      </div>
    </form>
  );
}
