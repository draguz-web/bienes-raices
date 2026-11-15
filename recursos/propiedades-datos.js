/*
  Casas que aparecen en el catálogo y en el mapa MIENTRAS el sitio no esté conectado a Supabase.
  Una vez conectado, las casas se administran desde admin.html y este archivo ya no se usa.

  SON DE EJEMPLO. Cada casa lleva:
    clave        texto corto único (aparece en la ficha y en el mensaje de WhatsApp)
    precio       en pesos
    colonia, municipio
    lat, lng     ubicación (en Google Maps: clic derecho sobre el punto y copiar los números)
    recamaras, banos, estacionamientos
    construccion, terreno               metros cuadrados
    descripcion
    foto         opcional: dirección de una foto. Si no hay, se dibuja una fachada.
    publicada    fecha AAAA-MM-DD (para ordenar por "más recientes")
*/
window.PROPIEDADES = [
  {clave:"P-101", precio:3450000, colonia:"Cumbres Elite", municipio:"Monterrey", lat:25.7318, lng:-100.4062,
   recamaras:3, banos:2.5, estacionamientos:2, construccion:185, terreno:144, publicada:"2026-11-10",
   descripcion:"Casa de dos pisos en privada con vigilancia. Cochera techada para dos autos, patio trasero y cuarto de servicio. Cerca de escuelas y de Paseo de los Leones."},
  {clave:"P-102", precio:12800000, colonia:"Del Valle", municipio:"San Pedro Garza García", lat:25.6556, lng:-100.3694,
   recamaras:4, banos:4.5, estacionamientos:3, construccion:420, terreno:390, publicada:"2026-11-08",
   descripcion:"Residencia en calle cerrada a unos pasos de Calzada del Valle. Estudio, sala de TV, jardín con asador y vista a la Sierra Madre."},
  {clave:"P-103", precio:8900000, colonia:"Lomas del Valle", municipio:"San Pedro Garza García", lat:25.6489, lng:-100.3412,
   recamaras:3, banos:3.5, estacionamientos:2, construccion:300, terreno:280, publicada:"2026-11-12",
   descripcion:"Casa de tres niveles con elevador, terraza con vista a la Sierra Madre y jardín privado. A unos minutos de Calzada San Pedro."},
  {clave:"P-104", precio:2150000, colonia:"Linda Vista", municipio:"Guadalupe", lat:25.6872, lng:-100.2408,
   recamaras:3, banos:2, estacionamientos:1, construccion:140, terreno:160, publicada:"2026-10-28",
   descripcion:"Casa de un piso lista para habitarse, con escrituras al corriente. A dos cuadras de la avenida Miguel Alemán y del metro."},
  {clave:"P-105", precio:3900000, colonia:"Anáhuac", municipio:"San Nicolás de los Garza", lat:25.7441, lng:-100.3058,
   recamaras:3, banos:2, estacionamientos:2, construccion:170, terreno:200, publicada:"2026-11-05",
   descripcion:"Casa amplia en zona tranquila, cerca de la UANL. Patio con árboles frutales, cuarto de lavado y escrituras al corriente."},
  {clave:"P-106", precio:7450000, colonia:"La Rioja", municipio:"Monterrey", lat:25.5612, lng:-100.2491,
   recamaras:4, banos:4, estacionamientos:3, construccion:350, terreno:400, publicada:"2026-10-20",
   descripcion:"Casa campestre sobre Carretera Nacional con jardín grande, asador y vista al cerro. Fraccionamiento con caseta de vigilancia."},
  {clave:"P-107", precio:4600000, colonia:"Obispado", municipio:"Monterrey", lat:25.6762, lng:-100.3442,
   recamaras:3, banos:2.5, estacionamientos:2, construccion:210, terreno:180, publicada:"2026-11-01",
   descripcion:"Casa remodelada al pie del Cerro del Obispado. Cocina integral nueva, estudio y patio con pérgola."},
  {clave:"P-108", precio:3250000, colonia:"Tecnológico", municipio:"Monterrey", lat:25.6496, lng:-100.2897,
   recamaras:3, banos:2, estacionamientos:2, construccion:160, terreno:150, publicada:"2026-11-09",
   descripcion:"Casa de dos pisos a unas cuadras del Tec de Monterrey y de avenida Garza Sada. Buena opción para familia o para inversión."},
  {clave:"P-109", precio:1650000, colonia:"Praderas de San Francisco", municipio:"Apodaca", lat:25.7812, lng:-100.1886,
   recamaras:2, banos:1.5, estacionamientos:1, construccion:92, terreno:105, publicada:"2026-10-15",
   descripcion:"Casa de dos pisos en fraccionamiento con parque. Acepta crédito Infonavit y bancario."},
  {clave:"P-110", precio:2350000, colonia:"Centro", municipio:"Monterrey", lat:25.6709, lng:-100.3101,
   recamaras:2, banos:1.5, estacionamientos:1, construccion:120, terreno:110, publicada:"2026-11-11",
   descripcion:"Casa antigua restaurada a unas cuadras de la Macroplaza y del Barrio Antiguo. Techos altos y patio interior."},
  {clave:"P-111", precio:6350000, colonia:"Contry", municipio:"Monterrey", lat:25.6262, lng:-100.2823,
   recamaras:4, banos:3, estacionamientos:2, construccion:290, terreno:300, publicada:"2026-10-30",
   descripcion:"Casa familiar con estudio en planta baja, recámara principal con vestidor y terraza techada. Calles arboladas y cerca de colegios."},
  {clave:"P-112", precio:1950000, colonia:"Valle del Canadá", municipio:"General Escobedo", lat:25.7948, lng:-100.3214,
   recamaras:3, banos:2, estacionamientos:2, construccion:120, terreno:128, publicada:"2026-10-25",
   descripcion:"Casa con fachada recién pintada, minisplit en recámaras y patio con techo de lámina. Cerca de la avenida Sendero."},
  {clave:"P-113", precio:15500000, colonia:"Olinalá", municipio:"San Pedro Garza García", lat:25.6421, lng:-100.3948,
   recamaras:4, banos:4, estacionamientos:3, construccion:380, terreno:450, publicada:"2026-11-03",
   descripcion:"Casa con vista panorámica a la ciudad, en las faldas de Chipinque. Alberca, jardín y cuarto de servicio con baño."},
  {clave:"P-114", precio:4200000, colonia:"Mitras Centro", municipio:"Monterrey", lat:25.6934, lng:-100.3478,
   recamaras:3, banos:2, estacionamientos:2, construccion:180, terreno:160, publicada:"2026-11-07",
   descripcion:"Casa de dos pisos lista para habitarse, a unos minutos del Hospital Universitario. Cochera techada y recámara en planta baja."},
  {clave:"P-115", precio:2450000, colonia:"Puerta del Sol", municipio:"Santa Catarina", lat:25.6741, lng:-100.4577,
   recamaras:3, banos:2, estacionamientos:2, construccion:130, terreno:140, publicada:"2026-10-18",
   descripcion:"Casa en esquina con patio amplio y escrituras al corriente. Cerca de la carretera a Saltillo. Acepta crédito Infonavit."},
  {clave:"P-116", precio:9800000, colonia:"Fuentes del Valle", municipio:"San Pedro Garza García", lat:25.6519, lng:-100.3591,
   recamaras:4, banos:3.5, estacionamientos:2, construccion:330, terreno:300, publicada:"2026-11-13",
   descripcion:"Casa familiar a unos pasos del Centrito Valle, con sala de TV, cuarto de servicio y jardín con árboles."}
].map(p => ({operacion:"venta", tipo:"Casa", ...p}));
