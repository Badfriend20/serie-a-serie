# Diseño conceptual — Serie a serie

## Propósito

Marcar series de entrenamiento sin fricción. La app no prescribe ejercicio, peso, repeticiones, descansos, calorías ni progreso físico. La persona elige qué registrar. El enlace es compartible y cada navegador empieza con un espacio vacío.

## Vocabulario

| Elemento | Qué representa |
| --- | --- |
| Ejercicio | Nombre reutilizable en el catálogo personal. |
| Rutina | Conjunto ordenado de ejercicios; admite tantos conjuntos como se necesiten. |
| Entrada | Uso de un ejercicio en una rutina, con su propio número de series. Se puede repetir el mismo ejercicio. |
| Marca | Estado completado o pendiente de una serie de una entrada. |

## Flujo principal

1. Crear ejercicios en el catálogo.
2. Crear una rutina y agregar ejercicios del catálogo, con tres series iniciales ajustables entre una y veinte.
3. Marcar o desmarcar cada serie con un toque. Cerrar y abrir la app conserva las marcas.
4. Al iniciar otra sesión, reiniciar las marcas de esa rutina mediante confirmación. Las demás rutinas conservan sus marcas.

La app no reinicia automáticamente al cambiar de día: un entrenamiento puede cruzar la medianoche y la persona controla cuándo termina. No hay historial de sesiones en el MVP.

## Gestión y reglas

- Se pueden crear, renombrar y eliminar ejercicios y rutinas; los ejercicios se pueden reordenar dentro de cada rutina.
- Renombrar un ejercicio actualiza su nombre en todas sus entradas. Eliminarlo borra sus entradas y marcas, previa confirmación.
- Eliminar una rutina borra solo sus entradas y marcas. El catálogo y otras rutinas siguen disponibles.
- Cambiar el número de series conserva las marcas que caben en el nuevo número; si se reduce, las marcas sobrantes se descartan.
- Se permiten nombres repetidos y el mismo ejercicio varias veces en una rutina, pues cada entrada tiene identidad independiente.
- Los nombres tienen límite de 80 caracteres. Cada rutina puede tener hasta 500 entradas y cada respaldo hasta 100 rutinas y 500 ejercicios.

## Interfaz

Tres secciones: Rutinas, Ejercicios y Ajustes. Vista móvil prioritaria, controles táctiles de 44 px aproximadamente, estados visibles para cada serie, etiquetas accesibles, navegación por teclado y confirmación antes de borrar o reiniciar. La edición de cada rutina se abre en su tarjeta. Una rutina vacía explica cómo comenzar.

Tema: sistema, claro u oscuro; acento coral, menta o violeta. Los colores y estados parten de tokens en `ThemeProvider`; `Button` usa variantes y tamaño mediante propiedades transitorias, `SetTracker` usa una propiedad booleana para el estado. No se crean componentes nuevos para variaciones menores.

## Arquitectura

- React 19 + TypeScript + Vite + styled-components + Zustand.
- Atomic design dentro de `components/{atoms,molecules,organisms,layout}`; `pages` aparte. Sin carpetas `features`.
- Un componente exportado por archivo de interfaz y una sola salida JSX por componente. Las variaciones se expresan con props y composición. Las instancias internas de `styled` viven junto al componente, sin exportarse como componentes públicos.
- Zustand guarda catálogo, rutinas, marcas y preferencias. Las tarjetas y controles leen selectores y acciones directamente; las páginas pasan solamente identificadores estructurales.
- IDs UUID independientes del orden y del nombre. Una marca se indexa por ID de entrada y posición de serie.
- `localStorage` para un volumen pequeño de datos, con versión persistida. El respaldo JSON lleva `version: 1` y se valida antes de reemplazar el estado. No hay datos iniciales personales.
- Sin router: las secciones son pestañas dentro de una página, lo que evita rutas profundas y reglas especiales de Pages.

## PWA y publicación

Manifest con alcance y ruta base del repositorio, iconos 192/512, service worker que precachea la aplicación. Instalación y uso sin conexión tras una primera carga correcta. Se muestra un aviso cuando hay una actualización disponible para recargar de forma consciente. GitHub Actions compila y publica en GitHub Pages. En local la base es `/`; en Actions se deriva de `GITHUB_REPOSITORY`.

## Privacidad y límites

No hay cuenta, backend, analítica ni sincronización. Compartir el enlace no comparte rutinas. El respaldo JSON sí contiene la configuración y las marcas, así que compartir ese archivo es una acción distinta. `localStorage` depende del origen, navegador y dispositivo: el modo privado y la limpieza de datos pueden perder todo. Una actualización del código no debe borrar la clave persistida; si se cambia el esquema se necesita migración explícita.

## Criterios de aceptación

- Una instalación nueva abre sin rutinas personales.
- Al crear dos rutinas con el mismo ejercicio, sus cantidades de series y marcas son independientes.
- Recargar y cerrar/abrir conserva marcas y tema.
- Reiniciar una rutina no cambia la otra.
- Eliminar un ejercicio referenciado no deja entradas huérfanas.
- Exportar e importar en un navegador limpio reconstruye catálogo, orden, rutinas, marcas y tema.
- Una instalación cargada una vez abre sin conexión en la ruta del repositorio y puede marcar series.
- El build de Actions usa una ruta base que coincide con el nombre real del repositorio.

## Ideas para una versión siguiente, sujetas a decisión

- Historial opcional de sesiones con fecha, sin alterar el flujo rápido de marcas.
- Duplicar rutinas y exportar una plantilla sin marcas para facilitar compartir configuraciones.
- Opcionalmente peso/repeticiones por serie si se decide ampliar el objetivo; no se incluyen en este MVP.
- Sustituir diálogos nativos de renombrado y confirmación por controles accesibles integrados, si el uso en móvil lo justifica.
