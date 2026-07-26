-- Migracion 0003: soporte de multiples tecnicos por visita
-- (antes: visits.technician_id era una FK escalar a un solo tecnico)

-- ============================================================
-- Limpieza previa: el feature de fotos de visitas se dio de baja el
-- 2026-07-25 ("no necesito guardar imagenes de las visitas"), pero esa
-- baja solo se aplico a los archivos de migracion locales — la tabla
-- visit_photos y sus policies ya se habian creado en la base en vivo
-- antes del pedido, y nunca se eliminaron ahi. Sus policies de
-- storage.objects referencian technician_id, y bloquean el drop de
-- mas abajo. Se limpian aca antes de tocar la columna.
-- ============================================================
drop policy if exists "visit_photos_storage_select" on storage.objects;
drop policy if exists "visit_photos_storage_insert" on storage.objects;
drop policy if exists "visit_photos_storage_delete" on storage.objects;
drop table if exists public.visit_photos;

-- ============================================================
-- Tabla puente
-- ============================================================
create table public.visit_technicians (
  visit_id uuid not null references public.visits(id) on delete cascade,
  technician_id uuid not null references public.profiles(id),
  primary key (visit_id, technician_id)
);
create index visit_technicians_technician_idx on public.visit_technicians(technician_id);

-- Backfill: copiar cada tecnico ya asignado antes de borrar la columna vieja
insert into public.visit_technicians (visit_id, technician_id)
select id, technician_id from public.visits where technician_id is not null;

-- ============================================================
-- Helper de RLS (mismo patron que current_staff_role(): security
-- definer para evitar recursion infinita al consultar
-- visit_technicians desde una policy de la propia tabla)
-- ============================================================
create or replace function public.is_visit_technician(p_visit_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.visit_technicians vt
    where vt.visit_id = p_visit_id and vt.technician_id = auth.uid()
  );
$$;

alter table public.visit_technicians enable row level security;

create policy "visit_technicians_select" on public.visit_technicians
  for select to authenticated
  using (
    public.current_staff_role() in ('administrativo', 'supervisor')
    or public.is_visit_technician(visit_id)
  );

-- Solo administrativo/supervisor pueden asignar o quitar tecnicos
-- (el tecnico no se auto-asigna ni se auto-quita de una visita).
create policy "visit_technicians_write_staff" on public.visit_technicians
  for all to authenticated
  using (public.current_staff_role() in ('administrativo', 'supervisor'))
  with check (public.current_staff_role() in ('administrativo', 'supervisor'));

-- ============================================================
-- Reescribir policies de visits que dependian de technician_id
-- ============================================================
drop policy "visits_select_own_or_staff" on public.visits;
create policy "visits_select_own_or_staff" on public.visits
  for select to authenticated
  using (
    public.is_visit_technician(id)
    or public.current_staff_role() in ('administrativo', 'supervisor')
  );

drop policy "visits_update_own_editable" on public.visits;
create policy "visits_update_own_editable" on public.visits
  for update to authenticated
  using (
    public.is_visit_technician(id)
    and status in ('planificada', 'borrador', 'revision_solicitada')
  )
  with check (public.is_visit_technician(id));

-- ============================================================
-- Reescribir policies de visit_parameters / visit_events
-- ============================================================
drop policy "visit_parameters_select" on public.visit_parameters;
create policy "visit_parameters_select" on public.visit_parameters
  for select to authenticated
  using (
    exists (
      select 1 from public.visits v
      where v.id = visit_parameters.visit_id
        and (public.is_visit_technician(v.id) or public.current_staff_role() in ('administrativo', 'supervisor'))
    )
  );

drop policy "visit_parameters_write" on public.visit_parameters;
create policy "visit_parameters_write" on public.visit_parameters
  for all to authenticated
  using (
    exists (
      select 1 from public.visits v
      where v.id = visit_parameters.visit_id
        and (
          (public.is_visit_technician(v.id) and v.status in ('planificada', 'borrador', 'revision_solicitada'))
          or public.current_staff_role() in ('administrativo', 'supervisor')
        )
    )
  )
  with check (
    exists (
      select 1 from public.visits v
      where v.id = visit_parameters.visit_id
        and (
          (public.is_visit_technician(v.id) and v.status in ('planificada', 'borrador', 'revision_solicitada'))
          or public.current_staff_role() in ('administrativo', 'supervisor')
        )
    )
  );

drop policy "visit_events_select" on public.visit_events;
create policy "visit_events_select" on public.visit_events
  for select to authenticated
  using (
    exists (
      select 1 from public.visits v
      where v.id = visit_events.visit_id
        and (public.is_visit_technician(v.id) or public.current_staff_role() in ('administrativo', 'supervisor'))
    )
  );

drop policy "visit_events_insert" on public.visit_events;
create policy "visit_events_insert" on public.visit_events
  for insert to authenticated
  with check (
    exists (
      select 1 from public.visits v
      where v.id = visit_events.visit_id
        and (public.is_visit_technician(v.id) or public.current_staff_role() in ('administrativo', 'supervisor'))
    )
  );

-- ============================================================
-- Eliminar la columna vieja (ya migrada a visit_technicians);
-- arrastra consigo su indice y su FK automaticamente.
-- ============================================================
alter table public.visits drop column technician_id;
