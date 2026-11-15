# Bienes raíces: mapa y catálogo

Sitio estático (HTML, CSS y JavaScript, sin instalación) con:

- `index.html`: lista de propiedades y mapa con el precio de cada una. Al mover el mapa, la lista muestra solo lo que se ve.
- `catalogo.html`: todas las propiedades en tarjetas, con filtros y ficha de detalle con botón de WhatsApp.

## Cambiar las propiedades
Edite `recursos/propiedades-datos.js`. Las propiedades actuales **son de ejemplo**. Si una propiedad no tiene `foto`, se dibuja una fachada ilustrada.

## Cambiar el WhatsApp
En `recursos/propiedades.js` (constante `WHATSAPP`) y en los enlaces `wa.me` de `index.html` y `catalogo.html`.

## Publicar en GitHub Pages
Settings → Pages → "Deploy from a branch" → rama `main`, carpeta `/ (root)`.

El mapa usa Leaflet 1.9.4 (copiado en `recursos/leaflet/`) con el mapa base gratuito de OpenStreetMap; no requiere clave.
