"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import ProveedorForm from "../ProveedorForm";

export default function EditarProveedorForm({ supplier }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    company_name: supplier.company_name || "",
    tax_id: supplier.tax_id || "",
    phone: supplier.phone || "",
    email: supplier.email || "",
    website: supplier.website || "",
    address: supplier.address || "",
    city: supplier.city || "",
    state: supplier.state || "",
    postal_code: supplier.postal_code || "",
    notes: supplier.notes || "",
    active: supplier.active,
  });
  const [saving, setSaving] = useState(false);

  function onChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("suppliers")
      .update(form)
      .eq("id", supplier.id);

    setSaving(false);

    if (error) {
      showToast("No se pudo guardar: " + error.message, "error");
      return;
    }

    showToast("Cambios guardados.");
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <ProveedorForm
        form={form}
        onChange={onChange}
        onSubmit={handleSubmit}
        saving={saving}
        submitLabel="Guardar cambios"
        showActiveToggle
      />
    </div>
  );
}
