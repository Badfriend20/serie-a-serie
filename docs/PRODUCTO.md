# Diseño conceptual — Serie a serie

## Propósito

Marcar series de entrenamiento sin fricción. La app no prescribe ejercicio, peso, repeticiones, descansos, calorías ni progreso físico. La persona puede anotar indicaciones, registrar opcionalmente un peso y elegir un descanso por ejercicio de una rutina. El enlace es compartible y cada navegador empieza con un espacio vacío.

## Vocabulario

| Elemento | Qué representa |
| --- | --- |
| Ejercicio | Nombre reutilizable en el catálogo personal. |
| Rutina | Conjunto ordenado de ejercicios; admite tantos conjuntos como se necesiten. |
| Entrada | Uso de un ejercicio en una rutina, con su propio número de series. Se puede repetir el mismo ejercicio. |
| Marca | Estado completado o pendiente de una serie de una entrada. |
| Peso | Dato opcional de una entrada de ejercicio, guardado en kg y editable en kg o lb. |
| Nota | Texto opcional bajo el título de una entrada de ejercicio. |
| Descanso | Tiempo opcional por ejercicio; se aplica tras marcar cada serie, incluida la última antes del siguiente ejercicio. |

## Flujo principal

1. Crear una rutina en la pestaña Rutinas y agregar ejercicios existentes o crearlos allí mismo; cada entrada comienza con tres series ajustables entre una y veinte.
2. En Entrenar, elegir una rutina, marcar series y, opcionalmente, registrar un peso. El peso se edita en una unidad y se muestra convertido en la otra. Un interruptor habilita o deshabilita el temporizador de descanso; el tiempo predeterminado es 90 s y cada ejercicio puede definir otro.
3. Cerrar y abrir la app conserva las marcas, pesos, notas y selección de rutina. Para otra sesión, reiniciar sólo las marcas o sólo los pesos de la rutina mediante confirmación.

La app no reinicia automáticamente al cambiar de día: un entrenamiento puede cruzar la medianoche y la persona controla cuándo termina. No hay historial de sesiones en el MVP.

## Gestión y reglas

- Se pueden crear, renombrar y eliminar ejercicios y rutinas; los ejercicios se pueden reordenar dentro de cada rutina.
- Renombrar un ejercicio actualiza su nombre en todas sus entradas. Eliminarlo borra sus entradas y marcas, previa confirmación.
- Eliminar una rutina borra solo sus entradas y marcas. El catálogo y otras rutinas siguen disponibles.
- Cambiar el número de series conserva las marcas que caben en el nuevo número; el peso del ejercicio permanece igual. Si se reduce, las marcas sobrantes se descartan.
- El peso acepta cero o más, hasta 10 000 kg. Está vacío por defecto; las libras usan el factor exacto 0.45359237 kg/lb y la presentación se redondea a dos decimales, sin redondear el valor guardado.
- Las notas admiten hasta 160 caracteres. El descanso por ejercicio admite de 10 a 600 s; si está vacío se usan 90 s. El temporizador sólo arranca al marcar una serie pendiente y no se inicia tras completar toda la rutina.
- Los nombres existentes que usan « · » muestran el texto posterior como detalle bajo el título durante el entrenamiento; se preserva el nombre completo en el catálogo y en los respaldos.
- Si una versión anterior tenía pesos distintos por serie, se conserva el último valor no vacío de la lista al migrar la entrada.
- Se permiten nombres repetidos y el mismo ejercicio varias veces en una rutina, pues cada entrada tiene identidad independiente.
- Los nombres tienen límite de 80 caracteres. Cada rutina puede tener hasta 500 entradas y cada respaldo hasta 100 rutinas y 500 ejercicios.

## Interfaz

Cuatro secciones: Entrenar, Rutinas, Ejercicios y Ajustes. Entrenar muestra un selector que sale de la vista al desplazarse; el título, porcentaje, barra de progreso y temporizador de la rutina activa permanecen visibles. Solo una rutina se despliega a la vez y tocarla de nuevo la pliega. Bajo cada nombre aparece una nota opcional en texto pequeño y, si está configurado, el descanso. El peso se pliega bajo las series; cerrado muestra kg y lb, abierto ofrece un campo editable y un interruptor de unidades. El temporizador es opcional y muestra la cuenta atrás o el descanso terminado en el encabezado. Rutinas concentra creación, edición, orden, notas, descanso y creación directa de ejercicios; Ejercicios mantiene el catálogo. Vista móvil prioritaria, controles táctiles, estados visibles para cada serie, etiquetas accesibles, navegación por teclado y confirmación antes de borrar o reiniciar. Una rutina vacía explica cómo comenzar.

Tema: sistema, claro u oscuro; acento coral, menta o violeta. El fondo de toda la pantalla cambia con el modo y el acento, y los textos, bordes, controles y estados de completado mantienen contraste legible. Los colores y estados parten de tokens en `ThemeProvider`; `Button` usa variantes y tamaño mediante propiedades transitorias, `SetTracker` usa una propiedad booleana para el estado. No se crean componentes nuevos para variaciones menores.

## Arquitectura

- React 19 + TypeScript + Vite + styled-components + Zustand.
- Atomic design dentro de `components/{atoms,molecules,organisms,layout}`; `pages` aparte. Sin carpetas `features`.
- Un componente exportado por archivo de interfaz y una sola salida JSX por componente. Las variaciones se expresan con props y composición. Las instancias internas de `styled` viven junto al componente, sin exportarse como componentes públicos.
- Zustand guarda catálogo, rutinas, marcas, pesos, tema y acento; `uiState.ts` conserva temporizador, unidad preferida y navegación. Las tarjetas y controles leen selectores y acciones directamente; las páginas pasan solamente identificadores estructurales.
- Los colores, radios, espacios y sombras compartidos salen de `theme.ts` mediante `ThemeProvider`; límites y conversiones reutilizables salen de `config.ts`.
- IDs UUID independientes del orden y del nombre. Una marca se indexa por ID de entrada y posición de serie.
- `localStorage` para un volumen pequeño de datos, con versión persistida 2 y la misma clave. El respaldo JSON lleva `version: 2` e incluye `data` (rutinas, marcas, pesos, modo y acento) y `settings` (temporizador y unidad de peso). Se aceptan respaldos versión 1, donde `weightsKg` puede estar ausente o contener arreglos por serie. Se valida y se muestra una vista previa antes de reemplazar el estado; la persona puede conservar pesos actuales de entradas coincidentes y apariencia actual. Los respaldos antiguos no pueden recuperar valores que nunca incluyeron. No hay datos iniciales personales.
- Sin router: las secciones son pestañas dentro de una página, lo que evita rutas profundas y reglas especiales de Pages.

## PWA y publicación

Manifest con alcance y ruta base del repositorio, iconos 192/512, service worker que precachea la aplicación. Instalación y uso sin conexión tras una primera carga correcta. Se muestra un aviso cuando hay una actualización disponible para recargar de forma consciente. GitHub Actions compila y publica en GitHub Pages. En local la base es `/`; en Actions se deriva de `GITHUB_REPOSITORY`.

## Privacidad y límites

No hay cuenta, backend, analítica ni sincronización. Compartir el enlace no comparte rutinas. El respaldo JSON sí contiene la configuración y las marcas, así que compartir ese archivo es una acción distinta. `localStorage` depende del origen, navegador y dispositivo: el modo privado y la limpieza de datos pueden perder todo. Una actualización del código no debe borrar la clave persistida; si se cambia el esquema se necesita migración explícita.

## Criterios de aceptación

- Una instalación nueva abre sin rutinas personales.
- El selector de rutinas se desplaza con la página y el resumen de la rutina activa queda fijo; plegar una rutina no borra marcas y cambiar de rutina muestra solo la elegida.
- El porcentaje es cero para rutinas vacías; el mensaje de completado aparece únicamente cuando todas sus series están marcadas.
- Al crear dos rutinas con el mismo ejercicio, sus cantidades de series y marcas son independientes.
- Recargar y cerrar/abrir conserva marcas, tema, pestaña y rutina activa.
- Reiniciar una rutina no cambia la otra.
- Crear un ejercicio desde una rutina lo añade al catálogo y a esa rutina en una sola acción.
- Escribir 100 lb muestra 45.36 kg; escribir 20 kg muestra 44.09 lb. Vaciar el campo deja el ejercicio sin peso, y el peso no altera el porcentaje completado.
- Una nota aparece bajo el título sin afectar el progreso; notas y descansos sobreviven al respaldo y los respaldos anteriores siguen importándose.
- El temporizador apagado no arranca; encendido usa el descanso del ejercicio o 90 s y puede omitirse. Su interruptor conserva la elección al cambiar de rutina, pestaña o recargar; una cuenta activa se restaura al volver a su rutina.
- Eliminar un ejercicio referenciado no deja entradas huérfanas.
- Exportar e importar en un navegador limpio reconstruye catálogo, orden, rutinas, marcas, pesos, tema, acento, preferencia de temporizador y unidad de peso.
- Una instalación cargada una vez abre sin conexión en la ruta del repositorio y puede marcar series.
- El build de Actions usa una ruta base que coincide con el nombre real del repositorio.

## Ideas para una versión siguiente, sujetas a decisión

- Historial opcional de sesiones con fecha, sin alterar el flujo rápido de marcas.
- Duplicar rutinas y exportar una plantilla sin marcas para facilitar compartir configuraciones.
- Repeticiones opcionales por serie si se decide ampliar el objetivo.
- Sustituir diálogos nativos de renombrado y confirmación por controles accesibles integrados, si el uso en móvil lo justifica.
