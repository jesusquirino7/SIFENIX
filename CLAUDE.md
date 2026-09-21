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

### Fotos reales por categoría
Cada `categoria` en `src/data/marcas.js` (Sensores, Conectividad, Field Bus de TURCK; las 4 de Cognex; las 3 de Castrol) trae un campo `imagen` con una foto real representativa de esa categoría. Archivos en `public/images/marcas/<marca>/<id-de-categoria>.jpg`. Se muestra junto al encabezado de la categoría en `CatalogoMarca.js` (no en cada renglón de producto — eso usa `producto.imagen`, ver "Imágenes de producto" arriba). Si una categoría no trae `imagen`, cae automáticamente al ícono genérico (`CategoryIcon`).

### Catálogo general en PDF (`marketing/SIFENIX - Catalogo general.pdf`)
PDF de 6 páginas (portada + TURCK + Cognex + Castrol + Fabricación OEM + Suministros/valores/clientes) que muestra foto real de cada uno de los 30 productos (no solo una foto por categoría como en la primera versión) — usa las mismas imágenes de `public/images/marcas/` que el sitio, para que ambos estén sincronizados. No se edita a mano: se genera con un script porque el diseño (tarjetas, colores de marca, grid de productos) es más fácil de mantener como HTML/CSS que editando un PDF directamente.

Cómo se genera (no vive en este repo — son archivos de trabajo de una sesión de Claude, no hace falta commitearlos, solo el PDF resultante):
1. Un script Python arma `catalog.html` con los datos de `marcas.js`/`clientes.js`/`valores.js` transcritos a mano (mismos textos, mismos íconos SVG que `CategoryIcon.js`) y las fotos de producto como `<img>` locales.
2. Un script Node con Playwright (`chromium.launch()` → `page.goto(file://...)` → `page.pdf({ printBackground: true })`) renderiza ese HTML a PDF tamaño Carta.

Si se agrega un producto/categoría nueva a `marcas.js` o cambia una foto, hay que regenerar el PDF pidiéndole a Claude que lo actualice (dile qué cambió) — no hay un botón/comando propio todavía para esto en el repo.

### Formulario de contacto → tabla `leads` del sistema interno
`src/components/ContactoForm.js` (usado por `src/app/(public)/contacto/page.js`) guarda cada envío en la tabla `leads` de Supabase (migración `supabase/migrations/0008_leads.sql`) **y** sigue abriendo el `mailto:` de siempre hacia `compras1@sifenix.com` (constante `CORREO_DESTINO`) — decisión explícita del dueño de no perder el correo inmediato al conectar la base de datos. Si el insert falla (ej. sin conexión a Supabase), el `mailto:` se abre de todos modos, así que el formulario nunca deja al visitante sin poder mandar su solicitud.

`leads` es la única tabla de todo el sistema con INSERT público (sin sesión) — RLS le permite a cualquier visitante crear un renglón, pero no leer, editar ni borrar nada; solo un empleado autenticado (`is_active_employee()`) puede verlos. Aparecen en el sistema interno bajo **Solicitudes del sitio** (`/app/leads`, primer link del sidebar después de Dashboard) y en la sección "Requiere atención" del Dashboard mientras su estatus sea `nuevo`. Conversión a Cliente/Oportunidad es manual: el detalle de cada lead (`/app/leads/[id]`) solo indica el siguiente paso y enlaza a Clientes/Oportunidades — no crea el registro automáticamente. La columna `opportunity_id` de `leads` queda preparada para ligar esa conversión más adelante, sin usarse todavía.

CORREO_CONTACTO en `contacto/page.js` (solo compras1@sifenix.com, sin nombres ni teléfonos) sigue como bloque secundario debajo del formulario — decisión explícita del dueño para que el visitante deje sus datos en vez de solo consultar los nuestros.

## Sistema interno (`/app`) — gestión comercial y operaciones
Además del sitio público, el repo incluye un sistema privado de gestión (CRM/ERP ligero) para la operación de la distribuidora, sobre el mismo proyecto de Next.js/Vercel (no es un repo ni proyecto aparte). Vive directo en `master`/producción (se mergeó ahí desde la Etapa 1) — cada etapa se construye, se valida en local con el dueño, y se sube a producción el mismo día.

### Arquitectura
- El sitio público vive en `src/app/(public)/` (route group — no cambia ninguna URL) con su propio `layout.js` (el Header/Footer de siempre). El `layout.js` raíz (`src/app/layout.js`) es mínimo (solo `<html>/<body>` + metadata) para que `/login` y `/app/*` no lleven la navegación pública.
- `/login` — acceso con Supabase Auth (email/password).
- `/app/*` — sistema privado, protegido en dos capas: `src/proxy.js` (Next.js 16 renombró "middleware" a "proxy", mismo comportamiento — ver `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`) redirige a `/login` si no hay sesión antes de que la página cargue; `src/app/app/layout.js` valida la sesión otra vez server-side por defensa en profundidad, y monta el shell (Sidebar + Topbar + `ToastProvider` para notificaciones).
- JavaScript puro (sin TypeScript), mismo Tailwind del resto del sitio — decisión explícita del dueño para mantener consistencia con la regla de abajo de no agregar TypeScript.
- Patrón de edición por documento (Cotizaciones, Órdenes de Cliente/Proveedor): productos y datos son editables solo en su estado inicial (Borrador / Confirmada) vía un componente `<Documento>Editor.js` con toggle ver/editar; en cuanto avanza de estatus se congela, para que el registro siga reflejando lo que de verdad se le mandó al cliente o proveedor. RFQ es la excepción — su costo/tiempo de entrega se captura después de crearla por diseño (`RfqItemsEditor.js`), y se bloquea hasta reabrirla cuando pasa a "Respondida"/"Vencida". Oportunidades sí es editable en cualquier estatus (nunca sale de la empresa, es un registro interno).
- Los campos de dinero (costo, precio, valor estimado) usan `src/components/app/MoneyInput.js` — mismo string numérico de siempre en el estado, formateado con comas y 2 decimales al perder el foco.

### Supabase
Proyecto: `oazrvmuxupxxbeeboplq` (`https://oazrvmuxupxxbeeboplq.supabase.co`). Credenciales en `.env.local` (no versionado, `.gitignore` cubre `.env*`) y ya cargadas en Vercel (Production/Preview/Development) vía `vercel env add`.
- `src/lib/supabase/client.js` — cliente para Client Components (anon key). `src/lib/supabase/server.js` — cliente para Server Components/Route Handlers (usa `cookies()`). `src/lib/supabase/admin.js` — cliente con la `service_role` key (variable `SUPABASE_SERVICE_ROLE_KEY`, **sin** prefijo `NEXT_PUBLIC`, server-only): se salta RLS, se usa solo para invitar usuarios (`supabase.auth.admin.inviteUserByEmail`), nunca se importa desde un Client Component.
- Esquema versionado en `supabase/migrations/` (se aplican a mano, pegando el SQL en el SQL Editor de Supabase — no hay Supabase CLI conectado todavía, ver `supabase/README.md`). Migraciones corridas en el proyecto real, en orden: `0001` (profiles, customers, suppliers, products, opportunities, opportunity_items, audit_log), `0002` (quotations), `0003` (attachments + bucket de Storage), `0004` (rfqs), `0005` (customer_orders), `0006` (supplier_orders), `0007` (`is_super_admin()` + policy para gestión de usuarios), `0008` (leads).
- RLS: la función `is_active_employee()` (profile activo) gobierna casi todas las tablas — cualquier empleado activo tiene acceso completo, sin distinción por `role` todavía (los roles ya se pueden asignar vía `/app/configuracion/usuarios`, pero ninguna policy los usa aún para restringir por área). La única excepción es `leads`: la tabla del formulario de contacto público, con INSERT abierto a cualquier visitante sin sesión y SELECT/UPDATE solo para empleados — ver sección de arriba.
- `profiles.role` puede ser `super_admin`, `admin`, `sales`, `purchasing` u `operations`. Se crea automáticamente (`role` default `'sales'`) al registrarse un usuario en Supabase Auth (trigger `handle_new_user`).

### Gestión de usuarios (`/app/configuracion/usuarios`)
Solo visible/accesible para `super_admin` (verificado server-side en la página y de nuevo dentro de la Server Action, no solo ocultando el link). Invitar usuario usa el cliente admin (`inviteUserByEmail`) y le asigna un rol de una vez; cambiar rol/activo de alguien más usa el cliente normal gracias a la policy de `is_super_admin()` de la migración `0007` — no necesita `service_role`. Un `super_admin` no puede editarse a sí mismo desde esa tabla (para no bloquearse sin querer). El primer `super_admin` de todos siempre se promueve a mano desde el Table Editor de Supabase — es el único paso que no se puede hacer desde la app.

### Módulos funcionales (Etapas 1–8 completas y validadas por el dueño con datos reales)
Sidebar, de arriba a abajo: **Dashboard**, **Solicitudes del sitio** (`/app/leads`, ver sección de arriba), **Clientes**, **Proveedores**, **Productos**, **Oportunidades**, **Cotizaciones**, **RFQ Proveedores**, **Órdenes de Cliente**, **Órdenes a Proveedores**, **Seguimiento**, **Reportes**, **Configuración**.

La cadena completa de una operación: **Oportunidad** (`opportunity_number` tipo `OP-2026-00001`, liga un cliente con los productos que pidió cotizar) → **Cotización** (`COT-`, se crea desde la oportunidad, precios acordados con el cliente) → **RFQ** (`RFQ-`, se crea desde la oportunidad hacia un proveedor, costo se captura después) → **Comparativo** (`/app/oportunidades/[id]/comparativo`, solo lectura, resalta el precio más bajo por producto y por proveedor) → **Orden de Cliente** (`OC-`, se crea desde la cotización aceptada) → **Orden a Proveedor** (`OCP-`, se crea desde la RFQ respondida, con semáforo de entrega vía `getDeliveryHealth()` en `statusColors.js`). Cada documento enlaza al anterior y al siguiente — nunca aislados, tal como pedía el diseño original.

- **Dashboard**: tarjetas con conteos reales + sección "Requiere atención" unificada (solicitudes nuevas del sitio, cotizaciones/RFQ enviadas esperando respuesta, órdenes de proveedor atrasadas).
- **Seguimiento** (`/app/seguimiento`): panel de alertas ampliado — todos los pendientes del sistema (no solo los más urgentes), con filtros por tipo de documento y buscador, vía query params (`?tipo=&q=`) sin JavaScript de cliente.
- **Reportes** (`/app/reportes`): rentabilidad (total vendido vs. comprado, margen bruto — a nivel operación completa, no COGS por producto), embudo de oportunidades por estatus, top clientes/proveedores.
- **Adjuntos**: `src/components/app/AttachmentsPanel.js` es reutilizable — ya conectado a Cotizaciones, RFQ, Órdenes de Cliente y Órdenes a Proveedor (bucket `documents`, privado, 20 MB por archivo).

### Plan del sistema interno (independiente del plan de lanzamiento del sitio público de abajo)
Etapas 1–8 completas. Pendiente: **Etapa 9** (automatización e IA — importación de cotizaciones vía PDF/Excel, notificaciones). Gaps conocidos, sin resolver todavía: `created_by`/`updated_by` existen en el esquema pero ningún formulario los llena; el catálogo de Productos no se integra (los renglones de producto en cotizaciones/RFQ/oportunidades siempre son texto libre, no jalan del catálogo); sin navegación del sidebar en pantallas angostas (celular); permisos por `role` sin aplicar todavía a nivel RLS.

## Plan de lanzamiento
El proyecto sigue un plan de 8 fases (00 a 07), con una validación al final de cada una antes de avanzar a la siguiente:

00. Fundamentos y contenido base — LISTA (nombre: Servicios Industriales Fenix S.A. de C.V.; marcas: TURCK, Cognex y Castrol; categorías definidas; misión/visión y contacto tomados de la presentación vieja)
01. Entorno de desarrollo — LISTA: corre con `npm run dev`, git inicializado.
02. Arquitectura de páginas — LISTA: Inicio, Marcas (índice + /marcas/turck + /marcas/cognex), OEM (/oem), Nosotros, Contacto. Nav en `src/components/Header.js` (el link a `/marcas` se muestra en el menú como "Productos", no "Marcas" — decisión del dueño para que el menú suene menos a "listado de fabricantes" y más a lo que el visitante busca).
03. Construcción de páginas base — EN PROGRESO: layout compartido (Header/Footer), página de Marcas con catálogo por categoría, e Inicio (hero + Qué hacemos + Marcas destacadas + Misión y visión + Nuestros valores + Nuestros clientes + CTA final) ya están. Falta Contacto (formulario).
04. Contenido real y formulario funcional — el formulario de contacto ya guarda en Supabase (tabla `leads`, ver sección "Formulario de contacto" arriba) además de mandar el correo de siempre. Sigue pendiente: reemplazar `src/data/marcas.js` con datos/imágenes reales de producto.
05. Dominio, hosting y HTTPS (Vercel)
06. SEO básico y pruebas finales
07. Lanzamiento y seguimiento

## Notas para quien trabaje en este repo
- El dueño del proyecto es ingeniero de control/mecatrónica, nuevo en desarrollo de software — explica los pasos de forma clara y sin dar por hecho experiencia previa en JS/React.
- Sin dominio, hosting ni material de marca (logos, lista de marcas, fotos) todavía — se define en la Fase 00.
- No agregues TypeScript ni cambies el gestor de paquetes (npm) sin que se pida explícitamente.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
