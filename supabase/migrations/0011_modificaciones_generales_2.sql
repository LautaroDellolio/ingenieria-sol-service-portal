-- Filtro de aire: fecha de ultimo cambio (ya existia el spec en air_filter_spec)
alter table public.equipment add column air_filter_changed_at date;

-- Proximo Service: fechas editables, precargadas con un default calculado
-- (Seguimiento + 1 o 2 anios) mientras no se hayan guardado antes.
alter table public.equipment add column fuel_filter_next_due_at date;
alter table public.equipment add column oil_filter_next_due_at date;
alter table public.equipment add column air_filter_next_due_at date;
alter table public.equipment add column battery_next_due_at date;

-- "Cantidad de Combustible" pasa a ser el tamano del tanque en litros
-- (la tabla esta vacia, sin riesgo de datos viejos que no conviertan)
alter table public.equipment alter column fuel_capacity type numeric using nullif(fuel_capacity, '')::numeric;
