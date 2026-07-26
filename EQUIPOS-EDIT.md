Equipos
	(CORREGIDO)1-elimina este parrafo "<p (CORREGIDO)(CORREGIDO)class="font-body-md text-body-md text-on-surface-variant">Agrupados por cliente, con historial y alertas de service anual.</p>"
	(CORREGIDO)2-Formulario "Nuevo Cliente" debe tener:
		-Cliente
		-Contacto
		-Telefono
		-Direccion
		-Ciudad
	(Revisar modificaciones)3-Formulario "Nuevo Equipo" debe tener:
		Datos principales:
			-Motor
			- N de Serie
			-Generador
			-Potencia
			-Combustible
		Datos secundarios:
			Filtro de combustible
			Filtro de Aceite
			Filtro de aire
			Cant de agua
			Cant de combustible
			Cant de baterias y medida
	(CORREGIDO)4-Elimina la columna "Proximo Anual"
	(CORREGIDO)5-Modificar la ficha Detalle con:
		-Los datos del punto 3
		-Cambio filtro de Combustiblre (calendario fecha)
		-Cambio filtro de Aceite(calendario fecha)
		-Fecha de baterias(calendario fecha)
		-Porcentaje de Combustible
		-Horas de uso
	(Revisa modificaciones)6-En el historial solo se deben almacenar las visitas del tecnico

Modificaciones:
1-Cant de baterias y medida Son dos campos diferentes
2-Elimina el campo Codigo Interno del formulario 
3-Elimina los campos ubicacion y fecha de instalacion
4-En el listado de equipos quiero ver cliente/equipo porcentaje de combustible, hora de uso y ultimo service
5-Al hacer click en la visita en el historial me debe llevar al formulario de visita(El que aun no hicimos) para ver el detalle de lo que reporto el tecnico