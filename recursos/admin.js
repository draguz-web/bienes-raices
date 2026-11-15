/* Panel de administración: entrar, ver, agregar, editar y borrar propiedades (guardadas en Supabase). */
(function(){
  const P = window.Propiedades;
  const $ = id => document.getElementById(id);
  const sb = P.supabase();
  const BUCKET = 'fotos';

  const vistas = ['sin-config', 'entrar', 'nueva-clave', 'panel'];
  function mostrar(cual){
    vistas.forEach(v => { $(v).hidden = v !== cual; });
    const dentro = cual === 'panel';
    $('salir').hidden = !dentro;
    $('usuario').hidden = !dentro;
  }
  function aviso(id, texto, tipo){
    const el = $(id);
    el.textContent = texto || '';
    el.dataset.tipo = tipo || '';
  }

  if (!sb){ mostrar('sin-config'); return; }

  /* ---------- Sesión ---------- */
  let recuperando = /type=recovery/.test(location.hash);

  async function revisarSesion(){
    if (recuperando) return mostrar('nueva-clave');
    const {data:{session}} = await sb.auth.getSession();
    if (!session) return mostrar('entrar');
    const {data:esAdmin, error} = await sb.rpc('es_admin');
    if (error || !esAdmin){
      await sb.auth.signOut();
      mostrar('entrar');
      aviso('msg-entrar', error ? 'No se pudo revisar el permiso. ¿Ya corrió el archivo configurar.sql en Supabase?' : 'Esta cuenta no tiene permiso para administrar. Pida que agreguen su correo a la tabla "administradores".', 'error');
      return;
    }
    $('usuario').textContent = session.user.email;
    mostrar('panel');
    cargarTodas();
  }

  sb.auth.onAuthStateChange(evento => {
    if (evento === 'PASSWORD_RECOVERY'){ recuperando = true; mostrar('nueva-clave'); }
  });

  $('form-entrar').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target, boton = f.querySelector('[type=submit]');
    if (!f.email.value || !f.password.value) return aviso('msg-entrar', 'Escriba su correo y su contraseña.', 'error');
    boton.disabled = true; aviso('msg-entrar', 'Entrando…');
    const {error} = await sb.auth.signInWithPassword({email:f.email.value.trim(), password:f.password.value});
    boton.disabled = false;
    if (error) return aviso('msg-entrar', 'Correo o contraseña incorrectos.', 'error');
    aviso('msg-entrar', '');
    f.password.value = '';
    revisarSesion();
  });

  $('olvide').addEventListener('click', async () => {
    const email = $('form-entrar').email.value.trim();
    if (!email) return aviso('msg-entrar', 'Escriba primero su correo y vuelva a tocar "Olvidé mi contraseña".', 'error');
    const {error} = await sb.auth.resetPasswordForEmail(email, {redirectTo: location.origin + location.pathname});
    aviso('msg-entrar', error ? 'No se pudo enviar el correo. Intente más tarde.' : 'Le enviamos un correo con un enlace para crear una contraseña nueva.', error ? 'error' : 'ok');
  });

  $('form-clave').addEventListener('submit', async e => {
    e.preventDefault();
    const clave = e.target.password.value;
    if (clave.length < 8) return aviso('msg-clave', 'La contraseña debe tener al menos 8 caracteres.', 'error');
    const {error} = await sb.auth.updateUser({password: clave});
    if (error) return aviso('msg-clave', 'No se pudo cambiar. Pida otro correo de recuperación.', 'error');
    recuperando = false;
    history.replaceState(null, '', location.pathname);
    revisarSesion();
  });

  $('salir').addEventListener('click', async () => { await sb.auth.signOut(); mostrar('entrar'); });

  /* ---------- Lista ---------- */
  let todas = [];
  async function cargarTodas(){
    aviso('msg-panel', 'Cargando…');
    const {data, error} = await sb.from('propiedades').select('*').order('publicada', {ascending:false}).order('clave');
    if (error){ aviso('msg-panel', 'No se pudieron cargar las propiedades: ' + error.message, 'error'); return; }
    aviso('msg-panel', '');
    todas = data.map(P.normalizar);
    pintarFilas();
  }

  function pintarFilas(){
    const q = $('buscar').value.trim().toLowerCase();
    const r = q ? todas.filter(p => [p.clave, p.colonia, p.municipio, p.tipo].join(' ').toLowerCase().includes(q)) : todas;
    const visibles = todas.filter(p => p.visible).length;
    $('conteo-admin').textContent = `${todas.length} en total · ${visibles} visibles en el sitio`;
    $('filas').innerHTML = r.length ? r.map(p => `
      <tr data-id="${p.id}">
        <td class="col-foto">${P.imagen(p)}</td>
        <td><b>${P.escapar(P.titulo(p))}</b><small>${P.escapar(p.clave)} · ${P.escapar(p.municipio)}</small></td>
        <td>${p.operacion === 'venta' ? 'Venta' : 'Renta'}</td>
        <td class="col-precio">${P.escapar(P.precioLargo(p))}</td>
        <td><label class="interruptor"><input type="checkbox" data-visible ${p.visible ? 'checked' : ''} aria-label="Mostrar ${P.escapar(p.clave)} en el sitio"></label></td>
        <td class="col-acciones"><button class="boton secundario chico" type="button" data-editar>Editar</button></td>
      </tr>`).join('')
      : `<tr><td colspan="6" class="vacio-tabla">${todas.length ? 'Ninguna propiedad coincide con la búsqueda.' : 'Todavía no hay propiedades. Toque "Agregar propiedad".'}</td></tr>`;
  }
  $('buscar').addEventListener('input', pintarFilas);

  $('filas').addEventListener('click', e => {
    const fila = e.target.closest('tr[data-id]');
    if (fila && e.target.closest('[data-editar]')) abrirEditor(todas.find(p => p.id === fila.dataset.id));
  });
  $('filas').addEventListener('change', async e => {
    if (!e.target.matches('[data-visible]')) return;
    const id = e.target.closest('tr').dataset.id, visible = e.target.checked;
    const {error} = await sb.from('propiedades').update({visible}).eq('id', id);
    if (error){ e.target.checked = !visible; return aviso('msg-panel', 'No se pudo cambiar: ' + error.message, 'error'); }
    todas.find(p => p.id === id).visible = visible;
    pintarFilas();
    aviso('msg-panel', visible ? 'La propiedad ya se ve en el sitio.' : 'La propiedad se ocultó del sitio.', 'ok');
  });

  /* ---------- Editor ---------- */
  const editor = $('editor'), form = $('form-propiedad');
  let actual = null, fotos = [], fotosPorBorrar = [], mapa, marcador, terminado = false;

  function siguienteClave(){
    let prefijo = 'P-', mayor = 100;
    todas.forEach(p => {
      const m = /^(.*?)(\d+)$/.exec(p.clave || '');
      if (m && Number(m[2]) >= mayor){ mayor = Number(m[2]); prefijo = m[1]; }
    });
    return prefijo + (mayor + 1);
  }

  function ponerUbicacion(lat, lng, centrar){
    form.lat.value = lat; form.lng.value = lng;
    $('coordenadas').textContent = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    if (!marcador){
      marcador = L.marker([lat, lng], {draggable:true}).addTo(mapa);
      marcador.on('dragend', () => { const c = marcador.getLatLng(); ponerUbicacion(c.lat, c.lng); });
    } else marcador.setLatLng([lat, lng]);
    if (centrar) mapa.setView([lat, lng], Math.max(mapa.getZoom(), 15));
  }

  function prepararMapa(){
    if (mapa) return;
    mapa = L.map('mapa-editor').setView([25.68, -100.32], 11);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19,
      attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(mapa);
    // Marcador simple (evita depender de las imágenes de Leaflet)
    L.Marker.prototype.options.icon = L.divIcon({className:'pin-editor', html:'<span></span>', iconSize:[26,26], iconAnchor:[13,26]});
    mapa.on('click', e => ponerUbicacion(e.latlng.lat, e.latlng.lng));
  }

  function abrirEditor(p){
    actual = p || null;
    fotosPorBorrar = [];
    terminado = false;
    form.reset();
    aviso('msg-editor', ''); aviso('msg-fotos', '');
    $('titulo-editor').textContent = p ? `Editar ${p.clave}` : 'Agregar propiedad';
    $('borrar').hidden = !p;
    const d = p || {clave: siguienteClave(), operacion:'venta', tipo:'Casa', visible:true, fotos:[]};
    ['clave','operacion','tipo','colonia','municipio','descripcion'].forEach(k => { form[k].value = d[k] || form[k].value; });
    ['precio','recamaras','banos','estacionamientos','construccion','terreno'].forEach(k => { form[k].value = d[k] != null ? d[k] : (k === 'precio' ? '' : 0); });
    if (!p) form.precio.value = '';
    form.visible.checked = d.visible !== false;
    fotos = [...(d.fotos || [])];
    pintarFotos();
    notaPrecio();
    editor.showModal();
    prepararMapa();
    setTimeout(() => {
      mapa.invalidateSize();
      if (marcador){ mapa.removeLayer(marcador); marcador = null; }
      form.lat.value = form.lng.value = '';
      $('coordenadas').textContent = 'Sin ubicación';
      if (p && p.lat && p.lng) ponerUbicacion(p.lat, p.lng, true);
      else mapa.setView([25.68, -100.32], 11);
    }, 50);
    form.clave.focus();
  }

  function notaPrecio(){ $('nota-precio').textContent = form.operacion.value === 'renta' ? '(por mes)' : '(precio total)'; }
  form.operacion.addEventListener('change', notaPrecio);

  $('agregar').addEventListener('click', () => abrirEditor(null));
  editor.addEventListener('click', e => { if (e.target.closest('[data-cancelar]')) editor.close(); });

  // Buscar la colonia en el mapa (OpenStreetMap / Nominatim)
  $('ubicar-colonia').addEventListener('click', async () => {
    const q = [form.colonia.value, form.municipio.value, 'Nuevo León', 'México'].filter(Boolean).join(', ');
    if (!form.colonia.value && !form.municipio.value) return aviso('msg-editor', 'Escriba primero la colonia y el municipio.', 'error');
    aviso('msg-editor', 'Buscando…');
    try {
      const r = await fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=mx&q=' + encodeURIComponent(q), {headers:{'Accept-Language':'es'}});
      const [lugar] = await r.json();
      if (!lugar) return aviso('msg-editor', 'No encontré esa colonia. Ubíquela tocando el mapa.', 'error');
      ponerUbicacion(Number(lugar.lat), Number(lugar.lon), true);
      aviso('msg-editor', 'Listo. Ajuste el marcador al lugar exacto si hace falta.', 'ok');
    } catch { aviso('msg-editor', 'No se pudo buscar. Ubíquela tocando el mapa.', 'error'); }
  });

  /* ---------- Fotos ---------- */
  function rutaDeFoto(url){
    const marca = `/storage/v1/object/public/${BUCKET}/`;
    const i = url.indexOf(marca);
    return i === -1 ? null : decodeURIComponent(url.slice(i + marca.length));
  }

  function pintarFotos(){
    $('fotos').innerHTML = fotos.map((url, i) => `
      <figure class="foto${i === 0 ? ' principal' : ''}">
        <img src="${P.escapar(url)}" alt="Foto ${i + 1}">
        ${i === 0 ? '<figcaption>Principal</figcaption>' : `<button type="button" data-principal="${i}">Hacer principal</button>`}
        <button type="button" class="quitar" data-quitar="${i}" aria-label="Quitar foto ${i + 1}">×</button>
      </figure>`).join('') || '<p class="ayuda">Sin fotos. Mientras no tenga, se muestra una fachada dibujada.</p>';
  }
  $('fotos').addEventListener('click', e => {
    const q = e.target.closest('[data-quitar]'), pr = e.target.closest('[data-principal]');
    if (q){ fotosPorBorrar.push(...fotos.splice(Number(q.dataset.quitar), 1)); pintarFotos(); }
    if (pr){ const [f] = fotos.splice(Number(pr.dataset.principal), 1); fotos.unshift(f); pintarFotos(); }
  });

  // Reduce la foto a 1600 px de ancho máximo en JPG para que el sitio cargue rápido
  function reducir(archivo){
    return new Promise((resolver, rechazar) => {
      const img = new Image();
      img.onload = () => {
        const escala = Math.min(1, 1600 / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * escala); c.height = Math.round(img.height * escala);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(img.src);
        c.toBlob(b => b ? resolver(b) : rechazar(new Error('No se pudo leer la imagen')), 'image/jpeg', 0.82);
      };
      img.onerror = () => rechazar(new Error('No se pudo leer la imagen'));
      img.src = URL.createObjectURL(archivo);
    });
  }

  let subiendo = 0;
  $('subir-fotos').addEventListener('change', async e => {
    const archivos = [...e.target.files];
    e.target.value = '';
    if (!archivos.length) return;
    const carpeta = (form.clave.value || 'sin-clave').replace(/[^\w-]/g, '');
    subiendo += archivos.length;
    $('guardar').disabled = true;
    let errores = 0;
    for (const [i, archivo] of archivos.entries()){
      aviso('msg-fotos', `Subiendo foto ${i + 1} de ${archivos.length}…`);
      try {
        const blob = await reducir(archivo);
        const ruta = `${carpeta}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.jpg`;
        const {error} = await sb.storage.from(BUCKET).upload(ruta, blob, {contentType:'image/jpeg', cacheControl:'31536000'});
        if (error) throw error;
        fotos.push(sb.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl);
        pintarFotos();
      } catch (err){ console.error(err); errores++; }
      subiendo--;
    }
    $('guardar').disabled = subiendo > 0;
    aviso('msg-fotos', errores ? `${errores} foto(s) no se pudieron subir. Intente de nuevo.` : 'Fotos listas. No olvide tocar "Guardar".', errores ? 'error' : 'ok');
  });

  /* ---------- Guardar y borrar ---------- */
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const n = k => Number(form[k].value) || 0;
    const datos = {
      clave: form.clave.value.trim(),
      operacion: form.operacion.value,
      tipo: form.tipo.value,
      precio: n('precio'),
      colonia: form.colonia.value.trim(),
      municipio: form.municipio.value.trim(),
      lat: Number(form.lat.value), lng: Number(form.lng.value),
      recamaras: n('recamaras'), banos: n('banos'), estacionamientos: n('estacionamientos'),
      construccion: n('construccion'), terreno: n('terreno'),
      descripcion: form.descripcion.value.trim(),
      fotos, visible: form.visible.checked,
    };
    const falta = !datos.clave ? 'la clave' : !datos.precio ? 'el precio' : !datos.colonia ? 'la colonia' : !datos.municipio ? 'el municipio'
      : (!form.lat.value || !form.lng.value) ? 'la ubicación en el mapa' : '';
    if (falta) return aviso('msg-editor', `Falta ${falta}.`, 'error');

    $('guardar').disabled = true; aviso('msg-editor', 'Guardando…');
    const r = actual
      ? await sb.from('propiedades').update(datos).eq('id', actual.id).select().single()
      : await sb.from('propiedades').insert(datos).select().single();
    $('guardar').disabled = false;
    if (r.error){
      const msg = r.error.code === '23505' ? 'Ya existe otra propiedad con esa clave. Use una diferente.' : 'No se pudo guardar: ' + r.error.message;
      return aviso('msg-editor', msg, 'error');
    }
    borrarArchivos(fotosPorBorrar);
    terminado = true;
    editor.close();
    await cargarTodas();
    aviso('msg-panel', `${datos.clave} guardada.${datos.visible ? ' Ya se ve en el sitio.' : ''}`, 'ok');
  });

  function borrarArchivos(urls){
    const rutas = urls.map(rutaDeFoto).filter(Boolean);
    if (rutas.length) sb.storage.from(BUCKET).remove(rutas).then(({error}) => { if (error) console.warn('No se borraron fotos', error); });
  }

  $('borrar').addEventListener('click', async () => {
    if (!actual) return;
    if (!confirm(`¿Borrar ${actual.clave} (${P.titulo(actual)})? No se puede deshacer.\n\nSi solo quiere quitarla del sitio por un tiempo, mejor desmarque "Mostrar en el sitio".`)) return;
    const {error} = await sb.from('propiedades').delete().eq('id', actual.id);
    if (error) return aviso('msg-editor', 'No se pudo borrar: ' + error.message, 'error');
    borrarArchivos([...actual.fotos, ...fotosPorBorrar, ...fotos.filter(f => !actual.fotos.includes(f))]);
    terminado = true;
    editor.close();
    await cargarTodas();
    aviso('msg-panel', `${actual.clave} se borró.`, 'ok');
  });

  // Si cierra sin guardar, se borran las fotos recién subidas que no quedaron guardadas
  editor.addEventListener('close', () => {
    if (terminado) return;
    const originales = actual ? actual.fotos : [];
    borrarArchivos(fotos.filter(f => !originales.includes(f)));
  });

  revisarSesion();
})();
