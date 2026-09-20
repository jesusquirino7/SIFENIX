"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import { inputClass, labelClass } from "@/components/app/formStyles";

const EMPTY_ITEM = {
  part_number: "",
  manufacturer: "",
  description: "",
  quantity: 1,
  unit_price: "",
};

function fromOpportunityItem(item) {
  return {
    part_number: item.part_number || "",
    manufacturer: item.manufacturer || "",
    description: item.description || "",
    quantity: item.quantity || 1,
    unit_price: "",
  };
}

export default function NuevaCotizacionForm({ opportunityId, initialItems }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    valid_until: "",
    currency: "MXN",
    notes: "",
  });
  const [items, setItems] = useState(
    initialItems.length ? initialItems.map(fromOpportunityItem) : [{ ...EMPTY_ITEM }]
  );

  function onChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

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

  const total = items.reduce(
    (sum, item) =>
      sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0),
    0
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    const { data: quotation, error } = await supabase
      .from("quotations")
      .insert({
        opportunity_id: opportunityId,
        valid_until: form.valid_until || null,
        currency: form.currency,
        notes: form.notes || null,
      })
      .select("id")
      .single();

    if (error) {
      setSaving(false);
      showToast("No se pudo crear la cotización: " + error.message, "error");
      return;
    }

    const validItems = items
      .filter((item) => item.part_number.trim() || item.description.trim())
      .map((item) => ({
        quotation_id: quotation.id,
        part_number: item.part_number || null,
        manufacturer: item.manufacturer || null,
        description: item.description || null,
        quantity: item.quantity === "" ? 1 : Number(item.quantity),
        unit_price: item.unit_price === "" ? null : Number(item.unit_price),
      }));

    if (validItems.length > 0) {
      const { error: itemsError } = await supabase
        .from("quotation_items")
        .insert(validItems);

      if (itemsError) {
        setSaving(false);
        showToast(
          "La cotización se creó, pero no se pudieron guardar las líneas: " +
            itemsError.message,
          "error"
        );
        router.push(`/app/cotizaciones/${quotation.id}`);
        return;
      }
    }

    setSaving(false);
    showToast("Cotización creada correctamente.");
    router.push(`/app/cotizaciones/${quotation.id}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6"
    >
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Válida hasta</label>
          <input
            type="date"
            value={form.valid_until}
            onChange={(e) => onChange("valid_until", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Moneda</label>
          <select
            value={form.currency}
            onChange={(e) => onChange("currency", e.target.value)}
            className={inputClass}
          >
            <option value="MXN">MXN</option>
            <option value="USD">USD</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Notas</label>
        <textarea
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          rows={2}
          className={inputClass}
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className={labelClass}>Productos</label>
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
                className={`${inputClass} col-span-3 mt-0`}
              />
              <input
                value={item.manufacturer}
                onChange={(e) => updateItem(index, "manufacturer", e.target.value)}
                placeholder="Fabricante"
                className={`${inputClass} col-span-2 mt-0`}
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
              <input
                type="number"
                step="0.01"
                min="0"
                value={item.unit_price}
                onChange={(e) => updateItem(index, "unit_price", e.target.value)}
                placeholder="Precio unit."
                className={`${inputClass} col-span-2 mt-0`}
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
        <p className="mt-3 text-right text-sm font-semibold text-neutral-900">
          Total: {total.toLocaleString("es-MX", { style: "currency", currency: form.currency })}
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Crear cotización"}
        </button>
      </div>
    </form>
  );
}
