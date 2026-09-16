import CatalogoMarca from "@/components/CatalogoMarca";
import { getMarca } from "@/data/marcas";

export const metadata = {
  title: "TURCK | Distribuidor Autorizado",
};

export default function TurckPage() {
  return <CatalogoMarca marca={getMarca("turck")} />;
}
