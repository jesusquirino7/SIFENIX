"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import ProductoForm from "../ProductoForm";

export default function EditarProductoForm({ product }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    part_number: product.part_number || "",
    manufacturer: product.manufacturer || "",
    description: product.description || "",
    category: product.category || "",
    unit: product.unit || "",
    default_cost: product.default_cost ?? "",
    default_price: product.default_price ?? "",
    currency: product.currency || "MXN",
    active: product.active,
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
      .from("products")
      .update({
        ...form,
        default_cost: form.default_cost === "" ? null : Number(form.default_cost),
        default_price:
          form.default_price === "" ? null : Number(form.default_price),
      })
      .eq("id", product.id);

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
      <ProductoForm
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
