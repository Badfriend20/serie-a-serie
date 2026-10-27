# Serie a serie

PWA de seguimiento de series para cualquier persona. Cada visitante configura sus ejercicios y rutinas en su propio navegador. El enlace comparte la aplicación; no comparte los datos.

## Estado

MVP funcional: catálogo de ejercicios, varias rutinas, número de series por ejercicio, reordenación, marcas persistentes, reinicio manual, tema claro/oscuro/sistema y acento configurable, respaldo JSON, instalación PWA y trabajo sin conexión después de la primera visita.

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

`localStorage` conserva los datos bajo `serie-a-serie:v1`. Borrar datos del sitio, usar otro navegador o dispositivo, o navegar en modo privado cambia el conjunto de rutinas disponible. Exporta un respaldo desde Ajustes antes de borrar datos; importarlo reemplaza todos los datos actuales tras una confirmación. No se envían rutinas a un servidor.

## Estructura

```text
src/
  components/
    atoms/       Button, TextField, Surface
    molecules/   SetTracker
    organisms/   RoutineCard
    layout/      AppShell
  pages/         RoutinesPage, ExercisesPage, SettingsPage
  model.ts       Tipos y validación de respaldos
  store.ts       Acciones y persistencia local
  theme.ts       Tokens y estilos globales
```

Cada archivo de interfaz exporta un componente. Las variaciones visuales usan propiedades transitorias de styled-components y un mismo componente base. Las páginas organizan la composición; el estado y las acciones se consultan cerca de donde se usan.
