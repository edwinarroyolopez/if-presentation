# IF Presentation

Presentación pública y estática de InflightOS para evaluación técnica. No tiene login, autenticación, sesión, permisos, backend, API routes ni llamadas remotas.

## Rutas

- `/`
- `/architecture-review/`
- `/roadmap/`
- `/systems-integration/`
- `/data-modeling/`
- `/ai-strategy/`
- `/executive-scenario/`
- `/design-system/` es control interno y no forma parte de las seis partes.

## Arquitectura

- Next.js con App Router y `output: "export"`.
- Contenido de producto en `src/data/*.json`.
- Validación local con Zod en `src/lib/content`.
- Componentes reutilizables en `src/components` y módulos por página en `src/modules`.
- Diagramas construidos con HTML/CSS/React, sin librerías pesadas.

## Comandos

- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run test:e2e`
- `npm run test:visual`

## Netlify

El build genera `out/`. Netlify usa:

```toml
[build]
  command = "npm run build"
  publish = "out"
```

## Actualizar Contenido

Edita el JSON correspondiente en `src/data/` y ejecuta `npm run test`. Para agregar una nueva sección dentro de una página, amplía el JSON existente y el módulo correspondiente sin romper el contrato de `src/lib/content/schema.ts`.

Para agregar una nueva parte principal, actualiza `navigation.json`, el schema, las pruebas unitarias y una nueva ruta. No agregues una octava parte para la evaluación actual.
