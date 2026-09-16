"use client";

import { useState } from "react";

const INTERESES = ["TURCK", "Cognex", "OEM (cables a la medida)", "Suministros industriales", "Otro"];

const CAMPOS_INICIALES = {
  nombre: "",
  empresa: "",
  correo: "",
  telefono: "",
  interes: INTERESES[0],
  mensaje: "",
};

// Correo compartido al que llegan las solicitudes mientras el formulario no
// está conectado a una base de datos (eso llega en la Fase 04, ver
// CLAUDE.md → "Formulario de contacto / cotizaciones"). Por ahora, al enviar
// se abre el cliente de correo del visitante con todo prellenado.
const CORREO_DESTINO = "compras1@sifenix.com";

export default function ContactoForm() {
  const [campos, setCampos] = useState(CAMPOS_INICIALES);

  function actualizarCampo(evento) {
    const { name, value } = evento.target;
    setCampos((anteriores) => ({ ...anteriores, [name]: value }));
  }

  function enviar(evento) {
    evento.preventDefault();

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
  }

  return (
    <form
      onSubmit={enviar}
      className="mt-6 flex flex-col gap-4 rounded-lg border border-neutral-200 p-6"
    >
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
