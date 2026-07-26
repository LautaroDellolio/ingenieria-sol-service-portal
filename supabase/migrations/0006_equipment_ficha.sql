-- Migracion 0006: ficha tecnica real del equipo (reemplaza el placeholder
-- de 0001_init.sql) segun EQUIPOS-EDIT.md.

alter table public.clients add column city text;

-- "Datos principales": marca/modelo generico no encaja con un grupo
-- electrogeno (tiene motor y generador, cada uno de su propio fabricante).
alter table public.equipment rename column brand to motor;
alter table public.equipment rename column model to generador;

-- "Datos secundarios": specs de referencia cargadas al alta del equipo.
alter table public.equipment add column fuel_filter_spec text;
alter table public.equipment add column oil_filter_spec text;
alter table public.equipment add column air_filter_spec text;
alter table public.equipment add column coolant_capacity text;
alter table public.equipment add column fuel_capacity text;
alter table public.equipment add column battery_spec text;

-- Ficha Detalle: seguimiento que se carga/actualiza despues del alta,
-- desde el modo "Editar" de la ficha (administrativo/supervisor).
alter table public.equipment add column fuel_filter_changed_at date;
alter table public.equipment add column oil_filter_changed_at date;
alter table public.equipment add column battery_changed_at date;
alter table public.equipment add column fuel_percentage numeric;
alter table public.equipment add column hours_of_use numeric;
