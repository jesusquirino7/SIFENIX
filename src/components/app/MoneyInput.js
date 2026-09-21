"use client";

import { useState } from "react";

function formatNumber(value) {
  if (value === "" || value === null || value === undefined) return "";
  const num = Number(value);
  if (Number.isNaN(num)) return "";
  return num.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Input de dinero: muestra el valor formateado (comas de miles, 2
// decimales) cuando no tiene foco, y el numero "crudo" mientras se
// escribe. `value`/`onChange` siguen manejando el mismo string numerico
// simple ("1234.5") que ya usan los formularios - solo cambia la
// presentacion visual.
export default function MoneyInput({
  value,
  onChange,
  className,
  placeholder,
  disabled = false,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <input
      type="text"
      inputMode="decimal"
      disabled={disabled}
      value={focused ? value : formatNumber(value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onChange={(e) => {
        const digitsAndDot = e.target.value.replace(/[^0-9.]/g, "");
        const parts = digitsAndDot.split(".");
        const cleaned =
          parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : digitsAndDot;
        onChange(cleaned);
      }}
      placeholder={placeholder}
      className={className}
    />
  );
}
