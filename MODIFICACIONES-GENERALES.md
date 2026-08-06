# MODIFICACIONES.md

	<!-- (CORREGIDA)-agregar cant de aceite a la ficha tecnica del equipo (Justo despues de cant de combustible)
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
		
		(CORREGIDA)-Nivel de combustible en la ficha tecnica debe tener doble input "Cant de Litros" y el actual de porcentaje(Si la ficha tecnica conoce el tamaño de tanque al ingresar la cantidad de litros auto complete el segundo input del porcentaje).
		Modificaciones del item anterior
		(CORREGIDA)-El Doble input va en el formulario de la visita tecnica. El tecnico puede introducir "Cantidad de combustible" o "Porcentaje"(Como esta actualmente) En la ficha tecnica debe tener el campo "Tamaño del tanque" que indique numerica cuantos litros contiene y Porcentaje de Combustible. Si el tecnico en el formulario completa la cantidad de litros que tiene el tanque quiero que se auto complete su nivel de porcentaje siempre que se conozca el tamaño del tanque


		(CORREGIDA)-Los botones de guardar borrador o finalizar reporte moverlos al final del formulario
		(CORREGIDA)-Agregar un option al select del funcionamieto del precalentador "No tiene" Y si el estado es distinto de OK el valor de medicion ya no es obligatorio
		
		(CORREGIDA)-Hay un pequeño bug al iniciar sesión debo presionar dos veces el boton de iniciar(Sigue haciendo el mismo bug)
		
		(CORREGIDA)-El supervisor puede editar o eliminar una visita sin reporte del tecnico
		(CORREGIDA)-Agregar un boton "Eliminar" en el detalle de equipo (invetario-equipo-editar)  -->

		Realiza esta nueva ronda de modificaiones:

			(CORREGIDA)-Incluir en la pantalla de panel de control alertas de combustible cuando esté este al 30% o menos.
			(CORREGIDA)-En la vista mensual o semanal quita relevancia a los sábados y domingo ya que esos días no se programas visitas pero no los elimines del caledario solo hazlos mas pequeños y reparte ese espacio en los días hábiles
			-Agregar una funcion para replicar una planificacion para el mes siguiente. Asegurando que siempre se asignen visitas a los dias habiles.
			(CORREGIDA)-Ajusta los estilos del cuadro de referencia de colores del calendario, agranda un poco el tamaño del circle de referencia.
			(CORREGIDA)-Agrega en el asaide debajo de "Equipos" un vista de "Clientes" que contenga:
				-Listado de clientes con su ficha de datos
				-Equipos(que al hacer click abra el mismo detalle que usa "Equipos")
			-En el listado de mi plan mensual que se agrupen por hospitales(puede ser una vista similar a la que tambien utiliza "Equipos)

			Correcciones:
				(CORREGIDA)1-En la funcion replicar planificación que aplique la siguiente logica, sin alterar el orden se orgnicen desde el primer dia habil en adelante salteando sabados y domingos
				(CORREGIDA)2-El listado de plan mensual se agrupe por hospital pero se ordene por fecha desde la mas proxima

		Una funcion mas.
			El titular "Hojas de Ruta sin Asignar" quiero sin modificar ese listado tambien sea un boton que me lleve a una nueva vista, puede seguir siendo en formato de pop up para que el usuario tenga la opcion de seleccionar muchas visitas y asignarles tecnicos y vehiculos

		correccion
			-agrega un over a hojas de ruta sin asignar
			- correccion estetica:
				-las lista de tecnicos solo muestre hasta 5 y luego tenga scroll
				-vehiculos siga siedo menu desplegable
				-hoja de rutas ocupe el resto del espacio disponible