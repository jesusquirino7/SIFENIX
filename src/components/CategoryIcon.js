// Iconos genéricos como marcador visual mientras no hay fotos reales de
// producto. Se muestran solo cuando el producto no trae `imagen` (ver
// ProductThumb en CatalogoMarca.js).
const ICONS = {
  sensores: (
    <>
      <circle cx="12" cy="12" r="1.6" />
      <path d="M8.5 8.5a5 5 0 0 0 0 7" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M5.5 5.5a9 9 0 0 0 0 13" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </>
  ),
  conectividad: (
    <>
      <path d="M9 7V4M15 7V4M9 20v-3M15 20v-3" />
      <rect x="6" y="7" width="12" height="10" rx="2" />
      <path d="M9 12h6" />
    </>
  ),
  "field-bus": (
    <>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <path d="M9 9h6v6H9z" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </>
  ),
  "barcode-manuales": (
    <>
      <rect x="4" y="3" width="9" height="14" rx="1.5" />
      <path d="M7 3v-1M10 3v-1" />
      <path d="M16 8l3 4-3 4" />
    </>
  ),
  "barcode-estaticos": (
    <>
      <path d="M4 5v14M8 5v14M11 5v14M15 5v14M18 5v14M20 5v14" />
    </>
  ),
  "sistemas-vision": (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  "verificadores-codigos": (
    <>
      <path d="M4 5v14M7 5v14M12 5v14M17 5v14M20 5v14" />
      <path d="M3 20l18-16" strokeWidth="1.2" opacity="0.5" />
    </>
  ),
};

export default function CategoryIcon({ id, className }) {
  const paths = ICONS[id];
  if (!paths) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}
