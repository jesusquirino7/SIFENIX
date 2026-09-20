"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import ClienteForm from "../ClienteForm";

export default function EditarClienteForm({ customer }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    company_name: customer.company_name || "",
    tax_id: customer.tax_id || "",
    industry: customer.industry || "",
    phone: customer.phone || "",
    email: customer.email || "",
    website: customer.website || "",
    address: customer.address || "",
    city: customer.city || "",
    state: customer.state || "",
    postal_code: customer.postal_code || "",
    notes: customer.notes || "",
    active: customer.active,
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
      .from("customers")
      .update(form)
      .eq("id", customer.id);

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
      <ClienteForm
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
