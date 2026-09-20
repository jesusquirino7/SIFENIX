import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Protege todo lo que vive bajo /app: sin sesión valida, redirige a /login.
// No corre en el sitio publico (ver `matcher` abajo), asi que no le agrega
// latencia ni riesgo a las rutas publicas.
// Next.js 16 renombro "middleware" a "proxy" (mismo comportamiento, ver
// node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md).
export async function proxy(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/app/:path*"],
};
