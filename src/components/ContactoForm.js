"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const INTERESES = ["TURCK", "Cognex", "OEM (cables a la medida)", "Suministros industriales", "Otro"];

const CAMPOS_INICIALES = {
  nombre: "",
  empresa: "",
  correo: "",
  telefono: "",
  interes: INTERESES[0],
  mensaje: "",
};

// Correo compartido al que llegan las solicitudes (ademas de guardarse en
// la tabla `leads` de Supabase, visible en /app/leads del sistema interno
// — ver CLAUDE.md → "Formulario de contacto / cotizaciones").
const CORREO_DESTINO = "compras1@sifenix.com";

export default function ContactoForm() {
  const [campos, setCampos] = useState(CAMPOS_INICIALES);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    if (!enviado) return;
    const timer = setTimeout(() => setEnviado(false), 6000);
    return () => clearTimeout(timer);
  }, [enviado]);

  function actualizarCampo(evento) {
    const { name, value } = evento.target;
    setCampos((anteriores) => ({ ...anteriores, [name]: value }));
  }

  function enviar(evento) {
    evento.preventDefault();

    // Se dispara sin esperar la respuesta: si se hace `await` antes de
    // abrir el mailto, el navegador deja de considerarlo resultado
    // directo del clic y bloquea la apertura del correo. El guardado
    // en Supabase corre en paralelo, sin retrasar ni depender de eso.
    const supabase = createClient();
    supabase
      .from("leads")
      .insert({
        nombre: campos.nombre,
        empresa: campos.empresa || null,
        correo: campos.correo,
        telefono: campos.telefono || null,
        interes: campos.interes,
        mensaje: campos.mensaje,
      })
      .then(({ error }) => {
        if (error) console.error("No se pudo guardar el lead:", error.message);
      });

    const asunto = `Solicitud de cotización — ${campos.interes}`;
    const cuerpo = [
      `Nombre: ${campos.nombre}`,
      campos.empresa && `Empresa: ${campos.empresa}`,
      `Correo: ${campos.correo}`,
      campos.telefono && `Teléfono: ${campos.telefono}`,
      `Interés: ${campos.interes}`,
      "",
      campos.mensaje,
    ]
      .filter(Boolean)
      .join("\n");

    const mailto = `mailto:${CORREO_DESTINO}?subject=${encodeURIComponent(
      asunto
    )}&body=${encodeURIComponent(cuerpo)}`;

    window.location.href = mailto;
    setCampos(CAMPOS_INICIALES);
    setEnviado(true);
  }

  return (
    <form
      onSubmit={enviar}
      className="mt-6 flex flex-col gap-4 rounded-lg border border-neutral-200 p-6"
    >
      {enviado && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          ¡Solicitud enviada! Nos pondremos en contacto contigo pronto.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-neutral-700">Nombre *</span>
          <input
            required
            type="text"
            name="nombre"
            value={campos.nombre}
            onChange={actualizarCampo}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-[var(--brand-red)] focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-neutral-700">Empresa</span>
          <input
            type="text"
            name="empresa"
            value={campos.empresa}
            onChange={actualizarCampo}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-[var(--brand-red)] focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-neutral-700">Correo *</span>
          <input
            required
            type="email"
            name="correo"
            value={campos.correo}
            onChange={actualizarCampo}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-[var(--brand-red)] focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-neutral-700">Teléfono</span>
          <input
            type="tel"
            name="telefono"
            value={campos.telefono}
            onChange={actualizarCampo}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-[var(--brand-red)] focus:outline-none"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-neutral-700">
          ¿Qué te interesa?
        </span>
        <select
          name="interes"
          value={campos.interes}
          onChange={actualizarCampo}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-[var(--brand-red)] focus:outline-none"
        >
          {INTERESES.map((interes) => (
            <option key={interes} value={interes}>
              {interes}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-neutral-700">Mensaje *</span>
        <textarea
          required
          name="mensaje"
          rows={4}
          value={campos.mensaje}
          onChange={actualizarCampo}
          placeholder="Cuéntanos qué necesitas: productos, cantidades, especificaciones, fechas..."
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-[var(--brand-red)] focus:outline-none"
        />
      </label>

      <div>
        <button
          type="submit"
          className="rounded-md bg-[var(--brand-red)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
        >
          Enviar solicitud
        </button>
        <p className="mt-2 text-xs text-neutral-400">
          Al enviar se abrirá tu programa de correo con esta información ya
          lista para mandárnosla.
        </p>
      </div>
    </form>
  );
}
