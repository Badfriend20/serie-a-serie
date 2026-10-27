# Diseño conceptual — Serie a serie

## Propósito

Marcar series de entrenamiento sin fricción. La app no prescribe ejercicio, peso, repeticiones, descansos, calorías ni progreso físico. La persona puede registrar opcionalmente un peso por ejercicio de una rutina. El enlace es compartible y cada navegador empieza con un espacio vacío.

## Vocabulario

| Elemento | Qué representa |
| --- | --- |
| Ejercicio | Nombre reutilizable en el catálogo personal. |
| Rutina | Conjunto ordenado de ejercicios; admite tantos conjuntos como se necesiten. |
| Entrada | Uso de un ejercicio en una rutina, con su propio número de series. Se puede repetir el mismo ejercicio. |
| Marca | Estado completado o pendiente de una serie de una entrada. |
| Peso | Dato opcional de una entrada de ejercicio, guardado en kg y editable en kg o lb. |

## Flujo principal

1. Crear una rutina en la pestaña Rutinas y agregar ejercicios existentes o crearlos allí mismo; cada entrada comienza con tres series ajustables entre una y veinte.
2. En Entrenar, elegir una rutina del selector visible, desplegarla o plegarla, marcar series y, opcionalmente, escribir un peso para el ejercicio en kg o lb. El otro campo se calcula automáticamente.
3. Cerrar y abrir la app conserva las marcas y pesos. Para otra sesión, reiniciar marcas y pesos de la rutina mediante confirmación; las demás conservan sus registros.

La app no reinicia automáticamente al cambiar de día: un entrenamiento puede cruzar la medianoche y la persona controla cuándo termina. No hay historial de sesiones en el MVP.

## Gestión y reglas

- Se pueden crear, renombrar y eliminar ejercicios y rutinas; los ejercicios se pueden reordenar dentro de cada rutina.
- Renombrar un ejercicio actualiza su nombre en todas sus entradas. Eliminarlo borra sus entradas y marcas, previa confirmación.
- Eliminar una rutina borra solo sus entradas y marcas. El catálogo y otras rutinas siguen disponibles.
- Cambiar el número de series conserva las marcas que caben en el nuevo número; el peso del ejercicio permanece igual. Si se reduce, las marcas sobrantes se descartan.
- El peso acepta cero o más, hasta 10 000 kg. Está vacío por defecto; las libras usan el factor exacto 0.45359237 kg/lb y la presentación se redondea a dos decimales, sin redondear el valor guardado.
- Si una versión anterior tenía pesos distintos por serie, se conserva el último valor no vacío de la lista al migrar la entrada.
- Se permiten nombres repetidos y el mismo ejercicio varias veces en una rutina, pues cada entrada tiene identidad independiente.
- Los nombres tienen límite de 80 caracteres. Cada rutina puede tener hasta 500 entradas y cada respaldo hasta 100 rutinas y 500 ejercicios.

## Interfaz

Cuatro secciones: Entrenar, Rutinas, Ejercicios y Ajustes. Entrenar muestra el selector que permanece visible al desplazarse y tiene altura limitada si hay muchas; solo una rutina se despliega a la vez y tocarla de nuevo la pliega. El selector y el detalle muestran porcentaje y cantidad de series completadas. El detalle muestra barra de avance, marca por ejercicio y mensaje al completar toda la rutina. Los campos kg y lb aparecen una vez bajo el nombre de cada ejercicio; sus series muestran solamente el estado completado. Rutinas concentra creación, edición, orden y creación directa de ejercicios; Ejercicios mantiene el catálogo. Vista móvil prioritaria, controles táctiles, estados visibles para cada serie, etiquetas accesibles, navegación por teclado y confirmación antes de borrar o reiniciar. Una rutina vacía explica cómo comenzar.

Tema: sistema, claro u oscuro; acento coral, menta o violeta. El fondo de toda la pantalla cambia con el modo y el acento, y los textos, bordes, controles y estados de completado mantienen contraste legible. Los colores y estados parten de tokens en `ThemeProvider`; `Button` usa variantes y tamaño mediante propiedades transitorias, `SetTracker` usa una propiedad booleana para el estado. No se crean componentes nuevos para variaciones menores.

## Arquitectura

- React 19 + TypeScript + Vite + styled-components + Zustand.
- Atomic design dentro de `components/{atoms,molecules,organisms,layout}`; `pages` aparte. Sin carpetas `features`.
- Un componente exportado por archivo de interfaz y una sola salida JSX por componente. Las variaciones se expresan con props y composición. Las instancias internas de `styled` viven junto al componente, sin exportarse como componentes públicos.
- Zustand guarda catálogo, rutinas, marcas, pesos y preferencias. Las tarjetas y controles leen selectores y acciones directamente; las páginas pasan solamente identificadores estructurales.
- IDs UUID independientes del orden y del nombre. Una marca se indexa por ID de entrada y posición de serie.
- `localStorage` para un volumen pequeño de datos, con versión persistida 2 y la misma clave. El respaldo JSON lleva `version: 1`; el campo `weightsKg` admite un número por entrada, está ausente en respaldos antiguos y también acepta arreglos de la versión con pesos por serie. Se valida antes de reemplazar el estado. No hay datos iniciales personales.
- Sin router: las secciones son pestañas dentro de una página, lo que evita rutas profundas y reglas especiales de Pages.

## PWA y publicación

Manifest con alcance y ruta base del repositorio, iconos 192/512, service worker que precachea la aplicación. Instalación y uso sin conexión tras una primera carga correcta. Se muestra un aviso cuando hay una actualización disponible para recargar de forma consciente. GitHub Actions compila y publica en GitHub Pages. En local la base es `/`; en Actions se deriva de `GITHUB_REPOSITORY`.

## Privacidad y límites

No hay cuenta, backend, analítica ni sincronización. Compartir el enlace no comparte rutinas. El respaldo JSON sí contiene la configuración y las marcas, así que compartir ese archivo es una acción distinta. `localStorage` depende del origen, navegador y dispositivo: el modo privado y la limpieza de datos pueden perder todo. Una actualización del código no debe borrar la clave persistida; si se cambia el esquema se necesita migración explícita.

## Criterios de aceptación

- Una instalación nueva abre sin rutinas personales.
- El selector de rutinas queda accesible durante el desplazamiento; plegar una rutina no borra marcas y cambiar de rutina muestra solo la elegida.
- El porcentaje es cero para rutinas vacías; el mensaje de completado aparece únicamente cuando todas sus series están marcadas.
- Al crear dos rutinas con el mismo ejercicio, sus cantidades de series y marcas son independientes.
- Recargar y cerrar/abrir conserva marcas y tema.
- Reiniciar una rutina no cambia la otra.
- Crear un ejercicio desde una rutina lo añade al catálogo y a esa rutina en una sola acción.
- Escribir 100 lb muestra 45.36 kg; escribir 20 kg muestra 44.09 lb. Vaciar cualquiera de los campos deja el ejercicio sin peso, y el peso no altera el porcentaje completado.
- Eliminar un ejercicio referenciado no deja entradas huérfanas.
- Exportar e importar en un navegador limpio reconstruye catálogo, orden, rutinas, marcas y tema.
- Una instalación cargada una vez abre sin conexión en la ruta del repositorio y puede marcar series.
- El build de Actions usa una ruta base que coincide con el nombre real del repositorio.

## Ideas para una versión siguiente, sujetas a decisión

- Historial opcional de sesiones con fecha, sin alterar el flujo rápido de marcas.
- Duplicar rutinas y exportar una plantilla sin marcas para facilitar compartir configuraciones.
- Repeticiones opcionales por serie si se decide ampliar el objetivo.
- Sustituir diálogos nativos de renombrado y confirmación por controles accesibles integrados, si el uso en móvil lo justifica.
