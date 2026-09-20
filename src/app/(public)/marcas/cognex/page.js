import CatalogoMarca from "@/components/CatalogoMarca";
import { getMarca } from "@/data/marcas";

export const metadata = {
  title: "Cognex | Distribuidor Autorizado",
};

export default function CognexPage() {
  return <CatalogoMarca marca={getMarca("cognex")} />;
}
