"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import { inputClass, labelClass } from "@/components/app/formStyles";
import MoneyInput from "@/components/app/MoneyInput";

export default function EditarOportunidadForm({ opportunity }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: opportunity.name || "",
    description: opportunity.description || "",
    estimated_value: opportunity.estimated_value ?? "",
    currency: opportunity.currency || "MXN",
    expected_close_date: opportunity.expected_close_date || "",
  });

  function onChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("opportunities")
      .update({
        ...form,
        name: form.name.trim(),
        description: form.description || null,
        estimated_value:
          form.estimated_value === "" ? null : Number(form.estimated_value),
        expected_close_date: form.expected_close_date || null,
      })
      .eq("id", opportunity.id);

    setSaving(false);

    if (error) {
      showToast("No se pudo guardar: " + error.message, "error");
      return;
    }

    showToast("Cambios guardados.");
    setEditing(false);
    router.refresh();
  }

  if (!editing) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold tracking-tight">
            {opportunity.name}
          </h2>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="shrink-0 text-sm font-medium text-[var(--brand-red)] hover:opacity-80"
          >
            Editar
          </button>
        </div>
        {opportunity.description && (
          <p className="mt-2 text-sm text-neutral-600">
            {opportunity.description}
          </p>
        )}
        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-neutral-500">Valor estimado</dt>
            <dd className="font-medium text-neutral-900">
              {opportunity.estimated_value != null
                ? `${opportunity.estimated_value} ${opportunity.currency}`
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Cierre esperado</dt>
            <dd className="font-medium text-neutral-900">
              {opportunity.expected_close_date || "—"}
            </dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6"
    >
      <div>
        <label className={labelClass}>Nombre de la operación *</label>
        <input
          required
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
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
