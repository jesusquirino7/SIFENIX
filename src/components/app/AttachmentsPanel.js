"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";

function formatSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AttachmentsPanel({ entityType, entityId, attachments }) {
  const router = useRouter();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  async function handleFilesSelected(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;

    setUploading(true);
    const supabase = createClient();

    for (const file of files) {
      const storagePath = `${entityType}/${entityId}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(storagePath, file);

      if (uploadError) {
        showToast(`No se pudo subir "${file.name}": ${uploadError.message}`, "error");
        continue;
      }

      const { error: insertError } = await supabase.from("attachments").insert({
        entity_type: entityType,
        entity_id: entityId,
        file_name: file.name,
        storage_path: storagePath,
        file_size: file.size,
        content_type: file.type || null,
      });

      if (insertError) {
        showToast(`"${file.name}" se subió pero no se pudo registrar: ${insertError.message}`, "error");
      }
    }

    setUploading(false);
    showToast("Archivos subidos correctamente.");
    router.refresh();
  }

  async function handleDownload(attachment) {
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(attachment.storage_path, 60);

    if (error || !data?.signedUrl) {
      showToast("No se pudo generar el link de descarga.", "error");
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  async function handleDelete(attachment) {
    setPendingDeleteId(attachment.id);
    const supabase = createClient();

    await supabase.storage.from("documents").remove([attachment.storage_path]);
    const { error } = await supabase.from("attachments").delete().eq("id", attachment.id);

    setPendingDeleteId(null);

    if (error) {
      showToast("No se pudo eliminar el archivo: " + error.message, "error");
      return;
    }

    showToast("Archivo eliminado.");
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-500">
          Archivos adjuntos
        </h2>
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="text-sm font-medium text-[var(--brand-red)] hover:opacity-80 disabled:opacity-50"
        >
          {uploading ? "Subiendo…" : "+ Subir archivo"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFilesSelected}
          className="hidden"
        />
      </div>

      {!attachments?.length ? (
        <p className="mt-3 text-sm text-neutral-500">
          Sin archivos todavía — sube cotizaciones en PDF, hojas de datos u
          otros documentos de respaldo.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-neutral-100">
          {attachments.map((attachment) => (
            <li
              key={attachment.id}
              className="flex items-center justify-between gap-3 py-2 text-sm"
            >
              <button
                type="button"
                onClick={() => handleDownload(attachment)}
                className="min-w-0 flex-1 truncate text-left font-medium text-neutral-900 hover:text-[var(--brand-red)]"
                title={attachment.file_name}
              >
                {attachment.file_name}
              </button>
              <span className="shrink-0 text-xs text-neutral-400">
                {formatSize(attachment.file_size)}
              </span>
              <button
                type="button"
                disabled={pendingDeleteId === attachment.id}
                onClick={() => handleDelete(attachment)}
                className="shrink-0 text-xs text-neutral-400 hover:text-red-600 disabled:opacity-50"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
