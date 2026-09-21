"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/app/Modal";
import { useToast } from "@/components/app/ToastProvider";
import { inputClass, labelClass } from "@/components/app/formStyles";
import { ROLES } from "./roles";
import { inviteUser } from "./actions";

const EMPTY_FORM = { email: "", fullName: "", role: "sales" };

export default function InvitarUsuarioButton() {
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  function onChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const result = await inviteUser(form);
    setSaving(false);

    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }

    showToast("Invitación enviada.");
    setForm(EMPTY_FORM);
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        Invitar usuario
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Invitar usuario">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Correo *</label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => onChange("email", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Nombre completo</label>
            <input
              value={form.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Rol</label>
            <select
              value={form.role}
              onChange={(e) => onChange("role", e.target.value)}
              className={inputClass}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-neutral-500">
            Le va a llegar un correo de Supabase con un link para que ponga su
            contraseña.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 hover:border-neutral-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Enviando…" : "Enviar invitación"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
