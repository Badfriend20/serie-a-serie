# Serie a serie

PWA de seguimiento de series para cualquier persona. Cada visitante configura sus ejercicios y rutinas en su propio navegador. El enlace comparte la aplicación; no comparte los datos.

## Estado

MVP funcional: pestaña Entrenar dedicada al seguimiento, pestaña Rutinas para crear y editar, catálogo reutilizable con creación directa desde una rutina, varias rutinas seleccionables, una rutina desplegada a la vez, porcentaje y barra de avance, estado de completado, número de series por ejercicio, reordenación, notas breves por ejercicio, marcas por serie, un peso opcional por ejercicio en kg/lb, temporizador de descanso opcional con tiempo configurable por ejercicio, reinicio manual de marcas o pesos, tema claro/oscuro/sistema y acento configurable, respaldo JSON, instalación PWA y trabajo sin conexión después de la primera visita.

Consulta [docs/PRODUCTO.md](docs/PRODUCTO.md) para alcance, modelo, decisiones y siguientes ideas.

## Desarrollo

Requiere Node 22 o superior compatible con Vite 8.

```bash
npm ci
npm run dev
npm run build
npm run preview
```

El build incluye TypeScript y genera `dist/`. Para probar la instalación y el uso sin conexión, usa `npm run preview` en localhost, carga la página una vez y luego activa modo sin conexión en las herramientas del navegador. El service worker no se usa durante `npm run dev`.

El manifiesto identifica la PWA con `id`, `start_url` y `scope` en la ruta del repositorio. Backlog Quest usa otra ruta en el mismo dominio y tiene un alcance distinto. Sin embargo, [un fallo reportado en Chromium](https://issues.chromium.org/issues/572287931) puede impedir instalar una segunda PWA de ese dominio en Android: Chrome afirma que ya está instalada y el botón para abrirla falla, incluso con IDs y alcances distintos. Como alternativa temporal, elige **Crear acceso directo** en el menú de Chrome; el acceso se abrirá en Chrome. Para instalaciones completamente independientes se necesitan orígenes distintos, por ejemplo otro dominio o subdominio.

Al compartir origen, ambas apps comparten el espacio de almacenamiento del sitio aunque usen claves locales diferentes. **No borres los datos del sitio para intentar reparar la instalación**: perderías los datos locales de ambas. Exporta los respaldos antes de una futura migración de dominio, porque el nuevo origen no puede leer el almacenamiento del anterior.

## GitHub Pages

1. Crea un repositorio público vacío, por ejemplo `serie-a-serie`, y sube estos archivos a la rama `main`.
2. En **Settings → Pages → Build and deployment**, elige **GitHub Actions** como origen.
3. El workflow `.github/workflows/pages.yml` ejecuta `npm ci`, valida el build y publica `dist/` en cada push a `main`.
4. La ruta base se calcula a partir de `GITHUB_REPOSITORY`, así que funciona aunque cambies el nombre del repositorio. La URL será `https://USUARIO.github.io/REPOSITORIO/`.

```bash
git init -b main
git add .
git commit -m "Initial PWA"
git remote add origin https://github.com/USUARIO/REPOSITORIO.git
git push -u origin main
```

No se necesita backend, secretos ni cuenta. La URL de Pages debe ser pública para compartirla. GitHub Pages puede requerir activar Actions como origen antes del primer despliegue.

## Datos

`localStorage` conserva los datos bajo `serie-a-serie:v1`. Cada ejercicio de una rutina tiene una nota, un descanso opcional y un peso opcional guardado internamente en kg; el campo de peso se puede editar en kg o lb con conversión automática. Los nombres anteriores con « · » muestran el texto posterior debajo del título sin modificar el dato original. El descanso predeterminado es de 90 s. La preferencia de activar el temporizador y la unidad de peso se recuerdan entre visitas; la cuenta activa se recupera al recargar su rutina. Al actualizar desde la versión con peso por serie, se conserva el último peso no vacío de cada ejercicio. Borrar datos del sitio, usar otro navegador o dispositivo, o navegar en modo privado cambia el conjunto de rutinas disponible. El respaldo JSON versión 2 exporta rutinas, marcas, pesos, tema, acento, temporizador y unidad de peso. La importación muestra una vista previa y permite conservar pesos y apariencia actuales para los ejercicios coincidentes. Los respaldos versión 1 se aceptan, pero pueden traer pesos vacíos o ajustes predeterminados; sus preferencias de temporizador y unidad no están incluidas. No se envían rutinas a un servidor.

## Estructura

```text
src/
  components/
    atoms/       Button, TextField, Surface, ProgressBar, ToggleSwitch
    molecules/   SetTracker, ExerciseWeight, RoutineEntrySettings, RestTimerControls
    organisms/   RoutineCard, RoutinePicker, RoutineEditor
    layout/      AppShell
  pages/         TrainingPage, RoutinesPage, ExercisesPage, SettingsPage
  model.ts       Tipos y validación de respaldos
  store.ts       Acciones y persistencia local
  theme.ts       Tokens y estilos globales
  config.ts      Límites, tiempos y factores de conversión
  useRestTimer.ts Cuenta de descanso y recuperación tras recarga
```

Cada archivo de interfaz exporta un componente. Las variaciones visuales usan propiedades transitorias de styled-components y un mismo componente base. Las páginas organizan la composición; el estado y las acciones se consultan cerca de donde se usan.
