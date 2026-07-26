-- Datos de prueba: clientes, equipos y vehiculos.
-- Los usuarios de prueba (uno por rol) NO se crean aca: hay que darlos de alta
-- primero en auth.users (dashboard de Supabase > Authentication > Add user)
-- y luego insertar su fila correspondiente en profiles, por ejemplo:
--
--   insert into public.profiles (id, username, full_name, role)
--   values ('<uuid-del-usuario-creado>', 'jperez', 'Juan Perez', 'tecnico');
--
-- Una vez que exista al menos un perfil "tecnico", las visitas se crean
-- interactivamente desde la app (calendario del administrativo), tal como
-- describe la seccion de Verificacion del plan.

insert into public.clients (id, name, tax_id, address, contact_name, contact_phone, contact_email) values
  ('11111111-1111-1111-1111-111111111111', 'Frigorifico del Sur S.A.', '30-11111111-1', 'Ruta 5 km 12, Lujan', 'Marcelo Ibañez', '011-4444-1111', 'contacto@frigorificodelsur.com'),
  ('22222222-2222-2222-2222-222222222222', 'Hospital Santa Rita', '30-22222222-2', 'Av. Rivadavia 4500, CABA', 'Dra. Claudia Weiss', '011-4444-2222', 'mantenimiento@hospitalsantarita.org'),
  ('33333333-3333-3333-3333-333333333333', 'Countryside Logistica S.R.L.', '30-33333333-3', 'Parque Industrial Pilar, Lote 8', 'Ruben Sosa', '011-4444-3333', 'ruben.sosa@countrysidelog.com');

insert into public.equipment (
  id, client_id, motor, generador, serial_number, power_kva, fuel_type,
  condition_status, last_service_date, last_annual_service_date, notes
) values
  -- servicio anual vencido hace mas de un mes -> alerta "vencido"
  ('a1111111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Cummins', 'C150D5', 'CUM150-88213', 150, 'diesel',
   'atencion', current_date - interval '2 months', current_date - interval '13 months', 'Ruido inusual en el ultimo arranque.'),

  -- servicio anual vence dentro de 15 dias -> alerta "proximo"
  ('a1111111-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222',
   'Caterpillar', 'C9', 'CAT9-40217', 220, 'diesel',
   'optimo', current_date - interval '1 months', current_date - interval '11 months' - interval '15 days', 'Equipo critico: quirofanos.'),

  -- al dia
  ('a1111111-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222',
   'Caterpillar', 'C9', 'CAT9-40218', 220, 'diesel',
   'optimo', current_date - interval '2 months', current_date - interval '2 months', 'Equipo de respaldo del quirofano.'),

  -- fuera de servicio
  ('a1111111-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333',
   'Perkins', '1104C-44', 'PRK-91027', 60, 'diesel',
   'fuera_servicio', current_date - interval '5 months', current_date - interval '18 months', 'A la espera de repuesto para el alternador.'),

  -- servicio anual proximo a 25 dias -> alerta "proximo"
  ('a1111111-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333',
   'Cummins', 'C220D5', 'CUM220-77531', 220, 'gas',
   'optimo', current_date - interval '20 days', current_date - interval '11 months' - interval '5 days', null);

insert into public.vehicles (plate, description) values
  ('AC123XY', 'Toyota Hilux blanca - unidad 1'),
  ('AD456ZT', 'Renault Kangoo blanca - unidad 2'),
  ('AE789WQ', 'Ford Ranger gris - unidad 3');
