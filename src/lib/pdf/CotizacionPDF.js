import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { EMPRESA } from "./empresaInfo";

const BRAND_RED = "#D71920";
const BRAND_BLACK = "#1F1F1F";
const MUTED = "#6B625B";
const BORDER = "#E5E1DE";
const STRIPE = "#FBF8F5";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingBottom: 60,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: BRAND_BLACK,
  },
  topBar: { height: 4, backgroundColor: BRAND_RED, marginBottom: 20 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  logo: { width: 130, objectFit: "contain" },
  empresaBlock: { maxWidth: 260 },
  empresaNombre: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: BRAND_RED,
    marginBottom: 6,
  },
  empresaLinea: { fontSize: 9, color: MUTED, marginBottom: 1.5 },
  tituloBlock: { alignItems: "flex-end" },
  titulo: { fontSize: 24, fontFamily: "Helvetica-Bold", color: BRAND_RED },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: BORDER,
  },
  metaLeft: {},
  metaRight: { alignItems: "flex-end" },
  metaLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  metaValue: { fontSize: 10, marginTop: 2, marginBottom: 6 },
  folio: { fontSize: 13, fontFamily: "Helvetica-Bold", marginTop: 2 },

  table: { marginTop: 16 },
  tableHeaderRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderBottomWidth: 1.5,
    borderColor: BRAND_RED,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tableRowStripe: { backgroundColor: STRIPE },
  colDesc: { width: "52%" },
  colQty: { width: "12%", textAlign: "right" },
  colPrice: { width: "18%", textAlign: "right" },
  colTotal: { width: "18%", textAlign: "right" },
  th: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    color: BRAND_RED,
    letterSpacing: 0.3,
  },
  descTitle: { fontSize: 10, fontFamily: "Helvetica-Bold" },
  descSub: { fontSize: 8, color: MUTED, marginTop: 1.5 },
  cellValue: { fontSize: 10 },

  footerArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderColor: BORDER,
  },
  notasCol: { maxWidth: 300 },
  notasLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  notasText: { fontSize: 9, color: MUTED, lineHeight: 1.4, marginBottom: 6 },
  disclaimer: { fontSize: 8, color: MUTED, marginBottom: 2 },

  totalsCol: { minWidth: 160 },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  totalsLabel: { fontSize: 9, color: MUTED },
  totalsValue: { fontSize: 9 },
  grandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderColor: BORDER,
  },
  grandLabel: { fontSize: 12, fontFamily: "Helvetica-Bold" },
  grandValue: { fontSize: 14, fontFamily: "Helvetica-Bold", color: BRAND_RED },

  footer: {
    position: "absolute",
    bottom: 26,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#948B83",
  },
});

function money(value, currency) {
  return (value ?? 0).toLocaleString("es-MX", {
    style: "currency",
    currency: currency || "MXN",
  });
}

export default function CotizacionPDF({ quotation, items, logoDataUri, atencion }) {
  const subtotal = (items || []).reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unit_price || 0),
    0
  );
  const currency = quotation.currency || "MXN";
  const aplicaIva = currency === "MXN";
  const iva = aplicaIva ? subtotal * 0.16 : 0;
  const total = subtotal + iva;
  const customer = quotation.opportunities?.customers;

  return (
    <Document title={quotation.quotation_number}>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.topBar} />

        <View style={styles.headerRow}>
          <View style={styles.empresaBlock}>
            {logoDataUri ? (
              <Image src={logoDataUri} style={[styles.logo, { marginBottom: 8 }]} />
            ) : (
              <Text style={styles.empresaNombre}>{EMPRESA.nombre}</Text>
            )}
            {EMPRESA.direccion.map((linea) => (
              <Text key={linea} style={styles.empresaLinea}>
                {linea}
              </Text>
            ))}
            <Text style={styles.empresaLinea}>RFC: {EMPRESA.rfc}</Text>
            <Text style={styles.empresaLinea}>{EMPRESA.email}</Text>
          </View>
          <View style={styles.tituloBlock}>
            <Text style={styles.titulo}>Cotización</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaLeft}>
            <Text style={styles.metaLabel}>Fecha</Text>
            <Text style={styles.metaValue}>
              {new Date(quotation.created_at).toLocaleDateString("es-MX")}
            </Text>
            {atencion && (
              <>
                <Text style={styles.metaLabel}>Atención</Text>
                <Text style={styles.metaValue}>{atencion}</Text>
              </>
            )}
            <Text style={styles.metaLabel}>Cliente</Text>
            <Text style={styles.metaValue}>{customer?.company_name || "—"}</Text>
          </View>
          <View style={styles.metaRight}>
            <Text style={styles.metaLabel}>Cotización #</Text>
            <Text style={styles.folio}>{quotation.quotation_number}</Text>
            {quotation.valid_until && (
              <>
                <Text style={[styles.metaLabel, { marginTop: 10 }]}>Válida hasta</Text>
                <Text style={styles.metaValue}>{quotation.valid_until}</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.th, styles.colDesc]}>Descripción</Text>
            <Text style={[styles.th, styles.colQty]}>Cantidad</Text>
            <Text style={[styles.th, styles.colPrice]}>P. unitario</Text>
            <Text style={[styles.th, styles.colTotal]}>Total</Text>
          </View>
          {(items || []).map((item, index) => (
            <View
              key={item.id}
              style={[styles.tableRow, index % 2 === 1 && styles.tableRowStripe]}
            >
              <View style={styles.colDesc}>
                <Text style={styles.descTitle}>
                  {item.description || item.part_number || "—"}
                </Text>
                {item.description && item.part_number && (
                  <Text style={styles.descSub}>PN: {item.part_number}</Text>
                )}
                {item.manufacturer && (
                  <Text style={styles.descSub}>{item.manufacturer}</Text>
                )}
              </View>
              <Text style={[styles.colQty, styles.cellValue]}>{item.quantity}</Text>
              <Text style={[styles.colPrice, styles.cellValue]}>
                {item.unit_price != null ? money(item.unit_price, currency) : "—"}
              </Text>
              <Text style={[styles.colTotal, styles.cellValue]}>
                {money((item.quantity || 0) * (item.unit_price || 0), currency)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footerArea}>
          <View style={styles.notasCol}>
            <Text style={styles.notasLabel}>Notas</Text>
            {quotation.notes && <Text style={styles.notasText}>{quotation.notes}</Text>}
            <Text style={styles.disclaimer}>
              {currency === "MXN" ? "Precio en moneda nacional." : "Precio en dólares americanos (USD)."}
            </Text>
            <Text style={styles.disclaimer}>Sujeto a previa venta.</Text>
            <Text style={styles.disclaimer}>
              {quotation.valid_until
                ? `Vigencia de la cotización: válida hasta el ${quotation.valid_until}.`
                : "Vigencia de la cotización: 30 días."}
            </Text>
          </View>

          <View style={styles.totalsCol}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsValue}>{money(subtotal, currency)}</Text>
            </View>
            {aplicaIva && (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>IVA 16%</Text>
                <Text style={styles.totalsValue}>{money(iva, currency)}</Text>
              </View>
            )}
            <View style={styles.grandRow}>
              <Text style={styles.grandLabel}>Total</Text>
              <Text style={styles.grandValue}>{money(total, currency)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          {EMPRESA.nombre} · {EMPRESA.email} · Esta cotización no constituye una factura.
        </Text>
      </Page>
    </Document>
  );
}
