"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import { inputClass, labelClass } from "@/components/app/formStyles";

const EMPTY_ITEM = { part_number: "", manufacturer: "", description: "", quantity: 1 };

function fromOpportunityItem(item) {
  return {
    part_number: item.part_number || "",
    manufacturer: item.manufacturer || "",
    description: item.description || "",
    quantity: item.quantity || 1,
  };
}

export default function NuevaRfqForm({ opportunityId, suppliers, initialItems }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || "");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState(
    initialItems.length ? initialItems.map(fromOpportunityItem) : [{ ...EMPTY_ITEM }]
  );

  function updateItem(index, field, value) {
    setItems((current) =>
      current.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function addItem() {
    setItems((current) => [...current, { ...EMPTY_ITEM }]);
  }

  function removeItem(index) {
    setItems((current) => current.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    const { data: rfq, error } = await supabase
      .from("rfqs")
      .insert({
        opportunity_id: opportunityId,
        supplier_id: supplierId,
        notes: notes || null,
      })
      .select("id")
      .single();

    if (error) {
      setSaving(false);
      showToast("No se pudo crear la RFQ: " + error.message, "error");
      return;
    }

    const validItems = items
      .filter((item) => item.part_number.trim() || item.description.trim())
      .map((item) => ({
        rfq_id: rfq.id,
        part_number: item.part_number || null,
        manufacturer: item.manufacturer || null,
        description: item.description || null,
        quantity: item.quantity === "" ? 1 : Number(item.quantity),
      }));

    if (validItems.length > 0) {
      const { error: itemsError } = await supabase
        .from("rfq_items")
        .insert(validItems);

      if (itemsError) {
        setSaving(false);
        showToast(
          "La RFQ se creó, pero no se pudieron guardar los productos: " +
            itemsError.message,
          "error"
        );
        router.push(`/app/rfq-proveedores/${rfq.id}`);
        return;
      }
    }

    setSaving(false);
    showToast("RFQ creada correctamente.");
    router.push(`/app/rfq-proveedores/${rfq.id}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6"
    >
      <div>
        <label className={labelClass}>Proveedor *</label>
        <select
          required
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
          className={inputClass}
        >
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.company_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Notas para el proveedor</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className={inputClass}
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className={labelClass}>Productos a cotizar</label>
          <button
            type="button"
            onClick={addItem}
            className="text-sm font-medium text-[var(--brand-red)] hover:opacity-80"
          >
            + Agregar producto
          </button>
        </div>
        <div className="mt-2 space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-2 rounded-md border border-neutral-200 p-3"
            >
              <input
                value={item.part_number}
                onChange={(e) => updateItem(index, "part_number", e.target.value)}
                placeholder="Part number"
                className={`${inputClass} col-span-4 mt-0`}
              />
              <input
                value={item.manufacturer}
                onChange={(e) => updateItem(index, "manufacturer", e.target.value)}
                placeholder="Fabricante"
                className={`${inputClass} col-span-3 mt-0`}
              />
              <input
                value={item.description}
                onChange={(e) => updateItem(index, "description", e.target.value)}
                placeholder="Descripción"
                className={`${inputClass} col-span-3 mt-0`}
              />
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
                placeholder="Cant."
                className={`${inputClass} col-span-1 mt-0`}
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
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
          {saving ? "Guardando…" : "Crear RFQ"}
        </button>
      </div>
    </form>
  );
}
