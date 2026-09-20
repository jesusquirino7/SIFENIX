"use client";

import { inputClass, labelClass } from "@/components/app/formStyles";

export default function ProductoForm({
  form,
  onChange,
  onSubmit,
  saving,
  submitLabel,
  onCancel,
  showActiveToggle = false,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Part number *</label>
          <input
            required
            value={form.part_number}
            onChange={(e) => onChange("part_number", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Fabricante</label>
          <input
            value={form.manufacturer}
            onChange={(e) => onChange("manufacturer", e.target.value)}
            className={inputClass}
          />
        </div>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Categoría</label>
          <input
            value={form.category}
            onChange={(e) => onChange("category", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Unidad</label>
          <input
            value={form.unit}
            onChange={(e) => onChange("unit", e.target.value)}
            placeholder="pza, m, kg…"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Costo</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.default_cost}
            onChange={(e) => onChange("default_cost", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Precio</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.default_price}
            onChange={(e) => onChange("default_price", e.target.value)}
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

      {showActiveToggle && (
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => onChange("active", e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-[var(--brand-red)] focus:ring-[var(--brand-red)]"
          />
          Producto activo
        </label>
      )}

      <div className="flex justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 hover:border-neutral-400"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Guardando…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
