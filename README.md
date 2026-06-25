# IF Presentation

Sitio publico y estatico de presentacion de InflightOS para evaluacion tecnica. No tiene login, autenticacion, sesiones, permisos, backend, API routes ni llamadas remotas: todo el contenido se empaqueta en el build estatico.

## Que Hace

- Explica la arquitectura, estrategia, integracion de sistemas, modelado de datos y roadmap de InflightOS.
- Presenta escenarios ejecutivos y narrativas de producto sin depender de servicios remotos.
- Renderiza roadmaps de portafolio y detalle por proyecto desde archivos JSON locales.
- Sirve como material de evaluacion y comunicacion, no como aplicacion operativa.

## Rutas

- `/`
- `/architecture-review/`
- `/roadmap/`
- `/roadmap/automatizacion-de-vuelos/`
- `/roadmap/erp-minimo-integrado/`
- `/roadmap/automatizacion-de-imagenes/`
- `/roadmap/finanzas-y-facturacion/`
- `/roadmap/cumplimiento-y-gestion-regulatoria/`
- `/roadmap/analitica-operativa-y-ejecutiva/`
- `/roadmap/recursos-humanos-y-gestion-de-capacidad/`
- `/roadmap/capa-de-inteligencia-artificial-avanzada/`
- `/systems-integration/`
- `/data-modeling/`
- `/ai-strategy/`
- `/executive-scenario/`
- `/design-system/` como control interno, fuera de las partes principales de evaluacion.

## Estructura Del Proyecto

```text
src/
  app/                         # Rutas estaticas con App Router
    architecture-review/
    roadmap/
    roadmap/[projectSlug]/
    systems-integration/
    data-modeling/
    ai-strategy/
    executive-scenario/
    design-system/
    sitemap.ts
    not-found.tsx
  components/                  # UI, shell, dialogos, primitivas de presentacion y roadmap
  data/                        # Contenido JSON local
    roadmaps/                  # Catalogo y detalle de roadmaps por proyecto
  lib/                         # Carga y validacion de contenido
    content/
    roadmaps/
  modules/                     # Modulos visuales por pagina
  types/                       # Tipos de presentacion y roadmap
public/                        # Assets estaticos
tests/                         # Playwright e2e y visual
netlify.toml                   # Configuracion de deploy estatico
```

## Arquitectura

- Next.js con App Router y `output: "export"`.
- Contenido de producto en `src/data/*.json`.
- Roadmaps de ocho proyectos en `src/data/roadmaps/*.json`.
- Registro estatico de roadmaps en `src/lib/roadmaps/roadmap-registry.ts`.
- Validacion local con Zod en `src/lib/content` y `src/lib/roadmaps`.
- Componentes reutilizables en `src/components` y modulos por pagina en `src/modules`.
- Diagramas construidos con HTML, CSS, React y SVG declarativo.
- Sin `fs` runtime ni `fetch("/data/...")`; el contenido queda incluido en el export.

## Patrones De Diseno

- Site estatico orientado a contenido: JSON local validado y renderizado por modulos de pagina.
- Shell de presentacion reutilizable para mantener navegacion y formato consistente.
- Separacion entre datos (`src/data`), validacion (`src/lib`) y visualizacion (`src/modules`/`src/components`).
- Componentes de roadmap especializados para portafolio, detalle, metricas, riesgos, principios y horizonte.
- Dialogos y subslides para revelar detalle sin sobrecargar la vista principal.
- Responsive design: en desktop se prioriza formato de presentacion 16:9; en mobile se pasa a lectura vertical.
- Contratos Zod para evitar que cambios de contenido rompan la UI silenciosamente.

## Tecnologias

- Next.js 16 con export estatico.
- React 19.
- TypeScript.
- Zod 4.
- CSS Modules y CSS global.
- `lucide-react` para iconografia.
- Vitest para pruebas unitarias.
- Playwright para e2e y visual regression.
- Netlify para publicacion del directorio `out/`.

## Experiencia De Presentacion

- Las partes principales usan un shell de presentacion con frame desktop 16:9 y navegacion lateral.
- En mobile, las rutas abandonan el 16:9 forzado y pasan a lectura vertical sin overflow horizontal.
- Los roadmaps son el visual principal de `/roadmap/` y de cada `/roadmap/[projectSlug]/`.
- El detalle secundario se consulta bajo demanda con dialogos accesibles, subslides o sheets mobile.
- La seleccion de horizonte en proyectos usa hashes estables y conserva navegacion local/back/forward.

## Comandos

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
npm run test:visual
```

## Netlify

El build genera `out/`. Netlify usa:

```toml
[build]
  command = "npm run build"
  publish = "out"
```

Para validar el export estatico localmente:

```bash
npm run build
python3 -m http.server 3200 --directory out
```

## Actualizar Contenido

- Para modificar una pagina principal, editar el JSON correspondiente en `src/data/` y ejecutar `npm run test`.
- Para agregar una seccion dentro de una pagina, ampliar el JSON existente y el modulo correspondiente sin romper `src/lib/content/schema.ts`.
- Para modificar roadmaps, editar `src/data/roadmaps/`, validar contra `src/lib/roadmaps/roadmap-schema.ts` y mantener importacion explicita en `src/lib/roadmaps/roadmap-registry.ts`.
- Para agregar una nueva parte principal, actualizar `navigation.json`, schemas, pruebas unitarias y ruta correspondiente.

## Relacion Con Otros Proyectos

- Documenta la vision y arquitectura de `if-erp`, `if-backend-main`, `if-connectors-web` e `if-connectors-backend`.
- Sus rutas y contenido son indexados por `graphify-if` para responder preguntas de roadmap, arquitectura y estrategia.
