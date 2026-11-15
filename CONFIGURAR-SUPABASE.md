# Conectar el panel de administración (Supabase)

El sitio guarda las propiedades en **Supabase** (gratis, sin tarjeta). Se hace una sola vez, en unos 10 minutos.
Lo ideal es crear la cuenta con el correo del cliente, para que la información sea suya.

## 1. Crear el proyecto
1. Entre a <https://supabase.com> y cree una cuenta (puede usar "Continue with GitHub" o su correo).
2. **New project**. Nombre: `bienes-raices`. Escriba una contraseña para la base de datos (guárdela) y elija la región **East US** (la más cercana a México). **Create new project**. Tarda 1 o 2 minutos.

## 2. Preparar la base de datos
1. Abra el archivo `supabase/configurar.sql` de este repositorio y **cambie el correo de la última línea** por el del administrador.
2. En Supabase: **SQL Editor → New query**, pegue todo el archivo y toque **Run**. Debe decir "Success".
3. (Opcional) Para probar con las 16 propiedades de ejemplo, haga lo mismo con `supabase/ejemplos.sql`.

## 3. Crear el usuario administrador
1. **Authentication → Users → Add user → Create new user**.
2. Use **el mismo correo** que puso en `configurar.sql`, escriba una contraseña y marque **Auto Confirm User**.
3. Recomendado: **Authentication → Sign In / Providers** y desactive **Allow new users to sign up**, para que nadie más pueda crear cuentas. Aunque alguien se registrara, no podría cambiar nada: solo los correos de la tabla `administradores` tienen permiso.
4. **Authentication → URL Configuration**: en **Site URL** ponga la dirección del sitio (por ejemplo `https://draguz-web.github.io/bienes-raices/`). Así funciona el correo de "Olvidé mi contraseña".

## 4. Conectar el sitio
1. En Supabase: **Project Settings → API** (o el botón **Connect**). Copie:
   - **Project URL**
   - **anon public key** (NO la `service_role`)
2. Péguelos en `recursos/config.js` y guarde los cambios en GitHub.

Listo. El panel queda en `https://draguz-web.github.io/bienes-raices/admin.html`.

## Más administradores
En **Table Editor → administradores** agregue el correo, y cree el usuario como en el paso 3.

## Bueno saber
- El plan gratis de Supabase pausa el proyecto si pasa **una semana sin ninguna visita**. Si eso pasa, entre a supabase.com y toque **Restore**. Con un sitio que recibe visitas no suele ocurrir.
- Las fotos se reducen solas antes de subirse. El plan gratis tiene 1 GB, que alcanza para miles de fotos.
