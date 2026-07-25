-- Esquema inicial: Ingenieria Sol - Portal de Operaciones
create extension if not exists pgcrypto;

-- ============================================================
-- profiles: extiende auth.users 1:1 con rol de la aplicacion
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text not null,
  role text not null check (role in ('administrativo', 'tecnico', 'supervisor')),
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================
-- clients: clientes de la empresa
-- ============================================================
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tax_id text,
  address text,
  contact_name text,
  contact_phone text,
  contact_email text,
  notes text,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);

-- ============================================================
-- equipment: grupos electrogenos (ficha tecnica PLACEHOLDER,
-- pendiente de la especificacion detallada del usuario)
-- ============================================================
create table public.equipment (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id),
  internal_code text unique not null,
  brand text,
  model text,
  serial_number text,
  power_kva numeric,
  fuel_type text check (fuel_type in ('diesel', 'nafta', 'gas')),
  install_date date,
  site_location text,
  condition_status text not null default 'optimo'
    check (condition_status in ('optimo', 'atencion', 'fuera_servicio')),
  last_service_date date,
  last_annual_service_date date,
  notes text,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);
create index equipment_client_idx on public.equipment(client_id);

-- ============================================================
-- vehicles: lista simple de la flota (sin pantalla de CRUD)
-- ============================================================
create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  plate text unique not null,
  description text,
  active boolean not null default true
);

-- ============================================================
-- visits: ciclo de vida completo (planificacion + ejecucion + revision)
-- ============================================================
create table public.visits (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid not null references public.equipment(id),
  technician_id uuid references public.profiles(id), -- null = "sin asignar" en el calendario
  vehicle_id uuid references public.vehicles(id),
  scheduled_date date,
  scheduled_time_start time,
  scheduled_duration_minutes integer default 60,
  status text not null default 'planificada'
    check (status in ('planificada', 'borrador', 'enviada', 'revision_solicitada', 'aprobada', 'rechazada')),
  service_type text check (service_type in ('preventivo', 'correctivo', 'instalacion', 'inspeccion')),
  is_annual_service boolean not null default false,
  checklist_data jsonb,
  notes text,
  fault_reported boolean not null default false,
  fault_description text,
  draft_saved_at timestamptz,
  submitted_at timestamptz,
  received_by uuid references public.profiles(id),
  received_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  review_notes text,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);
create index visits_technician_idx on public.visits(technician_id);
create index visits_scheduled_date_idx on public.visits(scheduled_date);
create index visits_equipment_idx on public.visits(equipment_id);

-- ============================================================
-- visit_parameters: mediciones cuantitativas (PLACEHOLDER,
-- especifico de grupos electrogenos, pendiente de especificacion)
-- ============================================================
create table public.visit_parameters (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references public.visits(id) on delete cascade,
  metric_key text not null,
  metric_label text not null,
  value numeric,
  unit text,
  spec_min numeric,
  spec_max numeric
);
create index visit_parameters_visit_idx on public.visit_parameters(visit_id);

-- ============================================================
-- visit_events: historial de auditoria (timeline + feed de actividad)
-- ============================================================
create table public.visit_events (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references public.visits(id) on delete cascade,
  event_type text not null check (event_type in
    ('creada', 'borrador_guardado', 'enviada', 'revision_solicitada', 'recibida', 'aprobada', 'rechazada')),
  actor_id uuid references public.profiles(id),
  notes text,
  created_at timestamptz not null default now()
);
create index visit_events_visit_idx on public.visit_events(visit_id);
create index visit_events_created_idx on public.visit_events(created_at desc);
