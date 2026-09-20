import "./globals.css";

export const metadata = {
  title: "SIFENIX | Servicios Industriales Fenix — Distribuidor Autorizado",
  description:
    "SIFENIX — Servicios Industriales Fenix S.A. de C.V. — distribuidor autorizado de TURCK y Cognex, fabricación OEM y suministros industriales.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
