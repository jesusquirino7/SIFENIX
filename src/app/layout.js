import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Servicios Industriales Fenix | Distribuidor Autorizado",
  description:
    "Servicios Industriales Fenix S.A. de C.V. — distribuidor autorizado de TURCK y Cognex, manufactura y suministros industriales.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
