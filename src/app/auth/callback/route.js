import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Punto de entrada de los links de correo de Supabase (invitación y
// "olvidé mi contraseña") - ambos llegan aquí con un "code" que hay
// que cambiar por una sesión antes de poder dejar al usuario definir
// su contraseña en /actualizar-contrasena. Sin esta ruta, el link del
// correo no tenía dónde aterrizar.
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/actualizar-contrasena";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=link_invalido`);
}
