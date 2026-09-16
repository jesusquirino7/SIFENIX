// Datos de ejemplo para armar la estructura de páginas (Fase 02) y probar el
// diseño del catálogo (Fase 03). Los productos, descripciones e imágenes son
// representativos — no vienen de TURCK ni de Cognex — y se reemplazan por
// contenido e imágenes reales (del kit de distribuidor de cada marca) en la
// Fase 04, junto con el resto del contenido de la Fase 00.
export const CONTENIDO_ES_EJEMPLO = true;

export const marcas = [
  {
    slug: "turck",
    nombre: "TURCK | Banner",
    resumen:
      "Sensores, conectividad y field bus para automatización industrial.",
    categorias: [
      {
        id: "sensores",
        nombre: "Sensores",
        descripcion:
          "Sensores inductivos, fotoeléctricos, ultrasónicos y de posición.",
        enlaceOficial: "https://www.turck.com.mx/es/productgroup/Sensores",
        productos: [
          {
            nombre: "Sensores inductivos serie Bi",
            descripcion:
              "Detección sin contacto para entornos industriales exigentes.",
            enlaceOficial:
              "https://www.turck.com.mx/es/productgroup/Sensores/Sensores%20inductivos",
          },
          {
            nombre: "Sensores fotoeléctricos",
            descripcion:
              "Detección óptica de objetos a distintas distancias y formas.",
            // TURCK México no maneja fotoeléctricos como categoría propia
            // (línea más asociada a Banner) — se deja el link general de
            // Sensores en lo que se define el reemplazo real en Fase 04.
          },
          {
            nombre: "Sensores de posición lineal",
            descripcion: "Medición de posición para cilindros y ejes.",
            enlaceOficial:
              "https://www.turck.com.mx/es/productgroup/Sensores/Sensores%20de%20posici%C3%B3n%20lineal",
          },
        ],
      },
      {
        id: "conectividad",
        nombre: "Conectividad",
        descripcion:
          "Cables, conectores y bloques de distribución para redes de campo.",
        enlaceOficial: "https://www.turck.com.mx/es/productgroup/Conectividad",
        productos: [
          {
            nombre: "Cordsets M12",
            descripcion:
              "Cables preconfeccionados para conexión rápida de sensores y actuadores.",
            enlaceOficial:
              "https://www.turck.com.mx/es/productgroup/Conectividad/Cables",
          },
          {
            nombre: "Bloques de distribución (splitter boxes)",
            descripcion:
              "Distribución de señales de múltiples dispositivos de campo.",
            enlaceOficial:
              "https://www.turck.com.mx/es/productgroup/Conectividad/Caja%20de%20conexiones",
          },
          {
            nombre: "Conectores de campo",
            descripcion: "Conectores robustos para ensamble en sitio.",
            enlaceOficial:
              "https://www.turck.com.mx/es/productgroup/Conectividad/Conectores%20armables",
          },
        ],
      },
      {
        id: "field-bus",
        nombre: "Field Bus",
        descripcion:
          "Bloques de E/S remota e interfaces de red para bus de campo.",
        enlaceOficial:
          "https://www.turck.com.mx/es/productgroup/Buses%20de%20campo",
        productos: [
          {
            nombre: "Bloques de E/S remota",
            descripcion:
              "E/S distribuida para redes Ethernet/IP, Profinet y Modbus TCP.",
            enlaceOficial:
              "https://www.turck.com.mx/es/productgroup/Buses%20de%20campo/Sistemas%20de%20E%EF%BC%8FS",
          },
          {
            nombre: "Interfaces IO-Link",
            descripcion:
              "Maestros e interfaces para integración de sensores IO-Link.",
            // No hay subcategoría IO-Link dedicada en turck.com.mx — se deja
            // el link general de Buses de Campo.
          },
          {
            nombre: "Módulos de seguridad",
            descripcion:
              "Dispositivos de entrada/salida para funciones de seguridad.",
            // Igual que arriba: seguridad aparece como landing pages, no
            // como categoría de catálogo — se deja el link general.
          },
        ],
      },
    ],
  },
  {
    slug: "cognex",
    nombre: "Cognex",
    resumen:
      "Visión artificial industrial: lectores de código y sistemas de visión.",
    categorias: [
      {
        id: "barcode-manuales",
        nombre: "Barcode Readers Manuales",
        descripcion: "Lectores de código de barras portátiles.",
        enlaceOficial:
          "https://www.cognex.com/en/products/handheld-barcode-scanners",
        productos: [
          {
            nombre: "Lector portátil DataMan 8x00",
            descripcion:
              "Lectura de códigos 1D/2D de alto desempeño en mano.",
          },
          {
            nombre: "Lector portátil de rango extendido",
            descripcion: "Para lectura a mayor distancia en almacén o piso.",
          },
          {
            nombre: "Lector inalámbrico con base de carga",
            descripcion: "Movilidad sin cable en línea de producción.",
          },
        ],
      },
      {
        id: "barcode-estaticos",
        nombre: "Barcode Readers Estáticos",
        descripcion: "Lectores de código de barras de montaje fijo.",
        enlaceOficial:
          "https://www.cognex.com/en/products/fixed-mount-barcode-scanners",
        productos: [
          {
            nombre: "Lector fijo DataMan 470",
            descripcion: "Lectura en línea de alta velocidad.",
          },
          {
            nombre: "Lector fijo para banda transportadora",
            descripcion: "Instalación sobre línea para trazabilidad.",
          },
          {
            nombre: "Lector multi-cámara para túnel de escaneo",
            descripcion: "Cobertura de múltiples caras del producto.",
          },
        ],
      },
      {
        id: "sistemas-vision",
        nombre: "Sistemas de Visión",
        descripcion: "Cámaras inteligentes e inspección visual industrial.",
        enlaceOficial:
          "https://www.cognex.com/en/products/2d-machine-vision-systems",
        productos: [
          {
            nombre: "Sistema de visión In-Sight",
            descripcion: "Inspección y guiado de piezas en línea.",
          },
          {
            nombre: "Cámara inteligente para inspección",
            descripcion: "Detección de defectos y control de calidad.",
          },
          {
            nombre: "Sistema de visión 3D",
            descripcion: "Medición y localización tridimensional de piezas.",
          },
        ],
      },
      {
        id: "verificadores-codigos",
        nombre: "Verificadores de Códigos",
        descripcion: "Verificación de calidad e impresión de códigos.",
        enlaceOficial: "https://www.cognex.com/en/products/barcode-verifiers",
        productos: [
          {
            nombre: "Verificador de códigos de barra",
            descripcion: "Cumplimiento de normas ISO/IEC de calidad.",
          },
          {
            nombre: "Verificador de calidad de impresión",
            descripcion: "Grading de impresión en línea de empaque.",
          },
          {
            nombre: "Verificador en línea para empaque",
            descripcion: "Integración directa en la línea de producción.",
          },
        ],
      },
    ],
  },
];

export function getMarca(slug) {
  return marcas.find((m) => m.slug === slug);
}
