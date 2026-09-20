# Contexto del proyecto

Sitio web de **Servicios Industriales Fenix S.A. de C.V.** (antes operaba como "SIR" — Manufactura / Suministros Industriales), distribuidor autorizado de varias marcas de automatización industrial (TURCK, Cognex) y de aceites/lubricantes industriales (Castrol).

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
Reorganizada (tercera versión — el dueño pidió no abrir con "somos distribuidores..." sino algo más extenso sobre qué hacemos, misión y visión). Orden actual, de arriba a abajo:
1. Encabezado corto de texto: eyebrow "Soluciones que impulsan tu industria" + `<h1>Soluciones industriales integrales</h1>` (antes decía "Distribuidor autorizado de TURCK y Cognex" — se cambió a propósito para no abrir mencionando "distribuidor") + resumen corto que ahora sí menciona las 3 líneas de negocio (distribución de marcas, fabricación OEM, suministros industriales) + botones "Solicitar cotización" (rojo) y "Ver catálogo" (outline). Ya NO lleva el logo grande (`logo-full.png`); el logo sigue visible en `Header.js` (nav) como antes.
2. "Misión y visión": se subió aquí (antes iba después de "Marcas que representamos") y se amplió el texto — ya no es una sola línea por cada una, sino un párrafo corto que desarrolla cómo se combinan las 3 líneas de negocio (misión) y hacia dónde apunta la empresa (visión). Mismo texto ampliado en `/nosotros` (`src/app/nosotros/page.js`) — si el texto cambia, actualizar en los dos lugares.
3. "Qué hacemos": 2 tarjetas fijas (`QUE_HACEMOS` en `page.js`) — Fabricación OEM y Suministros industriales. No incluye una tarjeta de "Distribución de marcas": se quitó porque quedaba repetida con la sección de Marcas justo abajo; la distribución ya se menciona en el encabezado y en Misión, y tiene su propia sección con logos en el punto 4.
4. "Marcas que representamos": tarjetas generadas automáticamente desde `marcas` en `src/data/marcas.js` (una por marca — hoy TURCK, Cognex y Castrol, con su logo) — si se agrega una marca nueva a ese archivo, aparece aquí solo.
5. "Nuestros valores": misma fila de pills que `/nosotros`, usando `VALORES` de `src/data/valores.js`.
6. "Nuestros clientes": grid de logos de empresas cliente reales (no marcas que distribuimos, sino compañías que nos compran) — datos en `src/data/clientes.js` (`clientes`), archivos en `public/images/clientes/`. Cada cliente trae `nombre`, `logo` y `fondoOscuro` (boolean): varios logos corporativos (Visteon, Copeland, Emerson) solo existen en versión blanca pensada para fondos oscuros, así que esos se muestran sobre una tarjeta `--brand-black` para que no desaparezcan en el fondo claro del sitio; los que sí tienen logo a color (Hutchinson, Carrier, Bard) se muestran directo. Clientes actuales (dados por el dueño): Visteon, Copeland, Emerson, Hutchinson, Bard (médica, no Bard/BorgWarner de HVAC) y Carrier. El logo de Bard viene de Wikipedia (`Bard_logo.gif`, resolución baja) porque Bard fue absorbida por Becton Dickinson (BD) en 2017 y ya no publica su logo clásico en su propio sitio (bd.com solo usa el logo de BD) — si el dueño consigue un archivo de mejor calidad, reemplazar `public/images/clientes/bard.png`.
7. CTA final: banner oscuro (`--brand-black`) de ancho completo con el tagline, teléfono/WhatsApp y botón rojo "Contáctanos" — sin cambios, sigue igual que antes.

`logo-full.png` (el logo apilado completo) queda sin uso en el código por ahora — se deja el archivo en `public/brand/` por si se reutiliza en otra página (ej. una futura sección "Nosotros" con foto).


## Alcance
- Catálogo de marcas representadas + formulario de contacto/cotización.
- Sin carrito de compras / e-commerce.

## Stack
- Next.js (App Router) + JavaScript (sin TypeScript) + Tailwind CSS.
- Despliegue planeado en Vercel.

## Marcas
Marcas principales: **TURCK**, **Cognex** y **Castrol**.
- TURCK: catálogo con 3 categorías — Sensores, Conectividad, Field Bus.
- Cognex: catálogo con 4 categorías — Barcode Readers Manuales, Barcode Readers Estáticos, Sistemas de Visión, Verificadores de Códigos. (Los cables OEM de integración ya no van aquí — viven en la página `/oem`, que es de fabricación propia, no de una marca.)
- Castrol: aceites y lubricantes industriales — catálogo con 3 categorías — Fluidos Hidráulicos, Aceites para Engranajes, Grasas Industriales. Agregada a petición del dueño ("tambien distribuimos esa marca"). Sus 3 categorías ya tienen foto real (`imagen`) igual que TURCK/Cognex, sacadas de castrol.com (mangueras hidráulicas, engrane y grasa/lubricante en macro) — mismo criterio de no-hotlinking, archivos en `public/images/marcas/castrol/`.

Los datos de marcas/categorías/productos viven en `src/data/marcas.js` (un arreglo de marcas, cada una con `categorias` y `productos`). Los productos ahí son de EJEMPLO (`CONTENIDO_ES_EJEMPLO = true`) — no son SKUs ni imágenes reales de TURCK/Cognex/Castrol (aunque los nombres de producto de Castrol sí corresponden a líneas reales de su catálogo — Hyspin, Alpha, Tribol, Spheerol, etc. — verificadas en castrol.com, a diferencia de los nombres genéricos de ejemplo de TURCK/Cognex). Se reemplazan en la Fase 04 con datos reales, idealmente obtenidos del kit/portal de distribuidor de cada marca (no hay una API pública confirmada de TURCK, Cognex o Castrol para esto).

### Enlaces a páginas oficiales
Cada categoría en `src/data/marcas.js` trae un campo `enlaceOficial` con la URL de esa categoría en el sitio oficial de la marca — **turck.com.mx** (México, no turck.us) para TURCK, cognex.com para Cognex. Además, cada producto puede traer su propio `enlaceOficial` más específico (subcategoría exacta del sitio oficial, ej. `.../productgroup/Conectividad/Caja%20de%20conexiones`); si el producto no trae uno, se usa el de su categoría como respaldo (`producto.enlaceOficial || categoria.enlaceOficial` en `CatalogoMarca.js`). En `CatalogoMarca.js`, el título de cada producto (no un botón aparte) es el link — abre en pestaña nueva y muestra una flechita ↗ al hacer hover. Sirve para que el visitante vea specs/fotos reales y actuales mientras el catálogo propio usa contenido de ejemplo.

Nota: no todos los productos de ejemplo tienen una subcategoría exacta en turck.com.mx (ej. "Sensores fotoeléctricos" e "Interfaces IO-Link" no existen como categoría propia del catálogo ahí) — en esos casos se deja sin `enlaceOficial` propio y cae al link general de la categoría. Al reemplazar con SKUs reales en la Fase 04, revisar/ajustar estos enlaces por producto.

### Imágenes de producto
Los 30 productos de ejemplo/reales de las 3 marcas (9 TURCK, 12 Cognex, 9 Castrol) ya tienen foto propia en `producto.imagen` dentro de `src/data/marcas.js`, mostrada por `ProductThumb` en `src/components/CatalogoMarca.js` (56px). Un producto sin `imagen` cae automáticamente al ícono genérico de categoría (`CategoryIcon.js`) — eso ya no aplica a ningún producto actual, pero sigue siendo el comportamiento de respaldo si se agrega uno nuevo sin foto todavía. Para poner o reemplazar una foto: 1) coloca el archivo en `public/images/marcas/<marca>/<archivo>.jpg`, 2) agrega/edita `imagen: "/images/marcas/<marca>/<archivo>.jpg"` en el producto correspondiente — no hay que tocar el componente. NO usar hotlinking (las fotos se descargaron y se alojan en este proyecto, nunca URLs externas directas).

Origen de las fotos actuales (todas descargadas y redimensionadas a ~320px, no son hotlink):
- **TURCK (9)**: 7 de turck.us (catálogo real de producto — cordsets M12, bloques de distribución, conectores de campo, bloques de E/S remota, sensor de posición lineal, sensor inductivo serie Bi, y las 2 que no existen como categoría en turck.com.mx — interfaces IO-Link y módulos de seguridad — sacadas también de turck.us donde sí aparecen como producto). El sensor fotoeléctrico viene de bannerengineering.com (Banner Engineering, marca hermana de TURCK desde la adquisición de 2019 — de ahí el nombre `"TURCK | Banner"` en `marcas.js` — porque TURCK México no maneja fotoeléctricos como categoría propia).
- **Cognex (12)**: todas de cognex.com, de la página oficial de cada línea de producto (DataMan 8700/8050 para los lectores portátiles, DataMan 390/380 y Modular Vision Tunnels para los fijos, In-Sight 9000/2800 y 3D-A1000 para sistemas de visión, DataMan 475VS/475V para verificadores).
- **Castrol (9)**: como castrol.com no publica fotos de envase por producto (solo imágenes de aplicación/industria, ya usadas para las fotos de categoría), estas 9 se tomaron de distribuidores autorizados que sí fotografían el envase real con la etiqueta Castrol (shop.sclubricants.com para Hyspin AWS/VG; santiemidwest.com para Alpha SP, Alphasyn EP, Optigear BM, Tribol HM, Spheerol EPL/EPLX; silmid.com para Tribol GR 100 PD). Al reemplazar con fotos propias en Fase 04 (ej. si el dueño consigue el kit de distribuidor de Castrol), estas se pueden sustituir por el empaque específico que maneje la empresa.

`CategoryIcon.js` trae un ícono por cada `id` de categoría de TODAS las marcas (TURCK, Cognex y Castrol) — si se agrega una categoría nueva a `marcas.js` con un `id` que no está en `ICONS` ahí, el componente devuelve `null` y la casilla se ve vacía (esto pasó con las 3 categorías de Castrol al agregarlas, ya corregido agregando `fluidos-hidraulicos`, `aceites-engranajes` y `grasas-industriales` al mapa). Al agregar una marca/categoría nueva, agregar también su ícono aquí.

El dueño pidió que el catálogo se viera "más nutrido" ya que sin fotos reales de producto se sentía vacío — se agrandaron los tamaños en `CatalogoMarca.js`: ícono/foto de categoría de 48px a 64px, ícono/foto de producto (`ProductThumb`) de 32px a 56px, textos de producto de `text-sm`/`text-xs` a `text-base`/`text-sm`, más padding en cada renglón (`px-5 py-4` en vez de `px-4 py-2.5`) y más separación entre categorías (`gap-12` en vez de `gap-8`). Título y resumen de la marca (encabezado de `/marcas/turck`, `/marcas/cognex`, `/marcas/castrol`) también se agrandaron un nivel. Esto es una solución de diseño mientras no hay fotos reales — cuando se reemplacen los productos de ejemplo con fotos reales en Fase 04, estos tamaños se pueden revisar de nuevo (fotos reales probablemente permitan volver a un layout más compacto).

Segunda vuelta (el dueño pidió ir más al detalle y agrandar "desde el logo de SIFENIX hasta el tile de sensores Bi", es decir, en todo el sitio, no solo el catálogo): se subió un nivel más el tamaño en toda la cadena visual — logo de `Header.js` (36px → 48px) y nav (`text-sm` → `text-base`); hero, tarjetas de "Qué hacemos", "Marcas que representamos", "Misión y visión", pills de "Nuestros valores" y logos de "Nuestros clientes" en Inicio (`page.js`); tarjetas del índice `/marcas`; y otra vuelta más en `CatalogoMarca.js` (ícono/foto de categoría ahora 80px, de producto 64px, textos de producto a `text-lg`/`text-base`, más padding). Todo el sitio quedó un nivel de escala arriba de como estaba antes de este ajuste — si en algún punto se ve demasiado grande en móvil, revisar los breakpoints `sm:` de cada sección.

### Logos de marca (TURCK / Cognex)
Cada marca en `src/data/marcas.js` trae un campo `logo` (ruta local, mismo criterio de no-hotlinking que las fotos de producto de arriba):
- `logo: "/images/marcas/turck/logo.jpg"` → archivo en `public/images/marcas/turck/logo.jpg` (logo oficial de TURCK, descargado de turck.com.mx; el archivo es JPEG con fondo blanco pese a la extensión .png del origen — no tiene transparencia).
- `logo: "/images/marcas/cognex/logo.png"` → archivo en `public/images/marcas/cognex/logo.png` (logo oficial de Cognex, PNG con transparencia real, wordmark en gris oscuro/negro — cuidado al reemplazar: cognex.com también usa una variante en blanco para su nav/footer oscuros que, sobre el fondo blanco del sitio, se ve como un logo "faltante"/en blanco; ya pasó una vez y se corrigió usando la versión oscura que trae su banner de cookies).
- `logo: "/images/marcas/castrol/logo.svg"` → archivo en `public/images/marcas/castrol/logo.svg` (logo oficial de Castrol, SVG vectorial obtenido directo de castrol.com — escala sin perder calidad, a diferencia de los JPG/PNG de TURCK/Cognex).

Se muestran en 3 lugares (todos leen `marca.logo` directo, sin tocar los componentes si se reemplaza el archivo): la sección "Marcas que representamos" de Inicio (`src/app/page.js`), el índice `/marcas` (`src/app/marcas/page.js`), y el encabezado del catálogo por marca (`src/components/CatalogoMarca.js`, usado por `/marcas/turck` y `/marcas/cognex`). Si el dueño consigue una versión con mejor resolución o en SVG, reemplazar el mismo archivo en `public/images/marcas/<marca>/` en vez de crear uno nuevo.

### Fotos reales por categoría (mismas que el catálogo PDF de marketing)
Cada `categoria` en `src/data/marcas.js` (Sensores, Conectividad, Field Bus de TURCK; las 4 de Cognex) trae un campo `imagen` con una foto real representativa de esa categoría, sacada de los sitios oficiales de TURCK/Cognex — las mismas 7 fotos que ya se usan en el catálogo PDF de marketing (ver `marketing/`), para que el sitio y el PDF muestren contenido consistente. Archivos en `public/images/marcas/<marca>/<id-de-categoria>.jpg`. Es una foto por CATEGORÍA, no por producto individual (los productos de ejemplo dentro de cada categoría siguen siendo genéricos hasta la Fase 04), así que en `CatalogoMarca.js` se muestra junto al encabezado de la categoría (no en cada renglón de producto — eso sigue usando `producto.imagen` si algún día se agrega, con `CategoryIcon` de respaldo). Si una categoría no trae `imagen`, cae automáticamente al ícono genérico (`CategoryIcon`), igual que antes — así que agregar categorías nuevas sin foto no rompe nada.

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

00. Fundamentos y contenido base — LISTA (nombre: Servicios Industriales Fenix S.A. de C.V.; marcas: TURCK, Cognex y Castrol; categorías definidas; misión/visión y contacto tomados de la presentación vieja)
01. Entorno de desarrollo — LISTA: corre con `npm run dev`, git inicializado.
02. Arquitectura de páginas — LISTA: Inicio, Marcas (índice + /marcas/turck + /marcas/cognex), OEM (/oem), Nosotros, Contacto. Nav en `src/components/Header.js` (el link a `/marcas` se muestra en el menú como "Productos", no "Marcas" — decisión del dueño para que el menú suene menos a "listado de fabricantes" y más a lo que el visitante busca).
03. Construcción de páginas base — EN PROGRESO: layout compartido (Header/Footer), página de Marcas con catálogo por categoría, e Inicio (hero + Qué hacemos + Marcas destacadas + Misión y visión + Nuestros valores + Nuestros clientes + CTA final) ya están. Falta Contacto (formulario).
04. Contenido real y formulario funcional — SIGUIENTE: reemplazar `src/data/marcas.js` con datos/imágenes reales y conectar el formulario de contacto a Supabase (ver sección "Formulario de contacto / cotizaciones" arriba) para que guarde cada cotización en base de datos, no solo mande un correo.
05. Dominio, hosting y HTTPS (Vercel)
06. SEO básico y pruebas finales
07. Lanzamiento y seguimiento

## Notas para quien trabaje en este repo
- El dueño del proyecto es ingeniero de control/mecatrónica, nuevo en desarrollo de software — explica los pasos de forma clara y sin dar por hecho experiencia previa en JS/React.
- Sin dominio, hosting ni material de marca (logos, lista de marcas, fotos) todavía — se define en la Fase 00.
- No agregues TypeScript ni cambies el gestor de paquetes (npm) sin que se pida explícitamente.
