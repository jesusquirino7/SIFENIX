import CatalogoMarca from "@/components/CatalogoMarca";
import { getMarca } from "@/data/marcas";

export const metadata = { title: "Castrol | Distribuidor Autorizado" };

export default function CastrolPage() {
  return <CatalogoMarca marca={getMarca("castrol")} />;
}
