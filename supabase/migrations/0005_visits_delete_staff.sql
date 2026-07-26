-- Migracion 0005: permite borrar una Hoja de Ruta (feature nueva en el
-- calendario) sin romper la regla original de 0002_rls.sql de conservar
-- todo el historial de visitas.
--
-- 0002_rls.sql dejo las visitas y visit_events sin ninguna policy de
-- DELETE a proposito ("se conserva todo el historial de visitas"). Eso
-- sigue siendo correcto para cualquier visita que un tecnico ya toco.
-- Lo unico que agregamos aca es un permiso bien acotado: administrativo
-- o supervisor pueden borrar una visita solo si todavia esta en
-- planificada/borrador y nunca se envio — es decir, todavia no existe
-- ningun historial real que perder. La UI (RouteSheetFormModal) ya
-- aplica exactamente este mismo criterio antes de dejar tildar el boton
-- "Eliminar", esto solo lo hace cumplir tambien del lado de la base.

create policy "visits_delete_staff" on public.visits
  for delete to authenticated
  using (
    public.current_staff_role() in ('administrativo', 'supervisor')
    and status in ('planificada', 'borrador')
    and submitted_at is null
  );

-- visit_events es "append-only" por diseño (ver comentario en 0002_rls.sql),
-- pero al borrar una visita sin historial real sus eventos (ej. el
-- "creada" inicial) tienen que poder borrarse en cascada junto con ella.
create policy "visit_events_delete_staff" on public.visit_events
  for delete to authenticated
  using (public.current_staff_role() in ('administrativo', 'supervisor'));
