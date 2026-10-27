# Serie a serie

PWA de seguimiento de series para cualquier persona. Cada visitante configura sus ejercicios y rutinas en su propio navegador. El enlace comparte la aplicación; no comparte los datos.

## Estado

MVP funcional: pestaña Entrenar dedicada al seguimiento, pestaña Rutinas para crear y editar, catálogo reutilizable con creación directa desde una rutina, varias rutinas seleccionables, una rutina desplegada a la vez, porcentaje y barra de avance, estado de completado, número de series por ejercicio, reordenación, marcas por serie y un peso opcional por ejercicio en kg/lb, reinicio manual, tema claro/oscuro/sistema y acento configurable, respaldo JSON, instalación PWA y trabajo sin conexión después de la primera visita.

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

El manifiesto identifica la PWA con `id`, `start_url` y `scope` en la ruta del repositorio. Backlog Quest usa otra ruta en el mismo dominio; cada app tiene un alcance distinto. Al compartir origen, ambas comparten el espacio de almacenamiento del sitio aunque usen claves locales diferentes. Si Android muestra una instalación anterior que no abre, conviene revisar primero la app o el acceso directo en el dispositivo; borrar todos los datos del sitio puede borrar las rutinas y también los datos de otras apps de ese origen. Exporta un respaldo antes de cualquier limpieza de datos.

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

`localStorage` conserva los datos bajo `serie-a-serie:v1`. Cada ejercicio de una rutina tiene un peso opcional guardado internamente en kg; sus dos campos convierten automáticamente entre kg y lb. Al actualizar desde la versión con peso por serie, se conserva el último peso no vacío de cada ejercicio. Borrar datos del sitio, usar otro navegador o dispositivo, o navegar en modo privado cambia el conjunto de rutinas disponible. Exporta un respaldo desde Ajustes antes de borrar datos; importarlo reemplaza todos los datos actuales tras una confirmación. Se aceptan respaldos anteriores sin pesos o con pesos por serie. No se envían rutinas a un servidor.

## Estructura

```text
src/
  components/
    atoms/       Button, TextField, Surface, ProgressBar
    molecules/   SetTracker, ExerciseWeight
    organisms/   RoutineCard, RoutinePicker, RoutineEditor
    layout/      AppShell
  pages/         TrainingPage, RoutinesPage, ExercisesPage, SettingsPage
  model.ts       Tipos y validación de respaldos
  store.ts       Acciones y persistencia local
  theme.ts       Tokens y estilos globales
```

Cada archivo de interfaz exporta un componente. Las variaciones visuales usan propiedades transitorias de styled-components y un mismo componente base. Las páginas organizan la composición; el estado y las acciones se consultan cerca de donde se usan.
