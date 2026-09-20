// Datos de ejemplo para armar la estructura de páginas (Fase 02) y probar el
// diseño del catálogo (Fase 03). Los productos, descripciones e imágenes son
// representativos — no vienen de TURCK ni de Cognex — y se reemplazan por
// contenido e imágenes reales (del kit de distribuidor de cada marca) en la
// Fase 04, junto con el resto del contenido de la Fase 00.
export const CONTENIDO_ES_EJEMPLO = true;

export const marcas = [
  {
    slug: "turck",
    logo: "/images/marcas/turck/logo.jpg",
    nombre: "TURCK | Banner",
    resumen:
      "Sensores, conectividad y field bus para automatización industrial.",
    categorias: [
      {
        id: "sensores",
        nombre: "Sensores",
        imagen: "/images/marcas/turck/sensores.jpg",
        descripcion:
          "Sensores inductivos, fotoeléctricos, ultrasónicos y de posición.",
        enlaceOficial: "https://www.turck.com.mx/es/productgroup/Sensores",
        productos: [
          {
            nombre: "Sensores inductivos serie Bi",
            descripcion:
              "Detección sin contacto para entornos industriales exigentes.",
            imagen: "/images/marcas/turck/sensores-inductivos-bi.jpg",
            enlaceOficial:
              "https://www.turck.com.mx/es/productgroup/Sensores/Sensores%20inductivos",
          },
          {
            nombre: "Sensores fotoeléctricos",
            descripcion:
              "Detección óptica de objetos a distintas distancias y formas.",
            imagen: "/images/marcas/turck/sensores-fotoelectricos.jpg",
            // TURCK México no maneja fotoeléctricos como categoría propia
            // (línea más asociada a Banner) — se deja el link general de
            // Sensores en lo que se define el reemplazo real en Fase 04.
          },
          {
            nombre: "Sensores de posición lineal",
            descripcion: "Medición de posición para cilindros y ejes.",
            imagen: "/images/marcas/turck/sensores-posicion-lineal.jpg",
            enlaceOficial:
              "https://www.turck.com.mx/es/productgroup/Sensores/Sensores%20de%20posici%C3%B3n%20lineal",
          },
        ],
      },
      {
        id: "conectividad",
        nombre: "Conectividad",
        imagen: "/images/marcas/turck/conectividad.jpg",
        descripcion:
          "Cables, conectores y bloques de distribución para redes de campo.",
        enlaceOficial: "https://www.turck.com.mx/es/productgroup/Conectividad",
        productos: [
          {
            nombre: "Cordsets M12",
            descripcion:
              "Cables preconfeccionados para conexión rápida de sensores y actuadores.",
            imagen: "/images/marcas/turck/cordsets-m12.jpg",
            enlaceOficial:
              "https://www.turck.com.mx/es/productgroup/Conectividad/Cables",
          },
          {
            nombre: "Bloques de distribución (splitter boxes)",
            descripcion:
              "Distribución de señales de múltiples dispositivos de campo.",
            imagen: "/images/marcas/turck/bloques-distribucion.jpg",
            enlaceOficial:
              "https://www.turck.com.mx/es/productgroup/Conectividad/Caja%20de%20conexiones",
          },
          {
            nombre: "Conectores de campo",
            descripcion: "Conectores robustos para ensamble en sitio.",
            imagen: "/images/marcas/turck/conectores-campo.jpg",
            enlaceOficial:
              "https://www.turck.com.mx/es/productgroup/Conectividad/Conectores%20armables",
          },
        ],
      },
      {
        id: "field-bus",
        nombre: "Field Bus",
        imagen: "/images/marcas/turck/field-bus.jpg",
        descripcion:
          "Bloques de E/S remota e interfaces de red para bus de campo.",
        enlaceOficial:
          "https://www.turck.com.mx/es/productgroup/Buses%20de%20campo",
        productos: [
          {
            nombre: "Bloques de E/S remota",
            descripcion:
              "E/S distribuida para redes Ethernet/IP, Profinet y Modbus TCP.",
            imagen: "/images/marcas/turck/bloques-io.jpg",
            enlaceOficial:
              "https://www.turck.com.mx/es/productgroup/Buses%20de%20campo/Sistemas%20de%20E%EF%BC%8FS",
          },
          {
            nombre: "Interfaces IO-Link",
            descripcion:
              "Maestros e interfaces para integración de sensores IO-Link.",
            imagen: "/images/marcas/turck/interfaces-io-link.jpg",
            // No hay subcategoría IO-Link dedicada en turck.com.mx — se deja
            // el link general de Buses de Campo.
          },
          {
            nombre: "Módulos de seguridad",
            descripcion:
              "Dispositivos de entrada/salida para funciones de seguridad.",
            imagen: "/images/marcas/turck/modulos-seguridad.jpg",
            // Igual que arriba: seguridad aparece como landing pages, no
            // como categoría de catálogo — se deja el link general.
          },
        ],
      },
    ],
  },
  {
    slug: "cognex",
    logo: "/images/marcas/cognex/logo.png",
    nombre: "Cognex",
    resumen:
      "Visión artificial industrial: lectores de código y sistemas de visión.",
    categorias: [
      {
        id: "barcode-manuales",
        nombre: "Barcode Readers Manuales",
        imagen: "/images/marcas/cognex/barcode-manuales.jpg",
        descripcion: "Lectores de código de barras portátiles.",
        enlaceOficial:
          "https://www.cognex.com/en/products/handheld-barcode-scanners",
        productos: [
          {
            nombre: "Lector portátil DataMan 8x00",
            descripcion:
              "Lectura de códigos 1D/2D de alto desempeño en mano.",
            imagen: "/images/marcas/cognex/dataman-8x00.jpg",
          },
          {
            nombre: "Lector portátil de rango extendido",
            descripcion: "Para lectura a mayor distancia en almacén o piso.",
            imagen: "/images/marcas/cognex/dataman-rango-extendido.jpg",
          },
          {
            nombre: "Lector inalámbrico con base de carga",
            descripcion: "Movilidad sin cable en línea de producción.",
            imagen: "/images/marcas/cognex/dataman-inalambrico-base.jpg",
          },
        ],
      },
      {
        id: "barcode-estaticos",
        nombre: "Barcode Readers Estáticos",
        imagen: "/images/marcas/cognex/barcode-estaticos.jpg",
        descripcion: "Lectores de código de barras de montaje fijo.",
        enlaceOficial:
          "https://www.cognex.com/en/products/fixed-mount-barcode-scanners",
        productos: [
          {
            nombre: "Lector fijo DataMan 470",
            descripcion: "Lectura en línea de alta velocidad.",
            imagen: "/images/marcas/cognex/dataman-470.jpg",
          },
          {
            nombre: "Lector fijo para banda transportadora",
            descripcion: "Instalación sobre línea para trazabilidad.",
            imagen: "/images/marcas/cognex/lector-banda-transportadora.jpg",
          },
          {
            nombre: "Lector multi-cámara para túnel de escaneo",
            descripcion: "Cobertura de múltiples caras del producto.",
            imagen: "/images/marcas/cognex/lector-tunel-escaneo.jpg",
          },
        ],
      },
      {
        id: "sistemas-vision",
        nombre: "Sistemas de Visión",
        imagen: "/images/marcas/cognex/sistemas-vision.jpg",
        descripcion: "Cámaras inteligentes e inspección visual industrial.",
        enlaceOficial:
          "https://www.cognex.com/en/products/2d-machine-vision-systems",
        productos: [
          {
            nombre: "Sistema de visión In-Sight",
            descripcion: "Inspección y guiado de piezas en línea.",
            imagen: "/images/marcas/cognex/sistema-vision-insight.jpg",
          },
          {
            nombre: "Cámara inteligente para inspección",
            descripcion: "Detección de defectos y control de calidad.",
            imagen: "/images/marcas/cognex/camara-inteligente-inspeccion.jpg",
          },
          {
            nombre: "Sistema de visión 3D",
            descripcion: "Medición y localización tridimensional de piezas.",
            imagen: "/images/marcas/cognex/sistema-vision-3d.jpg",
          },
        ],
      },
      {
        id: "verificadores-codigos",
        nombre: "Verificadores de Códigos",
        imagen: "/images/marcas/cognex/verificadores-codigos.jpg",
        descripcion: "Verificación de calidad e impresión de códigos.",
        enlaceOficial: "https://www.cognex.com/en/products/barcode-verifiers",
        productos: [
          {
            nombre: "Verificador de códigos de barra",
            descripcion: "Cumplimiento de normas ISO/IEC de calidad.",
            imagen: "/images/marcas/cognex/verificador-codigos-barra.jpg",
          },
          {
            nombre: "Verificador de calidad de impresión",
            descripcion: "Grading de impresión en línea de empaque.",
            imagen: "/images/marcas/cognex/verificador-calidad-impresion.jpg",
          },
          {
            nombre: "Verificador en línea para empaque",
            descripcion: "Integración directa en la línea de producción.",
            imagen: "/images/marcas/cognex/verificador-inline-empaque.jpg",
          },
        ],
      },
    ],
  },
  {
    slug: "castrol",
    logo: "/images/marcas/castrol/logo.svg",
    nombre: "Castrol",
    resumen:
      "Aceites y lubricantes industriales de alto desempeño.",
    categorias: [
      {
        id: "fluidos-hidraulicos",
        nombre: "Fluidos Hidr\u00e1ulicos",
        imagen: "/images/marcas/castrol/fluidos-hidraulicos.jpg",
        descripcion:
          "Aceites hidr\u00e1ulicos para sistemas industriales de alta exigencia.",
        enlaceOficial:
          "https://www.castrol.com/es_mx/mexico/home/products/industrial/lubricants/hydraulic-fluids.html",
        productos: [
          {
            nombre: "Castrol Hyspin AWS",
            descripcion:
              "Fluido hidr\u00e1ulico antidesgaste de uso general para equipo industrial.",
            imagen: "/images/marcas/castrol/hyspin-aws.jpg",
          },
          {
            nombre: "Castrol Hyspin VG",
            descripcion:
              "Fluido hidr\u00e1ulico de alto \u00edndice de viscosidad para condiciones variables de temperatura.",
            imagen: "/images/marcas/castrol/hyspin-vg.jpg",
          },
          {
            nombre: "Castrol Tribol HM",
            descripcion:
              "Fluido hidr\u00e1ulico de alto desempe\u00f1o para sistemas exigentes.",
            imagen: "/images/marcas/castrol/tribol-hm.jpg",
          },
        ],
      },
      {
        id: "aceites-engranajes",
        nombre: "Aceites para Engranajes",
        imagen: "/images/marcas/castrol/aceites-engranajes.jpg",
        descripcion:
          "Lubricantes para engranajes industriales sujetos a cargas altas.",
        enlaceOficial:
          "https://www.castrol.com/es_mx/mexico/home/products/industrial/lubricants/gear-oils.html",
        productos: [
          {
            nombre: "Castrol Alpha SP",
            descripcion:
              "Aceite para engranajes industriales de alta carga (tipo EP).",
            imagen: "/images/marcas/castrol/alpha-sp.jpg",
          },
          {
            nombre: "Castrol Alphasyn EP",
            descripcion:
              "Aceite sint\u00e9tico para engranajes en condiciones extremas de temperatura.",
            imagen: "/images/marcas/castrol/alphasyn-ep.jpg",
          },
          {
            nombre: "Castrol Optigear BM",
            descripcion:
              "Aceite para engranajes de uso general en equipo industrial.",
            imagen: "/images/marcas/castrol/optigear-bm.jpg",
          },
        ],
      },
      {
        id: "grasas-industriales",
        nombre: "Grasas Industriales",
        imagen: "/images/marcas/castrol/grasas-industriales.jpg",
        descripcion:
          "Grasas lubricantes para rodamientos y componentes m\u00f3viles.",
        enlaceOficial:
          "https://www.castrol.com/es_mx/mexico/home/products/industrial/lubricants/greases.html",
        productos: [
          {
            nombre: "Castrol Tribol GR 100 PD",
            descripcion:
              "Grasa de alto desempe\u00f1o para rodamientos bajo carga pesada.",
            imagen: "/images/marcas/castrol/tribol-gr-100-pd.jpg",
          },
          {
            nombre: "Castrol Spheerol EPL",
            descripcion:
              "Grasa multiusos de litio para mantenimiento industrial general.",
            imagen: "/images/marcas/castrol/spheerol-epl.jpg",
          },
          {
            nombre: "Castrol Spheerol EPLX",
            descripcion:
              "Grasa multiusos de alto desempe\u00f1o para condiciones exigentes.",
            imagen: "/images/marcas/castrol/spheerol-eplx.jpg",
          },
        ],
      },
    ],
  },
];

export function getMarca(slug) {
  return marcas.find((m) => m.slug === slug);
}
