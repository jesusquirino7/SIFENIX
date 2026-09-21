"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import { inputClass, labelClass } from "@/components/app/formStyles";
import MoneyInput from "@/components/app/MoneyInput";

const EMPTY_ITEM = { part_number: "", manufacturer: "", description: "", quantity: 1 };

export default function NuevaOportunidadForm({ customers }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    customer_id: customers[0]?.id || "",
    name: "",
    description: "",
    estimated_value: "",
    currency: "MXN",
    expected_close_date: "",
  });
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);

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

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    const { data: opportunity, error } = await supabase
      .from("opportunities")
      .insert({
        customer_id: form.customer_id,
        name: form.name.trim(),
        description: form.description || null,
        estimated_value:
          form.estimated_value === "" ? null : Number(form.estimated_value),
        currency: form.currency,
        expected_close_date: form.expected_close_date || null,
      })
      .select("id")
      .single();

    if (error) {
      setSaving(false);
      showToast("No se pudo crear la oportunidad: " + error.message, "error");
      return;
    }

    const validItems = items
      .filter((item) => item.part_number.trim() || item.description.trim())
      .map((item) => ({
        opportunity_id: opportunity.id,
        part_number: item.part_number || null,
        manufacturer: item.manufacturer || null,
        description: item.description || null,
        quantity: item.quantity === "" ? 1 : Number(item.quantity),
      }));

    if (validItems.length > 0) {
      const { error: itemsError } = await supabase
        .from("opportunity_items")
        .insert(validItems);

      if (itemsError) {
        setSaving(false);
        showToast(
          "La oportunidad se creó, pero no se pudieron guardar los productos: " +
            itemsError.message,
          "error"
        );
        router.push(`/app/oportunidades/${opportunity.id}`);
        return;
      }
    }

    setSaving(false);
    showToast("Oportunidad creada correctamente.");
    router.push(`/app/oportunidades/${opportunity.id}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6"
    >
      <div>
        <label className={labelClass}>Cliente *</label>
        <select
          required
          value={form.customer_id}
          onChange={(e) => onChange("customer_id", e.target.value)}
          className={inputClass}
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.company_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Nombre de la operación *</label>
        <input
          required
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Ej. Automatización línea 3"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Descripción</label>
        <textarea
          value={form.description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={2}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Valor estimado</label>
          <MoneyInput
            value={form.estimated_value}
            onChange={(v) => onChange("estimated_value", v)}
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
        <div>
          <label className={labelClass}>Cierre esperado</label>
          <input
            type="date"
            value={form.expected_close_date}
            onChange={(e) => onChange("expected_close_date", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className={labelClass}>Productos solicitados</label>
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
          {saving ? "Guardando…" : "Crear oportunidad"}
        </button>
      </div>
    </form>
  );
}
