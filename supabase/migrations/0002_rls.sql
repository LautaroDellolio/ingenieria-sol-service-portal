-- Row Level Security: perfiles, datos maestros y visitas

-- ============================================================
-- Helper: evita recursion infinita cuando una policy sobre
-- profiles necesita leer el rol del usuario actual desde profiles
-- ============================================================
create or replace function public.current_staff_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.equipment enable row level security;
alter table public.vehicles enable row level security;
alter table public.visits enable row level security;
alter table public.visit_parameters enable row level security;
alter table public.visit_events enable row level security;

-- ============================================================
-- profiles
-- ============================================================
create policy "profiles_select_authenticated" on public.profiles
  for select to authenticated
  using (true);

-- Sin policy de INSERT: el alta de personal la hace la Edge Function
-- create-staff usando la service_role key, que ignora RLS por completo.

create policy "profiles_update_self_or_supervisor" on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.current_staff_role() = 'supervisor')
  with check (id = auth.uid() or public.current_staff_role() = 'supervisor');

-- Sin policy de DELETE: la baja de personal es logica (profiles.active = false).

-- ============================================================
-- clients / equipment / vehicles: datos maestros
-- ============================================================
create policy "clients_select_authenticated" on public.clients
  for select to authenticated using (true);
create policy "clients_write_staff" on public.clients
  for all to authenticated
  using (public.current_staff_role() in ('administrativo', 'supervisor'))
  with check (public.current_staff_role() in ('administrativo', 'supervisor'));

create policy "equipment_select_authenticated" on public.equipment
  for select to authenticated using (true);
create policy "equipment_write_staff" on public.equipment
  for all to authenticated
  using (public.current_staff_role() in ('administrativo', 'supervisor'))
  with check (public.current_staff_role() in ('administrativo', 'supervisor'));

create policy "vehicles_select_authenticated" on public.vehicles
  for select to authenticated using (true);
create policy "vehicles_write_staff" on public.vehicles
  for all to authenticated
  using (public.current_staff_role() in ('administrativo', 'supervisor'))
  with check (public.current_staff_role() in ('administrativo', 'supervisor'));

-- ============================================================
-- visits: el tecnico solo ve/edita las suyas; administrativo y
-- supervisor ven y editan todas
-- ============================================================
create policy "visits_select_own_or_staff" on public.visits
  for select to authenticated
  using (
    technician_id = auth.uid()
    or public.current_staff_role() in ('administrativo', 'supervisor')
  );

create policy "visits_insert_staff" on public.visits
  for insert to authenticated
  with check (public.current_staff_role() in ('administrativo', 'supervisor'));

create policy "visits_update_own_editable" on public.visits
  for update to authenticated
  using (
    technician_id = auth.uid()
    and status in ('planificada', 'borrador', 'revision_solicitada')
  )
  with check (technician_id = auth.uid());

create policy "visits_update_staff" on public.visits
  for update to authenticated
  using (public.current_staff_role() in ('administrativo', 'supervisor'))
  with check (public.current_staff_role() in ('administrativo', 'supervisor'));

-- Sin policy de DELETE: se conserva todo el historial de visitas.

-- ============================================================
-- visit_parameters: sigue el mismo criterio que su visita padre
-- ============================================================
create policy "visit_parameters_select" on public.visit_parameters
  for select to authenticated
  using (
    exists (
      select 1 from public.visits v
      where v.id = visit_parameters.visit_id
        and (v.technician_id = auth.uid() or public.current_staff_role() in ('administrativo', 'supervisor'))
    )
  );

create policy "visit_parameters_write" on public.visit_parameters
  for all to authenticated
  using (
    exists (
      select 1 from public.visits v
      where v.id = visit_parameters.visit_id
        and (
          (v.technician_id = auth.uid() and v.status in ('planificada', 'borrador', 'revision_solicitada'))
          or public.current_staff_role() in ('administrativo', 'supervisor')
        )
    )
  )
  with check (
    exists (
      select 1 from public.visits v
      where v.id = visit_parameters.visit_id
        and (
          (v.technician_id = auth.uid() and v.status in ('planificada', 'borrador', 'revision_solicitada'))
          or public.current_staff_role() in ('administrativo', 'supervisor')
        )
    )
  );

-- ============================================================
-- visit_events: historial de auditoria, solo lectura + insercion
-- (append-only, nunca se edita ni se borra)
-- ============================================================
create policy "visit_events_select" on public.visit_events
  for select to authenticated
  using (
    exists (
      select 1 from public.visits v
      where v.id = visit_events.visit_id
        and (v.technician_id = auth.uid() or public.current_staff_role() in ('administrativo', 'supervisor'))
    )
  );

create policy "visit_events_insert" on public.visit_events
  for insert to authenticated
  with check (
    exists (
      select 1 from public.visits v
      where v.id = visit_events.visit_id
        and (v.technician_id = auth.uid() or public.current_staff_role() in ('administrativo', 'supervisor'))
    )
  );
