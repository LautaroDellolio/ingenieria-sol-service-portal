-- Migracion 0007: ajustes de EQUIPOS-EDIT.md (bloque "Modificaciones").

-- "Codigo Interno" deja de cargarse desde el formulario: pasa a ser una key
-- interna autogenerada por la base (nunca se muestra en la UI).
create sequence public.equipment_internal_code_seq;
alter table public.equipment
  alter column internal_code set default 'GE-' || lpad(nextval('public.equipment_internal_code_seq')::text, 5, '0');

-- "Cant de baterias y medida" son dos campos, no uno.
alter table public.equipment rename column battery_spec to battery_size;
alter table public.equipment add column battery_quantity text;

-- Se elimina Ubicacion y Fecha de Instalacion de toda la app.
alter table public.equipment drop column site_location;
alter table public.equipment drop column install_date;
