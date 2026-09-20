import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/app/Sidebar";
import Topbar from "@/components/app/Topbar";
import { ToastProvider } from "@/components/app/ToastProvider";

export const metadata = {
  title: "Sistema interno · SIFENIX",
  robots: { index: false, follow: false },
};

export default async function AppLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // El middleware (src/middleware.js) ya protege /app/*, pero validamos de
  // nuevo aquí por defensa en profundidad — ninguna página bajo /app debe
  // renderizar sin una sesión válida.
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-neutral-50">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar profile={profile} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
