# MODIFICACIONES.md

	(CORREGIDA)-agregar cant de aceite a la ficha tecnica del equipo (Justo despues de cant de combustible)
	(CORREGIDA)-El supervisor puede eliminar clientes
	(CORREGIDA)-Agregar campo "Descripción" en el formulario "Nueva hoja de ruta" y que ese sea el texto que se visualice en el calendario(esto quedo bien pero mueve el input arriba, justo debajo del titulo y agranda el font size general de ese formulario)
	(CORREGIDA)- y si tipo de visita = mantenimiento preventivo agregar select con "Primera visita" y "Segunda visita"
	(CORREGIDA)-Los campos del formulario de la visita  tecnica deben ser obligatorios menos la firma que puede ser opcional
	(CORREGIDA)-Ver vista "Resumen" en rol supervisor(Igual que el adimin)
	(CORREGIDA)-En el listado de visitas realizadas quiero ver tmb las que esten pendientes de aprobacion
	(CORREGIDA)-bug rol administrativo => Recepcion => todas = 0 resultado esperado tengo una visitia
	(CORREGIDA)-En el  historial de la visita cambiar leyenda de "Esperando revision" a "Enviada"
	(CORREGIDA)-Agranda el font size el formulario de la visita

	-En la hoja de edicion detalle de equipo debajo de "Seguimieto" agregar "Proximo Service" con los campos:
		(CORREGIDA)-Cambio Filtro de combustible(default se auto complete un año despues de la fecha que indique seguimiento pero sea editable)
		(CORREGIDA)-Cambio Filtro de aceite(default se auto complete un año despues de la fecha que indique seguimiento pero sea editable)
		(CORREGIDA)-Cambio bateria(default se auto complete dos años despues de la fecha que indique seguimiento pero sea editable)
	-y agreguegar tanto en seguimiento como proximo service:
		(CORREGIDA)-Cambio filtro de aire (default se auto complete un año despues de la fecha que indique seguimiento pero sea editable)
		
		-Nivel de combustible en la ficha tecnica debe tener doble input "Cant de Litros" y el actual de porcentaje(Si la ficha tecnica conoce el tamaño de tanque al ingresar la cantidad de litros auto complete el segundo input del porcentaje).
		Modificaciones del item anterior
		(CORREGIDA)-El Doble input va en el formulario de la visita tecnica. El tecnico puede introducir "Cantidad de combustible" o "Porcentaje"(Como esta actualmente) En la ficha tecnica debe tener el campo "Tamaño del tanque" que indique numerica cuantos litros contiene y Porcentaje de Combustible. Si el tecnico en el formulario completa la cantidad de litros que tiene el tanque quiero que se auto complete su nivel de porcentaje siempre que se conozca el tamaño del tanque


		(CORREGIDA)-Los botones de guardar borrador o finalizar reporte moverlos al final del formulario
		(CORREGIDA)-Agregar un option al select del funcionamieto del precalentador "No tiene" Y si el estado es distinto de OK el valor de medicion ya no es obligatorio
		
		(CORREGIDA)-Hay un pequeño bug al iniciar sesión debo presionar dos veces el boton de iniciar(Sigue haciendo el mismo bug)
		
		(CORREGIDA)-El supervisor puede editar o eliminar una visita sin reporte del tecnico
		(CORREGIDA)-Agregar un boton "Eliminar" en el detalle de equipo (invetario-equipo-editar) 