-- Migracion 0004: "Hoja de Ruta" — agrupa las visitas (equipos) que el
-- administrativo crea juntas en un mismo acto. La asignacion de
-- tecnico(s) y vehiculo pasa de ser por visita a ser por hoja de ruta.

-- ============================================================
-- Tablas nuevas
-- ============================================================
create table public.route_sheets (
  id uuid primary key default gen_random_uuid(),
  service_type text check (service_type in ('preventivo', 'correctivo', 'instalacion', 'inspeccion')),
  scheduled_date date,
  scheduled_time_start time,
  vehicle_id uuid references public.vehicles(id),
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);
create index route_sheets_scheduled_date_idx on public.route_sheets(scheduled_date);

create table public.route_sheet_technicians (
  route_sheet_id uuid not null references public.route_sheets(id) on delete cascade,
  technician_id uuid not null references public.profiles(id),
  primary key (route_sheet_id, technician_id)
);
create index route_sheet_technicians_technician_idx on public.route_sheet_technicians(technician_id);

alter table public.visits add column route_sheet_id uuid references public.route_sheets(id);

-- ============================================================
-- Backfill: cada visita existente pasa a tener su propia hoja de
-- ruta "de un equipo", heredando vehiculo/fecha/hora/tipo de servicio
-- y tecnicos que ya tenia, para no perder nada ya cargado.
-- ============================================================
do $$
declare
  v record;
  new_route_sheet_id uuid;
begin
  for v in select * from public.visits loop
    insert into public.route_sheets (service_type, scheduled_date, scheduled_time_start, vehicle_id, created_at, created_by)
    values (v.service_type, v.scheduled_date, v.scheduled_time_start, v.vehicle_id, v.created_at, v.created_by)
    returning id into new_route_sheet_id;

    update public.visits set route_sheet_id = new_route_sheet_id where id = v.id;

    insert into public.route_sheet_technicians (route_sheet_id, technician_id)
    select new_route_sheet_id, vt.technician_id
    from public.visit_technicians vt
    where vt.visit_id = v.id;
  end loop;
end $$;

alter table public.visits alter column route_sheet_id set not null;
create index visits_route_sheet_idx on public.visits(route_sheet_id);
alter table public.visits drop column vehicle_id;

-- ============================================================
-- Helper de RLS (mismo patron que current_staff_role() /
-- is_visit_technician(): security definer para evitar recursion
-- infinita al consultar route_sheet_technicians desde una policy de
-- la propia tabla)
-- ============================================================
create or replace function public.is_route_sheet_technician(p_route_sheet_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.route_sheet_technicians rst
    where rst.route_sheet_id = p_route_sheet_id and rst.technician_id = auth.uid()
  );
$$;

alter table public.route_sheets enable row level security;
alter table public.route_sheet_technicians enable row level security;

create policy "route_sheets_select" on public.route_sheets
  for select to authenticated
  using (
    public.current_staff_role() in ('administrativo', 'supervisor')
    or public.is_route_sheet_technician(id)
  );

create policy "route_sheets_write_staff" on public.route_sheets
  for all to authenticated
  using (public.current_staff_role() in ('administrativo', 'supervisor'))
  with check (public.current_staff_role() in ('administrativo', 'supervisor'));

create policy "route_sheet_technicians_select" on public.route_sheet_technicians
  for select to authenticated
  using (
    public.current_staff_role() in ('administrativo', 'supervisor')
    or public.is_route_sheet_technician(route_sheet_id)
  );

-- Solo administrativo/supervisor asignan o quitan tecnicos de una
-- hoja de ruta (el tecnico no se auto-asigna ni se auto-quita).
create policy "route_sheet_technicians_write_staff" on public.route_sheet_technicians
  for all to authenticated
  using (public.current_staff_role() in ('administrativo', 'supervisor'))
  with check (public.current_staff_role() in ('administrativo', 'supervisor'));

-- ============================================================
-- Reescribir policies de visits / visit_parameters / visit_events:
-- antes chequeaban is_visit_technician(visits.id) via visit_technicians,
-- ahora chequean is_route_sheet_technician(visits.route_sheet_id) via
-- route_sheet_technicians.
-- ============================================================
drop policy "visits_select_own_or_staff" on public.visits;
create policy "visits_select_own_or_staff" on public.visits
  for select to authenticated
  using (
    public.is_route_sheet_technician(route_sheet_id)
    or public.current_staff_role() in ('administrativo', 'supervisor')
  );

drop policy "visits_update_own_editable" on public.visits;
create policy "visits_update_own_editable" on public.visits
  for update to authenticated
  using (
    public.is_route_sheet_technician(route_sheet_id)
    and status in ('planificada', 'borrador', 'revision_solicitada')
  )
  with check (public.is_route_sheet_technician(route_sheet_id));

drop policy "visit_parameters_select" on public.visit_parameters;
create policy "visit_parameters_select" on public.visit_parameters
  for select to authenticated
  using (
    exists (
      select 1 from public.visits v
      where v.id = visit_parameters.visit_id
        and (public.is_route_sheet_technician(v.route_sheet_id) or public.current_staff_role() in ('administrativo', 'supervisor'))
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
          (public.is_route_sheet_technician(v.route_sheet_id) and v.status in ('planificada', 'borrador', 'revision_solicitada'))
          or public.current_staff_role() in ('administrativo', 'supervisor')
        )
    )
  )
  with check (
    exists (
      select 1 from public.visits v
      where v.id = visit_parameters.visit_id
        and (
          (public.is_route_sheet_technician(v.route_sheet_id) and v.status in ('planificada', 'borrador', 'revision_solicitada'))
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
        and (public.is_route_sheet_technician(v.route_sheet_id) or public.current_staff_role() in ('administrativo', 'supervisor'))
    )
  );

drop policy "visit_events_insert" on public.visit_events;
create policy "visit_events_insert" on public.visit_events
  for insert to authenticated
  with check (
    exists (
      select 1 from public.visits v
      where v.id = visit_events.visit_id
        and (public.is_route_sheet_technician(v.route_sheet_id) or public.current_staff_role() in ('administrativo', 'supervisor'))
    )
  );

-- ============================================================
-- Limpieza: tabla y funcion viejas, ya reemplazadas por las de arriba.
-- ============================================================
drop table public.visit_technicians;
drop function public.is_visit_technician(uuid);
