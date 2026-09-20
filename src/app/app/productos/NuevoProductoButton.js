"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Modal from "@/components/app/Modal";
import { useToast } from "@/components/app/ToastProvider";
import ProductoForm from "./ProductoForm";

const EMPTY_FORM = {
  part_number: "",
  manufacturer: "",
  description: "",
  category: "",
  unit: "",
  default_cost: "",
  default_price: "",
  currency: "MXN",
};

export default function NuevoProductoButton() {
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
    const { error } = await supabase.from("products").insert({
      ...form,
      part_number: form.part_number.trim(),
      default_cost: form.default_cost === "" ? null : Number(form.default_cost),
      default_price:
        form.default_price === "" ? null : Number(form.default_price),
    });

    setSaving(false);

    if (error) {
      showToast("No se pudo crear el producto: " + error.message, "error");
      return;
    }

    showToast("Producto creado correctamente.");
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
        Nuevo producto
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Nuevo producto">
        <ProductoForm
          form={form}
          onChange={onChange}
          onSubmit={handleSubmit}
          saving={saving}
          submitLabel="Guardar producto"
          onCancel={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
