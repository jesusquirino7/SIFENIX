# Contexto del proyecto

Sitio web de **Servicios Industriales Fenix S.A. de C.V.** (antes operaba como "SIR" — Manufactura / Suministros Industriales), distribuidor autorizado de varias marcas de automatización industrial.

Misión: brindar soluciones de manufactura y suministro. Visión: establecer relaciones a largo plazo que permitan crecer junto con los clientes.

Además de la distribución, la empresa ofrece fabricación OEM de cables/arneses a la medida (para sensores, termopares, gabinetes, motores, etc. — ver `src/app/oem/page.js`) para sectores mecánico, automotriz, médico, HVAC y otros; y suministros industriales (consumibles, refacciones, inventario de seguridad). El bloque de "Manufactura" (maquinado, estructuras metálicas, soldadura) de la presentación vieja se quitó a propósito — el enfoque del sitio es OEM, no manufactura general.

`/oem` también incluye una sección "Manufactura TURCK cerca de nosotros" con datos reales (verificados por búsqueda web, fuentes: Zócalo, Somos Industria, Mexico Industry, directorios industriales) sobre la planta que TURCK opera en Arteaga/Saltillo, Coahuila (conocida como "Mirus"): fabrica conectividad (cordsets, receptáculos, módulos de E/S), +900 empleados, +175,000 ft², 96% de exportación, entrega típica de 10 días. Se presenta explícitamente como información de la planta de TURCK (no de nuestra fabricación propia) y la relación se describe como "distribuidores autorizados de TURCK" en general — sin afirmar una relación de distribución específica con esa planta, por decisión explícita del dueño del proyecto.

Contacto actual (actualizado por el dueño con el dominio real de la marca, reemplaza el contacto viejo de "ventas@sireyes.com"): un solo correo compartido, compras1@sifenix.com — decisión explícita del dueño de no publicar nombres ni teléfonos individuales. Vive en la constante `CORREO_CONTACTO` dentro de `src/app/contacto/page.js` (y `CORREO_DESTINO` en `src/components/ContactoForm.js`, mismo correo).

## Identidad visual (marca "SIFENIX")
El dueño compartió el kit de marca ya terminado: el nombre comercial/logo es **SIFENIX** (wordmark "SI" en negro + "FENIX" en rojo, con un ícono de fénix/ave en rojo-naranja a la izquierda), con "Servicios Industriales S.A. de C.V." como subtítulo y el tagline **"Soluciones que impulsan tu industria"**. El nombre legal completo sigue siendo Servicios Industriales Fenix S.A. de C.V. (se usan los dos: "SIFENIX" como marca/logo, el nombre legal completo en copy formal como el footer).

Paleta de colores (definida como variables CSS en `src/app/globals.css`, usar `var(--brand-rojo)` etc. o las clases arbitrarias de Tailwind `bg-[var(--brand-red)]`):
- `--brand-red: #D71920` (rojo principal — acentos, botones, links activos)
- `--brand-orange: #FF5A3C` (naranja secundario — degradado del ícono, poco usado directo en UI por ahora)
- `--brand-black: #1F1F1F`
- `--brand-gray: #D9D9D9`

Assets de marca ya están en el repo (recortados y con fondo transparente a partir del kit que compartió el dueño):
- `public/brand/logo-horizontal-color.png` — logo horizontal a color, usado en `Header.js`
- `public/brand/logo-horizontal-black.png` — variante en negro (para fondos claros donde no se quiera usar rojo)
- `public/brand/logo-full.png` — logo apilado completo (ícono + wordmark + subtítulo + tagline), usado en el hero de `page.js`
- `public/brand/icon-mark.png` — solo el ícono del fénix, fondo transparente
- `src/app/icon.png` — favicon/app icon (usa la convención de Next.js App Router: cualquier archivo `icon.png` dentro de `src/app/` se sirve automáticamente como favicon, no hace falta configurarlo en `layout.js`)

Si el dueño comparte una versión en mejor resolución del logo o nuevas variantes (ej. sobre fondo oscuro para un futuro hero con foto industrial), reemplazar estos mismos archivos en `public/brand/` en vez de crear nombres nuevos, así no hay que tocar el código que ya los referencia.

Aplicado ya en: `Header.js` (logo real + hover rojo en nav), `Footer.js` (borde superior rojo + nombre "SIFENIX"), `page.js` (hero + secciones de Inicio, ver abajo), `oem/page.js` (botón de cotización rojo), `CatalogoMarca.js` (pills de categoría y flechita ↗ en rojo al hover), `nosotros/page.js` (sección "Nuestros valores").

Los 5 valores de marca (Seguridad, Compromiso, Eficiencia, Innovación, Confianza) viven en `src/data/valores.js` (`VALORES`) porque se usan tanto en `/nosotros` como en Inicio — si cambian, editar ahí una sola vez.

### Página de Inicio (`src/app/page.js`)
Estructura actual, de arriba a abajo (decidida junto con el dueño para que Inicio no sea solo el logo y dos botones):
1. Hero: logo completo (`logo-full.png`) + resumen corto + botones "Solicitar cotización" (rojo) y "Ver catálogo" (outline).
2. "Marcas que representamos": tarjetas generadas automáticamente desde `marcas` en `src/data/marcas.js` (una por marca — hoy TURCK y Cognex) — si se agrega una marca nueva a ese archivo, aparece aquí solo.
3. "Qué hacemos": 3 tarjetas fijas (`QUE_HACEMOS` en `page.js`) — Distribución de marcas, Fabricación OEM, Suministros industriales — mismo contenido que la lista de `/nosotros` pero en formato de tarjeta.
4. "Nuestros valores": misma fila de pills que `/nosotros`, usando `VALORES` de `src/data/valores.js`.
5. CTA final: banner oscuro (`--brand-black`) de ancho completo con el tagline, teléfono/WhatsApp y botón rojo "Contáctanos" — estilo pedido explícitamente por el dueño (como el banner del kit de marca), a diferencia del resto del sitio que es fondo claro.

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

### Formulario de contacto / cotizaciones → base de datos compartida con el dashboard (Fase 04)
Decisión (confirmada por el dueño del proyecto): el formulario de `/contacto`, al conectarse en la Fase 04, NO solo va a mandar un correo — va a **guardar cada cotización en Supabase** (Postgres gratis y hospedado), para que ese mismo backend alimente después el dashboard interno de la empresa (ver proyecto separado "parts-company-app": cotizaciones pendientes, pedidos entrantes, facturación interna, web y móvil) sin duplicar trabajo.

Por qué Supabase (en vez de Vercel Postgres o Google Sheets): trae de fábrica un panel web donde el dueño puede ver/editar los registros a mano mientras el dashboard no existe, y una API REST lista para que tanto el sitio (Next.js) como el futuro dashboard (web o app móvil) lean/escriban los mismos datos sin que el dueño tenga que programar un panel de administración desde cero.

**Son 3 tablas/flujos distintos** (confirmado por el dueño), todas pensadas para capturarse A MANO en la fase inicial (directo en el panel de tablas de Supabase, sin construir pantallas propias todavía) salvo la primera que además se llena sola desde el sitio. Ligar una cuenta de correo para crear cualquiera de las tres automáticamente (parseando correos entrantes) queda como mejora futura, no para la fase inicial:

1. `cotizaciones` — **solicitudes de cotización de nuestros clientes.** Se crean solas cuando alguien manda el formulario de `/contacto` del sitio, y también se pueden capturar a mano (cotizaciones que lleguen por teléfono, WhatsApp o en persona).
   - `id`, `creado_en`, `nombre`, `empresa` (opcional), `correo`, `telefono`, `interes` (TURCK / Cognex / OEM / Suministros / otro), `mensaje`, `origen` (`"sitio web"` / `"manual"`), `estatus` (default `"nueva"`)

2. `ordenes_compra_clientes` — **órdenes de compra de nuestros clientes** (cuando una cotización se convierte en venta confirmada). Captura manual en la fase inicial.
   - `id`, `creado_en`, `cliente`, `cotizacion_id` (opcional, liga a la cotización de origen), `descripcion`/materiales, `monto` (opcional), `estatus` (ej. `"confirmada"` / `"en proceso"` / `"entregada"`)

3. `compras_proveedores` — **seguimiento de nuestras compras a nuestros proveedores** (TURCK, Cognex, etc. — pedidos/materiales entrantes para reabastecer inventario). Captura manual en la fase inicial.
   - `id`, `creado_en`, `proveedor`, `numero_pedido` (opcional), `descripcion`/materiales, `fecha_esperada` (opcional), `estatus` (ej. `"pedido"` / `"en tránsito"` / `"recibido"`)

Pendiente antes de poder implementar esto: el dueño necesita crear una cuenta y proyecto gratis en supabase.com y compartir la URL + anon key del proyecto (se guardan como variables de entorno en Vercel, nunca en el código). Esto se hace al arrancar la Fase 04, no antes.

**Formulario interino (mientras no hay Supabase):** `src/components/ContactoForm.js` (client component, usado por `src/app/contacto/page.js`) ya es un formulario real y funcional con los mismos campos que la tabla `cotizaciones` de arriba (nombre, empresa, correo, teléfono, interés, mensaje). Como todavía no existe el backend de Supabase, al enviar arma un `mailto:` con toda la información y abre el cliente de correo del visitante hacia `compras1@sifenix.com` (constante `CORREO_DESTINO` en ese archivo) — no es ideal (depende de que el visitante tenga un cliente de correo configurado) pero es honesto y funciona hoy sin infraestructura. **Cuando se conecte Supabase en la Fase 04**, reemplazar el `mailto:` en la función `enviar()` por un `insert` a la tabla `cotizaciones` (con `origen: "sitio web"`), sin tocar el resto del formulario. El diseño de la página pone el formulario primero y a la vista, con el contacto directo (`CORREO_CONTACTO` en `contacto/page.js`, solo el correo compras1@sifenix.com — sin nombres ni teléfonos) como bloque secundario más abajo — decisión explícita del dueño para que el visitante deje sus datos en vez de solo consultar los nuestros.

## Plan de lanzamiento
El proyecto sigue un plan de 8 fases (00 a 07), con una validación al final de cada una antes de avanzar a la siguiente:

00. Fundamentos y contenido base — LISTA (nombre: Servicios Industriales Fenix S.A. de C.V.; marcas: TURCK y Cognex; categorías definidas; misión/visión y contacto tomados de la presentación vieja)
01. Entorno de desarrollo — LISTA: corre con `npm run dev`, git inicializado.
02. Arquitectura de páginas — LISTA: Inicio, Marcas (índice + /marcas/turck + /marcas/cognex), OEM (/oem), Nosotros, Contacto. Nav en `src/components/Header.js`.
03. Construcción de páginas base — EN PROGRESO: layout compartido (Header/Footer), página de Marcas con catálogo por categoría, e Inicio (hero + Marcas destacadas + Qué hacemos + Nuestros valores + CTA final) ya están. Falta Contacto (formulario).
04. Contenido real y formulario funcional — SIGUIENTE: reemplazar `src/data/marcas.js` con datos/imágenes reales y conectar el formulario de contacto a Supabase (ver sección "Formulario de contacto / cotizaciones" arriba) para que guarde cada cotización en base de datos, no solo mande un correo.
05. Dominio, hosting y HTTPS (Vercel)
06. SEO básico y pruebas finales
07. Lanzamiento y seguimiento

## Notas para quien trabaje en este repo
- El dueño del proyecto es ingeniero de control/mecatrónica, nuevo en desarrollo de software — explica los pasos de forma clara y sin dar por hecho experiencia previa en JS/React.
- Sin dominio, hosting ni material de marca (logos, lista de marcas, fotos) todavía — se define en la Fase 00.
- No agregues TypeScript ni cambies el gestor de paquetes (npm) sin que se pida explícitamente.
