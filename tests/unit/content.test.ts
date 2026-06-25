import { describe, expect, it } from "vitest";
import { getNavigationItems, getPresentationContent, getPreviousNext, getRouteProgress, isRouteActive } from "@/lib/content";
import { buildCatmullRomPath, computeRoadmapLayout } from "@/components/roadmap/roadmap-layout";
import { getRoadmapBySlug, getRoadmapProjectNavigation, getRoadmapProjects, getRoadmapStaticParams } from "@/lib/roadmaps/roadmap-registry";
import { integrationSchema } from "@/lib/content/schema";

describe("presentation content contract", () => {
  const content = getPresentationContent();

  it("validates navigation order and routes", () => {
    const items = getNavigationItems();
    expect(items.map((item) => item.part)).toEqual([0, 1, 2, 3, 4, 5, 6, 6]);
    expect(new Set(items.map((item) => item.route)).size).toBe(items.length);
    expect(items.map((item) => item.route)).toEqual(["/", "/architecture-review/", "/roadmap/", "/systems-integration/", "/data-modeling/", "/ai-strategy/", "/executive-scenario/", "/inflightos/"]);
    expect(items.at(-1)?.icon).toBe("brain");
  });

  it("calculates progress and previous/next", () => {
    expect(getRouteProgress("/").percent).toBe(0);
    expect(getRouteProgress("/roadmap/").percent).toBe(33);
    expect(getRouteProgress("/roadmap/automatizacion-de-vuelos/").item.route).toBe("/roadmap/");
    expect(isRouteActive("/roadmap/", "/roadmap/automatizacion-de-vuelos/")).toBe(true);
    expect(getPreviousNext("/architecture-review/").next?.route).toBe("/roadmap/");
    expect(getPreviousNext("/executive-scenario/").previous?.route).toBe("/ai-strategy/");
    expect(getPreviousNext("/executive-scenario/").next?.route).toBe("/inflightos/");
  });

  it("keeps required architecture counts", () => {
    expect(content.architecture.strengths).toHaveLength(5);
    expect(content.architecture.risks).toHaveLength(5);
    expect(content.architecture.deferred).toHaveLength(3);
  });

  it("keeps required integration blueprint content", () => {
    expect(content.integration.title).toBe("ERP como núcleo, conexiones por proyecto");
    expect(content.integration.thesis).toContain("credenciales revocables y scopes");
    expect(content.integration.core.title).toBe("InflightOS ERP");
    expect(content.integration.core.subtitle).toBe("Project Control Plane");
    expect(content.integration.core.description).toContain("No ejecuta vuelos ni procesa imágenes");
    expect(content.integration.connection.title).toBe("Project Connection");
    expect(content.integration.connection.subtitle).toBe("Project -> Project Connector Connection -> Connector");
    expect(content.integration.connection.formula).toEqual([
      "API key = identidad/autenticación de la conexión",
      "Permisos/scopes = operaciones autorizadas",
      "Project scope = límite funcional y de datos",
      "Auditoría = trazabilidad de cada acción",
    ]);
    expect(content.integration.domains.map((domain) => domain.id)).toEqual(["crm", "flight-ops", "flight-engine", "image-ops", "image-engine", "analytics", "ai-gateway"]);
    expect(content.integration.contracts.map((contract) => contract.id)).toEqual(["api", "event", "job", "object"]);
    expect(content.integration.dialogs.map((dialog) => dialog.id)).toEqual(["business-flow", "integration-contracts", "connections-permissions", "resilience-traceability"]);
    expect(content.integration.footer.secondary).toContain("Ningún sistema escribe directamente");
  });

  it("rejects invalid integration schema changes", () => {
    const missingProjectConnection = structuredClone(content.integration);
    missingProjectConnection.connection.title = "Connector Runtime";
    expect(integrationSchema.safeParse(missingProjectConnection).success).toBe(false);

    const collapsedAuthorization = structuredClone(content.integration);
    collapsedAuthorization.connection.formula[1] = "API key autoriza todas las operaciones";
    expect(integrationSchema.safeParse(collapsedAuthorization).success).toBe(false);

    const missingObjectStore = structuredClone(content.integration);
    missingObjectStore.contracts = missingObjectStore.contracts.filter((contract) => contract.id !== "object");
    expect(integrationSchema.safeParse(missingObjectStore).success).toBe(false);
  });

  it("keeps required data entities", () => {
    expect(content.dataModeling.entities.map((entity) => entity.name)).toEqual(["Client", "MPO", "Project", "Mission", "MediaBatch", "Deliverable", "Invoice", "UserRole"]);
  });

  it("keeps required AI and executive scenario content", () => {
    expect(content.aiStrategy.useNow.length).toBeGreaterThan(0);
    expect(content.aiStrategy.postpone.length).toBeGreaterThan(0);
    expect(content.executiveScenario.scenario).toContain("18 meses");
  });
});

describe("roadmap catalog contract", () => {
  const projects = getRoadmapProjects();
  const allowedIcons = new Set(["plane", "building", "images", "finance", "compliance", "analytics", "people", "ai"]);

  it("contains exactly eight ordered projects", () => {
    expect(projects).toHaveLength(8);
    expect(projects.map((project) => project.order)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(getRoadmapStaticParams()).toHaveLength(8);
  });

  it("keeps unique ids and slugs", () => {
    expect(new Set(projects.map((project) => project.id)).size).toBe(8);
    expect(new Set(projects.map((project) => project.slug)).size).toBe(8);
  });

  it("keeps source documents and allowed icons", () => {
    for (const project of projects) {
      expect(project.sourceDocument).toMatch(/^docs\/roadmaps\/p[1-8]-/);
      expect(allowedIcons.has(project.icon)).toBe(true);
    }
  });

  it("keeps mandatory project content", () => {
    for (const project of projects) {
      expect(project.strategicObjective.length).toBeGreaterThan(20);
      expect(project.northStarMetric.title.length).toBeGreaterThan(5);
      expect(project.horizons.map((horizon) => horizon.days)).toEqual([30, 90, 180, 365]);
      expect(project.executiveSummary).toHaveLength(4);
      expect(project.finalMessage.length).toBeGreaterThan(20);
      for (const horizon of project.horizons) {
        expect(horizon.result.length).toBeGreaterThan(10);
        expect(horizon.workstreams.length).toBeGreaterThan(0);
        expect(horizon.dependencies.length).toBeGreaterThan(0);
        expect(horizon.team.length).toBeGreaterThan(0);
        expect(horizon.gate.length).toBeGreaterThan(0);
      }
    }
  });

  it("calculates project navigation", () => {
    expect(getRoadmapProjectNavigation(projects[0].slug).previous).toBeUndefined();
    expect(getRoadmapProjectNavigation(projects[0].slug).next?.slug).toBe(projects[1].slug);
    expect(getRoadmapProjectNavigation(projects[7].slug).next).toBeUndefined();
    expect(getRoadmapBySlug(projects[3].slug)?.order).toBe(4);
  });

  it("represents every essential roadmap field in slide, modal or dialog detail", () => {
    const visibility = {
      strategicObjective: "modal:objective",
      northStarMetric: "modal:metrics",
      supportingMetrics: "modal:metrics",
      principles: "modal:principles",
      scope: "modal:scope",
      horizons: "slide:road",
      workstreams: "modal:horizon",
      activities: "modal:horizon",
      deliverables: "modal:horizon",
      dependencies: "modal:dependencies+horizon",
      team: "modal:team+horizon",
      gate: "slide:summary+modal:horizon",
      metrics: "slide:summary+modal:horizon",
      risks: "modal:risks+horizon",
      executiveSummary: "modal:executive",
      finalMessage: "modal:executive",
      sourceDocument: "footer+modal:executive",
    } as const;
    expect(Object.values(visibility).every(Boolean)).toBe(true);
    for (const project of projects) {
      expect(project.strategicObjective).toBeTruthy();
      expect(project.northStarMetric.title).toBeTruthy();
      expect(project.supportingMetrics.length).toBeGreaterThan(0);
      expect(project.principles.length).toBeGreaterThan(0);
      expect(project.scope.included.length).toBeGreaterThan(0);
      expect(project.scope.deferred.length).toBeGreaterThan(0);
      expect(project.dependencies.length).toBeGreaterThan(0);
      expect(project.team.length).toBeGreaterThan(0);
      expect(project.risks.length).toBeGreaterThan(0);
      expect(project.executiveSummary.length).toBe(4);
      for (const horizon of project.horizons) {
        expect(horizon.id).toMatch(/-(30|90|180|365)$/);
        expect(horizon.workstreams.length).toBeGreaterThan(0);
        for (const workstream of horizon.workstreams) {
          expect(workstream.activities.length).toBeGreaterThan(0);
          expect(workstream.deliverable).toBeTruthy();
        }
        expect(horizon.dependencies.length).toBeGreaterThan(0);
        expect(horizon.team.length).toBeGreaterThan(0);
        expect(horizon.gate.length).toBeGreaterThan(0);
        expect(horizon.metrics.length).toBeGreaterThan(0);
        expect(horizon.risks.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps the eight roadmap action labels unique", () => {
    const labels = ["Objetivo", "Métricas", "Alcance", "Principios", "Dependencias", "Equipo", "Riesgos", "Resumen"];
    expect(new Set(labels).size).toBe(8);
  });
});

describe("dynamic roadmap layout", () => {
  const items = Array.from({ length: 14 }, (_, index) => ({ id: `item-${index + 1}` }));

  it("handles zero and one item", () => {
    expect(computeRoadmapLayout({ items: [], width: 1000, density: "comfortable", variant: "portfolio" }).points).toHaveLength(0);
    const one = computeRoadmapLayout({ items: [items[0]], width: 1000, density: "comfortable", variant: "portfolio" });
    expect(one.points).toHaveLength(1);
    expect(one.path).toMatch(/^M /);
  });

  it("creates stable serpentine layouts", () => {
    const four = computeRoadmapLayout({ items: items.slice(0, 4), width: 1200, density: "comfortable", variant: "project" });
    const eight = computeRoadmapLayout({ items: items.slice(0, 8), width: 1280, density: "comfortable", variant: "portfolio" });
    const fourteen = computeRoadmapLayout({ items, width: 1280, density: "dense", variant: "portfolio" });
    expect(four.points).toHaveLength(4);
    expect(eight.rows).toBeGreaterThan(1);
    expect(fourteen.rows).toBeGreaterThan(3);
    expect(buildCatmullRomPath(eight.points)).toBe(eight.path);
    expect(computeRoadmapLayout({ items: items.slice(0, 8), width: 1280, density: "comfortable", variant: "portfolio" }).path).toBe(eight.path);
  });

  it("keeps coordinates finite and inside bounds", () => {
    for (const width of [1440, 1280, 1024, 768, 390]) {
      const layout = computeRoadmapLayout({ items: items.slice(0, 8), width, density: "comfortable", variant: "portfolio" });
      for (const point of layout.points) {
        expect(Number.isNaN(point.x)).toBe(false);
        expect(Number.isNaN(point.y)).toBe(false);
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.x).toBeLessThanOrEqual(layout.width);
        expect(point.y).toBeGreaterThanOrEqual(0);
        expect(point.y).toBeLessThanOrEqual(layout.height);
      }
      for (const card of layout.cards) {
        expect(card.box.x1).toBeGreaterThanOrEqual(0);
        expect(card.box.x2).toBeLessThanOrEqual(layout.width);
      }
    }
  });

  it("dense mode reduces canvas height or keeps it stable", () => {
    const comfortable = computeRoadmapLayout({ items, width: 1280, density: "comfortable", variant: "portfolio" });
    const dense = computeRoadmapLayout({ items, width: 1280, density: "dense", variant: "portfolio" });
    expect(dense.height).toBeLessThanOrEqual(comfortable.height);
  });
});
