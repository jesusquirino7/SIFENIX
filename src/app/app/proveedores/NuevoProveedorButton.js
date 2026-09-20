"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Modal from "@/components/app/Modal";
import { useToast } from "@/components/app/ToastProvider";
import ProveedorForm from "./ProveedorForm";

const EMPTY_FORM = {
  company_name: "",
  tax_id: "",
  phone: "",
  email: "",
  website: "",
  address: "",
  city: "",
  state: "",
  postal_code: "",
  notes: "",
};

export default function NuevoProveedorButton() {
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function onChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase.from("suppliers").insert({
      ...form,
      company_name: form.company_name.trim(),
    });

    setSaving(false);

    if (error) {
      showToast("No se pudo crear el proveedor: " + error.message, "error");
      return;
    }

    showToast("Proveedor creado correctamente.");
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
        Nuevo proveedor
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Nuevo proveedor">
        <ProveedorForm
          form={form}
          onChange={onChange}
          onSubmit={handleSubmit}
          saving={saving}
          submitLabel="Guardar proveedor"
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
