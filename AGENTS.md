# Reglas del proyecto

- Mantén React 19, TypeScript, styled-components y la estructura `components/{atoms,molecules,organisms,layout}` más `pages`.
- Cada archivo de interfaz exporta un único componente. Cada componente conserva una sola salida JSX; usa propiedades y composición para variantes visuales. Evita duplicar componentes por cambios pequeños.
- Usa las capacidades de styled-components: tokens de tema, interpolaciones, variantes con props transitorias, `.attrs` cuando convenga y composición. No lo reduzcas a clases con CSS genérico.
- Centraliza colores y tokens visuales en `theme.ts` para `ThemeProvider`; coloca límites, conversiones y tiempos reutilizables en `config.ts`.
- Mantén la lógica cerca del componente responsable; usa selectores de Zustand para estado compartido y evita pasar callbacks por muchas capas.
- No añadas datos personales, cuenta, sincronización o histórico sin cambiar la especificación.
- Conserva la capacidad de usar la app sin conexión y el `base` de GitHub Pages. Valida `npm run build` antes de publicar.
