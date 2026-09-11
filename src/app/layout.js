import "./globals.css";

export const metadata = {
  title: "Distribuidor Autorizado | Refacciones de Automatización",
  description:
    "Distribuidor autorizado de marcas de automatización industrial: catálogo por marca y cotización directa.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
