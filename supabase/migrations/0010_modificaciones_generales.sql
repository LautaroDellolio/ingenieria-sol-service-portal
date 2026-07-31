-- 1. Cantidad de aceite en la ficha tecnica (junto a cantidad de combustible)
alter table public.equipment add column oil_capacity text;

-- 3-4. Descripcion de la hoja de ruta (se muestra en el calendario) y
-- ocurrencia mensual para mantenimiento preventivo (primera/segunda visita)
alter table public.route_sheets add column descripcion text;
alter table public.route_sheets add column visit_occurrence text
  check (visit_occurrence is null or visit_occurrence in ('primera', 'segunda'));
