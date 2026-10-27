# LÍMCAR-WEB

Sistema web de ventas y gestión para una distribuidora de pollo pelado (con cola, sin cola, trozos y menudencias).
Tecnología: React + Vite + Firebase (Authentication + Firestore) + GitHub Pages. Costo inicial: S/ 0.

## 1. Probar en tu computadora

```bash
npm install
npm run dev
```

## 2. Configurar Firebase (una sola vez)

1. Entra a https://console.firebase.google.com → **Agregar proyecto** (plan gratuito Spark).
2. **Authentication → Comenzar → Correo electrónico/contraseña → Habilitar.**
3. **Firestore Database → Crear base de datos** (modo producción, región cercana).
4. **Configuración del proyecto → Tus apps → Web (`</>`)** → copia la configuración y pégala en `src/config/firebase.js`.
5. **Firestore → Reglas:** pega el contenido de `firebase/firestore.rules` y pulsa **Publicar**.

## 3. Crear el primer administrador

La gente entra con **usuario y contraseña** (internamente el usuario se convierte en `usuario@limcar.app`).

1. **Authentication → Usuarios → Agregar usuario:**
   correo `admin@limcar.app` y una contraseña segura (mínimo 6 caracteres). Copia su **UID**.
2. **Firestore → Iniciar colección** `usuarios` → ID del documento = el **UID** copiado, con estos campos:
   - `usuario` (string): `admin`
   - `nombre` (string): tu nombre
   - `rol` (string): `admin`
   - `activo` (boolean): `true`
3. Entra al sistema con usuario `admin` y esa contraseña. Desde el módulo **Usuarios** creas al resto
   (roles: `admin`, `vendedor`, `repartidor`).

## 4. Publicar gratis en GitHub Pages

1. Crea un repositorio **público** en GitHub y sube el proyecto (rama `main`).
2. En el repositorio: **Settings → Pages → Source: GitHub Actions**.
3. Cada `git push` a `main` compila y publica solo (`.github/workflows/deploy.yml`).
4. Tu sistema quedará en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.
5. En Firebase: **Authentication → Configuración → Dominios autorizados → Agregar** `TU-USUARIO.github.io`.

## 5. Primeros pasos de uso

1. **Catálogo:** crea tus productos (pollo pelado con cola, sin cola, trozos, menudencias) con su precio.
2. **Proveedores** y **Clientes**.
3. **Compras:** al guardar, los kilos entran al inventario.
4. **Ventas:** al guardar, los kilos salen del inventario. El monto pagado se puede actualizar después.
5. **Inicio** y **Reportes** resumen todo.

## Roles

| Rol | Puede |
| --- | --- |
| admin | Todo |
| vendedor | Clientes, pedidos, ventas; ver catálogo e inventario y repartos |
| repartidor | Ver pedidos y clientes; registrar repartos |

## Seguridad

- Las claves de `firebase.js` son públicas por diseño; lo que protege los datos son las **reglas** (`firebase/firestore.rules`).
- Nunca subas claves privadas ni archivos de cuenta de servicio al repositorio.
- Las contraseñas las gestiona Firebase Authentication; no se guardan en Firestore.
- Haz copias de respaldo exportando datos de Firestore periódicamente.

## Qué incluye y qué falta

Incluido: login por usuario, roles, 14 módulos, inventario automático por compras y ventas, saldos por cobrar y pagar, reportes por fechas.
Pendiente (etapa 8): asistencia y pagos de personal, reservas de stock por pedido, cierres de caja, auditoría y respaldos automáticos.
