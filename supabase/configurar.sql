-- =====================================================================
--  Base de datos del sitio de bienes raíces (Supabase)
--  Cómo usarlo: Supabase → SQL Editor → New query → pegue todo → Run.
--  Se puede volver a correr sin problema.
--  ANTES de correrlo, cambie el correo de la última línea por el del administrador.
-- =====================================================================

-- Propiedades
create table if not exists public.propiedades (
  id               uuid primary key default gen_random_uuid(),
  clave            text not null unique,
  operacion        text not null check (operacion in ('venta','renta')),
  tipo             text not null check (tipo in ('Casa','Departamento','Terreno','Local')),
  precio           numeric not null check (precio >= 0),
  colonia          text not null default '',
  municipio        text not null default '',
  lat              double precision not null,
  lng              double precision not null,
  recamaras        integer not null default 0,
  banos            numeric not null default 0,
  estacionamientos integer not null default 0,
  construccion     numeric not null default 0,
  terreno          numeric not null default 0,
  descripcion      text not null default '',
  fotos            text[] not null default '{}',
  visible          boolean not null default true,
  publicada        date not null default current_date,
  creada           timestamptz not null default now(),
  actualizada      timestamptz not null default now()
);

create or replace function public.marcar_actualizada() returns trigger language plpgsql as $$
begin new.actualizada = now(); return new; end $$;
drop trigger if exists propiedades_actualizada on public.propiedades;
create trigger propiedades_actualizada before update on public.propiedades
  for each row execute function public.marcar_actualizada();

-- Quién puede administrar (correos con permiso para entrar al panel)
create table if not exists public.administradores (email text primary key);

create or replace function public.es_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.administradores
                 where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;

-- Permisos: cualquiera ve las propiedades visibles; solo los administradores cambian algo
alter table public.propiedades enable row level security;
alter table public.administradores enable row level security;

grant select on public.propiedades to anon, authenticated;
grant insert, update, delete on public.propiedades to authenticated;
grant execute on function public.es_admin() to anon, authenticated;

drop policy if exists "ver propiedades" on public.propiedades;
create policy "ver propiedades" on public.propiedades for select using (visible or public.es_admin());
drop policy if exists "agregar propiedades" on public.propiedades;
create policy "agregar propiedades" on public.propiedades for insert to authenticated with check (public.es_admin());
drop policy if exists "editar propiedades" on public.propiedades;
create policy "editar propiedades" on public.propiedades for update to authenticated using (public.es_admin()) with check (public.es_admin());
drop policy if exists "borrar propiedades" on public.propiedades;
create policy "borrar propiedades" on public.propiedades for delete to authenticated using (public.es_admin());

-- Fotos: carpeta pública "fotos"; solo los administradores suben o borran
insert into storage.buckets (id, name, public) values ('fotos', 'fotos', true)
  on conflict (id) do update set public = true;

drop policy if exists "fotos: subir" on storage.objects;
create policy "fotos: subir" on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos' and public.es_admin());
drop policy if exists "fotos: cambiar" on storage.objects;
create policy "fotos: cambiar" on storage.objects for update to authenticated
  using (bucket_id = 'fotos' and public.es_admin());
drop policy if exists "fotos: borrar" on storage.objects;
create policy "fotos: borrar" on storage.objects for delete to authenticated
  using (bucket_id = 'fotos' and public.es_admin());

-- >>> CAMBIE ESTE CORREO por el del administrador (el mismo con el que creará el usuario) <<<
insert into public.administradores (email) values ('correo-del-administrador@ejemplo.com')
  on conflict do nothing;
