# Migraciones de Supabase

Los archivos en `migrations/` son el historial versionado del esquema de
base de datos del sistema interno (`/app`). No se aplican solos: por ahora
se ejecutan a mano, en orden, desde el proyecto de Supabase.

## Cómo aplicar una migración

1. Entra a tu proyecto en [supabase.com](https://supabase.com) → **SQL Editor** → **New query**.
2. Pega el contenido completo del archivo (por ejemplo `0001_sistema_interno_inicial.sql`).
3. Dale **Run**.
4. Si no hay errores, el esquema ya quedó creado/actualizado.

## Primer usuario (super_admin)

La migración `0001` crea automáticamente un registro en `profiles` (con
`role = 'sales'` por defecto) cada vez que alguien se registra en Supabase
Auth. Para dejar tu propio usuario como `super_admin`:

1. Crea tu usuario (por ejemplo desde `/login` una vez configurado, con
   "¿No tienes cuenta?", o desde **Authentication → Users → Add user** en
   el dashboard de Supabase).
2. Ve a **Table Editor → profiles**, busca tu fila (por `email`) y cambia
   `role` a `super_admin`.
