-- Firma del tecnico y del cliente al cierre de la visita: se dibujan en un
-- lienzo (canvas) del formulario y se guardan como imagen PNG en base64
-- (data URL). El cliente no tiene cuenta en el sistema, asi que ambas se
-- escriben desde la sesion ya autenticada del tecnico (le pasa el
-- dispositivo para que el cliente firme) — no hace falta ninguna policy de
-- RLS nueva: "visits_update_own_editable" ya permite al tecnico actualizar
-- cualquier columna de su propia visita en estado editable (RLS es a nivel
-- de fila, no de columna).
alter table public.visits
  add column technician_signature text,
  add column technician_signature_name text,
  add column technician_signature_at timestamptz,
  add column client_signature text,
  add column client_signature_name text,
  add column client_signature_at timestamptz;

comment on column public.visits.technician_signature is 'Firma dibujada del tecnico responsable, como PNG en base64 (data URL).';
comment on column public.visits.client_signature is 'Firma dibujada de conformidad del cliente, como PNG en base64 (data URL).';

-- El conjunto de parametros quedo definido (ver src/lib/constants.js,
-- VISIT_PARAMETER_DEFINITIONS) — ya no es un placeholder pendiente.
comment on table public.visit_parameters is 'Mediciones cuantitativas de la visita, un registro por metrica definida en VISIT_PARAMETER_DEFINITIONS.';
