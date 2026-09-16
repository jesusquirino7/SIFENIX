# Contexto del proyecto

Sitio web de **Servicios Industriales Fenix S.A. de C.V.** (antes operaba como "SIR" — Manufactura / Suministros Industriales), distribuidor autorizado de varias marcas de automatización industrial.

Misión: brindar soluciones de manufactura y suministro. Visión: establecer relaciones a largo plazo que permitan crecer junto con los clientes.

Además de la distribución, la empresa ofrece fabricación OEM de cables/arneses a la medida (para sensores, termopares, gabinetes, motores, etc. — ver `src/app/oem/page.js`) para sectores mecánico, automotriz, médico, HVAC y otros; y suministros industriales (consumibles, refacciones, inventario de seguridad). El bloque de "Manufactura" (maquinado, estructuras metálicas, soldadura) de la presentación vieja se quitó a propósito — el enfoque del sitio es OEM, no manufactura general.

Contacto actual (de la marca anterior, revisar si cambia con el rebrand a Fenix): tel. 899-332-3720, correo ventas@sireyes.com, WhatsApp 899-873-4596 (Juan Carlos González).

## Alcance
- Catálogo de marcas representadas + formulario de contacto/cotización.
- Sin carrito de compras / e-commerce.

## Stack
- Next.js (App Router) + JavaScript (sin TypeScript) + Tailwind CSS.
- Despliegue planeado en Vercel.

## Marcas
Marcas principales: **TURCK** y **Cognex**.
- TURCK: catálogo con 3 categorías — Sensores, Conectividad, Field Bus.
- Cognex: catálogo con 4 categorías — Barcode Readers Manuales, Barcode Readers Estáticos, Sistemas de Visión, Verificadores de Códigos. (Los cables OEM de integración ya no van aquí — viven en la página `/oem`, que es de fabricación propia, no de una marca.)

Los datos de marcas/categorías/productos viven en `src/data/marcas.js` (un arreglo de marcas, cada una con `categorias` y `productos`). Los productos ahí son de EJEMPLO (`CONTENIDO_ES_EJEMPLO = true`) — no son SKUs ni imágenes reales de TURCK/Cognex. Se reemplazan en la Fase 04 con datos reales, idealmente obtenidos del kit/portal de distribuidor de cada marca (no hay una API pública confirmada de TURCK o Cognex para esto).

### Enlaces a páginas oficiales
Cada categoría en `src/data/marcas.js` trae un campo `enlaceOficial` con la URL de esa categoría en el sitio oficial de la marca — **turck.com.mx** (México, no turck.us) para TURCK, cognex.com para Cognex. Además, cada producto puede traer su propio `enlaceOficial` más específico (subcategoría exacta del sitio oficial, ej. `.../productgroup/Conectividad/Caja%20de%20conexiones`); si el producto no trae uno, se usa el de su categoría como respaldo (`producto.enlaceOficial || categoria.enlaceOficial` en `CatalogoMarca.js`). En `CatalogoMarca.js`, el título de cada producto (no un botón aparte) es el link — abre en pestaña nueva y muestra una flechita ↗ al hacer hover. Sirve para que el visitante vea specs/fotos reales y actuales mientras el catálogo propio usa contenido de ejemplo.

Nota: no todos los productos de ejemplo tienen una subcategoría exacta en turck.com.mx (ej. "Sensores fotoeléctricos" e "Interfaces IO-Link" no existen como categoría propia del catálogo ahí) — en esos casos se deja sin `enlaceOficial` propio y cae al link general de la categoría. Al reemplazar con SKUs reales en la Fase 04, revisar/ajustar estos enlaces por producto.

### Imágenes de producto
Mientras no hay fotos reales, cada renglón del catálogo (`src/components/CatalogoMarca.js` → `ProductThumb`) muestra un ícono genérico por categoría (`src/components/CategoryIcon.js`) en vez de una imagen. Para poner una foto real: 1) coloca el archivo en `public/images/marcas/<marca>/<archivo>.jpg`, 2) agrega `imagen: "/images/marcas/<marca>/<archivo>.jpg"` al producto correspondiente en `src/data/marcas.js` — no hay que tocar el componente. NO usar hotlinking a imágenes de turck.com o cognex.com (URLs frágiles, riesgo de bloqueo); las fotos reales deben descargarse del kit de distribuidor y alojarse en este proyecto.

## Plan de lanzamiento
El proyecto sigue un plan de 8 fases (00 a 07), con una validación al final de cada una antes de avanzar a la siguiente:

00. Fundamentos y contenido base — LISTA (nombre: Servicios Industriales Fenix S.A. de C.V.; marcas: TURCK y Cognex; categorías definidas; misión/visión y contacto tomados de la presentación vieja)
01. Entorno de desarrollo — LISTA: corre con `npm run dev`, git inicializado.
02. Arquitectura de páginas — LISTA: Inicio, Marcas (índice + /marcas/turck + /marcas/cognex), OEM (/oem), Nosotros, Contacto. Nav en `src/components/Header.js`.
03. Construcción de páginas base — EN PROGRESO: layout compartido (Header/Footer) y página de Marcas con catálogo por categoría ya están. Falta pulir Inicio (hero + CTA) y Contacto (formulario).
04. Contenido real y formulario funcional — SIGUIENTE: reemplazar `src/data/marcas.js` con datos/imágenes reales y conectar el formulario de contacto.
05. Dominio, hosting y HTTPS (Vercel)
06. SEO básico y pruebas finales
07. Lanzamiento y seguimiento

## Notas para quien trabaje en este repo
- El dueño del proyecto es ingeniero de control/mecatrónica, nuevo en desarrollo de software — explica los pasos de forma clara y sin dar por hecho experiencia previa en JS/React.
- Sin dominio, hosting ni material de marca (logos, lista de marcas, fotos) todavía — se define en la Fase 00.
- No agregues TypeScript ni cambies el gestor de paquetes (npm) sin que se pida explícitamente.
