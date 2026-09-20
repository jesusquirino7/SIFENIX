"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import { inputClass, labelClass } from "@/components/app/formStyles";

function fromQuotationItem(item) {
  return {
    part_number: item.part_number || "",
    manufacturer: item.manufacturer || "",
    description: item.description || "",
    quantity: item.quantity || 1,
    unit_price: item.unit_price ?? "",
  };
}

export default function NuevaOrdenClienteForm({
  quotationId,
  opportunityId,
  currency,
  initialItems,
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [customerPoNumber, setCustomerPoNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState(
    initialItems.length
      ? initialItems.map(fromQuotationItem)
      : [{ part_number: "", manufacturer: "", description: "", quantity: 1, unit_price: "" }]
  );

  function updateItem(index, field, value) {
    setItems((current) =>
      current.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
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
    const { data: order, error } = await supabase
      .from("customer_orders")
      .insert({
        opportunity_id: opportunityId,
        quotation_id: quotationId,
        customer_po_number: customerPoNumber || null,
        currency,
        notes: notes || null,
      })
      .select("id")
      .single();

    if (error) {
      setSaving(false);
      showToast("No se pudo crear la orden: " + error.message, "error");
      return;
    }

    const validItems = items
      .filter((item) => item.part_number.trim() || item.description.trim())
      .map((item) => ({
        customer_order_id: order.id,
        part_number: item.part_number || null,
        manufacturer: item.manufacturer || null,
        description: item.description || null,
        quantity: item.quantity === "" ? 1 : Number(item.quantity),
        unit_price: item.unit_price === "" ? null : Number(item.unit_price),
      }));

    if (validItems.length > 0) {
      const { error: itemsError } = await supabase
        .from("customer_order_items")
        .insert(validItems);

      if (itemsError) {
        setSaving(false);
        showToast(
          "La orden se creó, pero no se pudieron guardar las líneas: " +
            itemsError.message,
          "error"
        );
        router.push(`/app/ordenes-cliente/${order.id}`);
        return;
      }
    }

    setSaving(false);
    showToast("Orden de cliente creada correctamente.");
    router.push(`/app/ordenes-cliente/${order.id}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6"
    >
      <div>
        <label className={labelClass}>Número de orden del cliente</label>
        <input
          value={customerPoNumber}
          onChange={(e) => setCustomerPoNumber(e.target.value)}
          placeholder="Ej. PO-48213 (el folio que te dio el cliente)"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Notas</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Productos</label>
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
                value={item.description}
                onChange={(e) => updateItem(index, "description", e.target.value)}
                placeholder="Descripción"
                className={`${inputClass} col-span-4 mt-0`}
              />
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
                placeholder="Cant."
                className={`${inputClass} col-span-2 mt-0`}
              />
              <input
                type="number"
                step="0.01"
                min="0"
                value={item.unit_price}
                onChange={(e) => updateItem(index, "unit_price", e.target.value)}
                placeholder="Precio unit."
                className={`${inputClass} col-span-3 mt-0`}
              />
            </div>
          ))}
        </div>
        <p className="mt-3 text-right text-sm font-semibold text-neutral-900">
          Total: {total.toLocaleString("es-MX", { style: "currency", currency })}
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Confirmar orden"}
        </button>
      </div>
    </form>
  );
}
