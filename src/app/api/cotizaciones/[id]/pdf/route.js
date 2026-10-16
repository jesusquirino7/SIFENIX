import fs from "fs";
import path from "path";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import CotizacionPDF from "@/lib/pdf/CotizacionPDF";

function readLogoDataUri() {
  try {
    const logoPath = path.join(
      process.cwd(),
      "public/brand/logo-horizontal-color.png"
    );
    return `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(request, { params }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response("No autorizado", { status: 401 });
  }

  const { data: quotation } = await supabase
    .from("quotations")
    .select(
      "*, opportunities(opportunity_number, name, customers(id, company_name, email, phone))"
    )
    .eq("id", id)
    .maybeSingle();

  if (!quotation) {
    return new Response("No encontrada", { status: 404 });
  }

  const { data: items } = await supabase
    .from("quotation_items")
    .select("*")
    .eq("quotation_id", id)
    .order("created_at", { ascending: true });

  let atencion = null;
  const customerId = quotation.opportunities?.customers?.id;
  if (customerId) {
    const { data: contact } = await supabase
      .from("customer_contacts")
      .select("name")
      .eq("customer_id", customerId)
      .eq("is_primary", true)
      .maybeSingle();
    atencion = contact?.name || null;
  }

  const buffer = await renderToBuffer(
    <CotizacionPDF
      quotation={quotation}
      items={items || []}
      logoDataUri={readLogoDataUri()}
      atencion={atencion}
    />
  );

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${quotation.quotation_number}.pdf"`,
    },
  });
}
