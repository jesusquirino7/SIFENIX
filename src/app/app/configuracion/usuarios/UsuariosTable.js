"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/app/ToastProvider";
import { ROLES } from "./roles";

export default function UsuariosTable({ profiles, currentUserId }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [savingId, setSavingId] = useState(null);

  async function updateProfile(profile, patch) {
    setSavingId(profile.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", profile.id);
    setSavingId(null);

    if (error) {
      showToast("No se pudo guardar: " + error.message, "error");
      return;
    }

    showToast("Cambios guardados.");
    router.refresh();
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
          <tr>
            <th className="px-4 py-3 font-medium">Nombre</th>
            <th className="px-4 py-3 font-medium">Correo</th>
            <th className="px-4 py-3 font-medium">Rol</th>
            <th className="px-4 py-3 font-medium">Activo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {profiles.map((profile) => {
            const isSelf = profile.user_id === currentUserId;
            const saving = savingId === profile.id;
            return (
              <tr key={profile.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 font-medium text-neutral-900">
                  {profile.full_name}
                  {isSelf && (
                    <span className="ml-2 text-xs font-normal text-neutral-400">
                      (tú)
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-neutral-600">{profile.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={profile.role}
                    disabled={isSelf || saving}
                    onChange={(e) => updateProfile(profile, { role: e.target.value })}
                    className="rounded-md border border-neutral-300 px-2 py-1.5 text-sm disabled:opacity-50"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={profile.active}
                    disabled={isSelf || saving}
                    onChange={(e) =>
                      updateProfile(profile, { active: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-neutral-300 text-[var(--brand-red)] focus:ring-[var(--brand-red)] disabled:opacity-50"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
