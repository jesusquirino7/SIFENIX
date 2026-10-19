"use client";

import { useState } from "react";
import Modal from "@/components/app/Modal";
import { inputClass } from "@/components/app/formStyles";

// Botón genérico para acciones consecuentes (ganar/perder/cancelar,
// confirmar pago/entrega, etc.): pide confirmación en un modal en vez
// de ejecutar de inmediato al dar clic. `onConfirm` recibe el
// comentario (string, vacío si withComment es false) y hace el
// trabajo real (update/insert + toast + router.refresh()).
export default function ConfirmButton({
  label,
  title,
  description,
  confirmLabel = "Confirmar",
  variant = "default",
  disabled,
  className,
  withComment = false,
  commentLabel = "Comentario (opcional)",
  onConfirm,
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [comment, setComment] = useState("");

  async function handleConfirm() {
    setSaving(true);
    try {
      await onConfirm(comment);
      setOpen(false);
      setComment("");
    } catch {
      // el error ya se mostró via toast dentro de onConfirm
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button type="button" disabled={disabled} onClick={() => setOpen(true)} className={className}>
        {label}
      </button>

      <Modal open={open} onClose={() => !saving && setOpen(false)} title={title}>
        {description && <p className="text-sm text-neutral-600">{description}</p>}
        {withComment && (
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={2}
            placeholder={commentLabel}
            className={`${inputClass} mt-3`}
          />
        )}
        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={saving}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 hover:border-neutral-400 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={saving}
            className={
              variant === "danger"
                ? "rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
                : "rounded-md bg-[var(--brand-red)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
            }
          >
            {saving ? "Procesando…" : confirmLabel}
          </button>
        </div>
      </Modal>
    </>
  );
}
