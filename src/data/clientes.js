// Empresas cliente reales de Servicios Industriales Fenix (SIFENIX), para la
// sección "Nuestros clientes". Los logos son oficiales, descargados de cada
// sitio corporativo (o de Wikipedia en el caso de Bard, que ya no publica su
// logo clásico en su propio sitio tras ser absorbida por BD) y alojados en
// public/images/clientes/ — mismo criterio de no-hotlinking que las marcas.
//
// `fondoOscuro: true` marca los logos cuyo único archivo oficial disponible
// es en blanco (pensado para fondos oscuros/de marca) — esos se muestran
// sobre una tarjeta oscura para que no desaparezcan sobre fondo blanco.
export const clientes = [
  { nombre: "Visteon", logo: "/images/clientes/visteon.png", fondoOscuro: true },
  { nombre: "Copeland", logo: "/images/clientes/copeland.svg", fondoOscuro: true },
  { nombre: "Emerson", logo: "/images/clientes/emerson.svg", fondoOscuro: true },
  { nombre: "Hutchinson", logo: "/images/clientes/hutchinson.svg", fondoOscuro: false },
  { nombre: "Carrier", logo: "/images/clientes/carrier.png", fondoOscuro: false },
  { nombre: "Bard", logo: "/images/clientes/bard.png", fondoOscuro: false },
];
