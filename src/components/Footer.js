export default function Footer() {
  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-neutral-500">
        © {new Date().getFullYear()} Servicios Industriales Fenix S.A. de
        C.V. Todos los derechos reservados.
      </div>
    </footer>
  );
}
