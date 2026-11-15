/*
  Configuración del sitio.

  Mientras supabaseUrl y supabaseAnonKey estén vacíos, el sitio muestra las propiedades de ejemplo
  de recursos/propiedades-datos.js y el panel de administrador no se puede usar.

  Para conectarlo, siga los pasos de CONFIGURAR-SUPABASE.md y pegue aquí los dos valores
  (Supabase → Project Settings → API). La "anon public key" está hecha para ir en la página: es pública.
  NUNCA pegue aquí la "service_role key".
*/
window.CONFIG = {
  supabaseUrl: '',        // por ejemplo 'https://abcdefghijkl.supabase.co'
  supabaseAnonKey: '',    // la clave "anon public"
  whatsapp: '528140297419' // WhatsApp del negocio: 52 + 10 dígitos, sin espacios
};
