import catalogJson from "@/data/roadmaps/catalog.json";
import flightJson from "@/data/roadmaps/automatizacion-de-vuelos.json";
import erpJson from "@/data/roadmaps/erp-minimo-integrado.json";
import imagesJson from "@/data/roadmaps/automatizacion-de-imagenes.json";
import financeJson from "@/data/roadmaps/finanzas-y-facturacion.json";
import complianceJson from "@/data/roadmaps/cumplimiento-y-gestion-regulatoria.json";
import analyticsJson from "@/data/roadmaps/analitica-operativa-y-ejecutiva.json";
import peopleJson from "@/data/roadmaps/recursos-humanos-y-gestion-de-capacidad.json";
import aiJson from "@/data/roadmaps/capa-de-inteligencia-artificial-avanzada.json";
import type { RoadmapCatalog, RoadmapProject } from "@/types/roadmap";
import { roadmapPortfolioSchema } from "./roadmap-schema";

const parsed = roadmapPortfolioSchema.parse({
  catalog: catalogJson,
  projects: [flightJson, erpJson, imagesJson, financeJson, complianceJson, analyticsJson, peopleJson, aiJson],
}) as { catalog: RoadmapCatalog; projects: RoadmapProject[] };

const projects = [...parsed.projects].sort((a, b) => a.order - b.order);

export function getRoadmapCatalog() {
  return parsed.catalog;
}

export function getRoadmapProjects() {
  return projects;
}

export function getRoadmapBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getRoadmapStaticParams() {
  return projects.map((project) => ({ projectSlug: project.slug }));
}

export function getRoadmapProjectNavigation(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index < 0) return { previous: undefined, next: undefined, index: -1, total: projects.length };
  return { previous: projects[index - 1], next: projects[index + 1], index, total: projects.length };
}
