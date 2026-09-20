"use client";

import { inputClass, labelClass } from "@/components/app/formStyles";

export default function ProveedorForm({
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
      <div>
        <label className={labelClass}>Empresa *</label>
        <input
          required
          value={form.company_name}
          onChange={(e) => onChange("company_name", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>RFC / Tax ID</label>
        <input
          value={form.tax_id}
          onChange={(e) => onChange("tax_id", e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Correo</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Teléfono</label>
          <input
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Sitio web</label>
        <input
          value={form.website}
          onChange={(e) => onChange("website", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Dirección</label>
        <input
          value={form.address}
          onChange={(e) => onChange("address", e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Ciudad</label>
          <input
            value={form.city}
            onChange={(e) => onChange("city", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Estado</label>
          <input
            value={form.state}
            onChange={(e) => onChange("state", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>C.P.</label>
          <input
            value={form.postal_code}
            onChange={(e) => onChange("postal_code", e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Notas</label>
        <textarea
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          rows={3}
          className={inputClass}
        />
      </div>

      {showActiveToggle && (
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => onChange("active", e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-[var(--brand-red)] focus:ring-[var(--brand-red)]"
          />
          Proveedor activo
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
