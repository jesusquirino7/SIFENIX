"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import { inputClass, labelClass } from "@/components/app/formStyles";
import MoneyInput from "@/components/app/MoneyInput";

function fromItem(item) {
  return {
    part_number: item.part_number || "",
    manufacturer: item.manufacturer || "",
    description: item.description || "",
    quantity: item.quantity ?? 1,
    unit_price: item.unit_price ?? "",
  };
}

const EMPTY_ROW = { part_number: "", manufacturer: "", description: "", quantity: 1, unit_price: "" };

export default function OrdenClienteEditor({ order, items, editable }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    customer_po_number: order.customer_po_number || "",
    notes: order.notes || "",
  });
  const [rows, setRows] = useState(
    items.length ? items.map(fromItem) : [{ ...EMPTY_ROW }]
  );

  const total = (items || []).reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unit_price || 0),
    0
  );

  function onChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }
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

    const { error: headerError } = await supabase
      .from("customer_orders")
      .update({
        customer_po_number: form.customer_po_number || null,
        notes: form.notes || null,
      })
      .eq("id", order.id);

    if (headerError) {
      setSaving(false);
      showToast("No se pudo guardar: " + headerError.message, "error");
      return;
    }

    await supabase.from("customer_order_items").delete().eq("customer_order_id", order.id);

    const validRows = rows
      .filter((r) => r.part_number.trim() || r.description.trim())
      .map((r) => ({
        customer_order_id: order.id,
        part_number: r.part_number || null,
        manufacturer: r.manufacturer || null,
        description: r.description || null,
        quantity: r.quantity === "" ? 1 : Number(r.quantity),
        unit_price: r.unit_price === "" ? null : Number(r.unit_price),
      }));

    if (validRows.length > 0) {
      const { error: itemsError } = await supabase
        .from("customer_order_items")
        .insert(validRows);
      if (itemsError) {
        setSaving(false);
        showToast("No se pudieron guardar los productos: " + itemsError.message, "error");
        return;
      }
    }

    setSaving(false);
    showToast("Cambios guardados.");
    setEditing(false);
    router.refresh();
  }

  if (!editing) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-500">Productos</h2>
          {editable && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-sm font-medium text-[var(--brand-red)] hover:opacity-80"
            >
              Editar
            </button>
          )}
        </div>
        {!items?.length ? (
          <p className="mt-3 text-sm text-neutral-500">Sin productos capturados.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="py-2 pr-4 font-medium">Part number</th>
                  <th className="py-2 pr-4 font-medium">Descripción</th>
                  <th className="py-2 pr-4 font-medium">Cant.</th>
                  <th className="py-2 pr-4 font-medium">P. unitario</th>
                  <th className="py-2 pr-4 font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 pr-4 font-medium text-neutral-900">
                      {item.part_number || "—"}
                    </td>
                    <td className="py-2 pr-4 text-neutral-600">
                      {item.description || "—"}
                    </td>
                    <td className="py-2 pr-4 text-neutral-600">{item.quantity}</td>
                    <td className="py-2 pr-4 text-neutral-600">
                      {item.unit_price != null
                        ? item.unit_price.toLocaleString("es-MX", {
                            style: "currency",
                            currency: order.currency,
                          })
                        : "—"}
                    </td>
                    <td className="py-2 pr-4 font-medium text-neutral-900">
                      {((item.quantity || 0) * (item.unit_price || 0)).toLocaleString(
                        "es-MX",
                        { style: "currency", currency: order.currency }
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="pt-3 text-right font-semibold text-neutral-500">
                    Total
                  </td>
                  <td className="pt-3 font-semibold text-neutral-900">
                    {total.toLocaleString("es-MX", {
                      style: "currency",
                      currency: order.currency,
                    })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6"
    >
      <h2 className="text-sm font-semibold text-neutral-500">Editar orden</h2>

      <div>
        <label className={labelClass}>Número de orden del cliente</label>
        <input
          value={form.customer_po_number}
          onChange={(e) => onChange("customer_po_number", e.target.value)}
          className={inputClass}
        />
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
                className={`${inputClass} col-span-3 mt-0`}
              />
              <input
                value={row.description}
                onChange={(e) => updateRow(index, "description", e.target.value)}
                placeholder="Descripción"
                className={`${inputClass} col-span-4 mt-0`}
              />
              <input
                type="number"
                min="1"
                value={row.quantity}
                onChange={(e) => updateRow(index, "quantity", e.target.value)}
                placeholder="Cant."
                className={`${inputClass} col-span-2 mt-0`}
              />
              <MoneyInput
                value={row.unit_price}
                onChange={(v) => updateRow(index, "unit_price", v)}
                placeholder="Precio unit."
                className={`${inputClass} col-span-2 mt-0`}
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
          type="button"
          onClick={() => setEditing(false)}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 hover:border-neutral-400"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
