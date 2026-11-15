# Bienes raíces: mapa y catálogo

Sitio estático (HTML, CSS y JavaScript, sin instalación) con:

- `index.html`: lista de propiedades y mapa con el precio de cada una. Al mover el mapa, la lista muestra solo lo que se ve.
- `catalogo.html`: todas las propiedades en tarjetas, con filtros y ficha de detalle con botón de WhatsApp.
- `admin.html`: panel de administración para agregar, editar, ocultar y borrar propiedades, con fotos y ubicación en el mapa.

## Cambiar las propiedades
Desde el panel `admin.html`, una vez conectado a Supabase: vea **CONFIGURAR-SUPABASE.md**.
Mientras no esté conectado, el sitio muestra las propiedades de ejemplo de `recursos/propiedades-datos.js`. Si una propiedad no tiene foto, se dibuja una fachada ilustrada.

## Cambiar el WhatsApp
Solo en `recursos/config.js` (`whatsapp`); todos los botones lo toman de ahí.

## Publicar en GitHub Pages
Settings → Pages → "Deploy from a branch" → rama `main`, carpeta `/ (root)`.

El mapa usa Leaflet 1.9.4 (copiado en `recursos/leaflet/`) con el mapa base gratuito de OpenStreetMap; no requiere clave.
