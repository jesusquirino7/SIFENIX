// Entidad comercial que realiza la venta — solo interno (no afecta la
// marca publica SIFENIX). Vive en opportunities.sale_entity.
export const SALE_ENTITIES = [
  { value: "sifenix", label: "Sifenix" },
  { value: "sireyes", label: "SiReyes" },
];

export function saleEntityLabel(value) {
  return SALE_ENTITIES.find((e) => e.value === value)?.label || value;
}
