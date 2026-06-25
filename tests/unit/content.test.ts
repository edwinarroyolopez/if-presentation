import { describe, expect, it } from "vitest";
import { getNavigationItems, getPresentationContent, getPreviousNext, getRouteProgress, isRouteActive } from "@/lib/content";
import { buildCatmullRomPath, computeRoadmapLayout } from "@/components/roadmap/roadmap-layout";
import { getRoadmapBySlug, getRoadmapProjectNavigation, getRoadmapProjects, getRoadmapStaticParams } from "@/lib/roadmaps/roadmap-registry";

describe("presentation content contract", () => {
  const content = getPresentationContent();

  it("validates navigation order and routes", () => {
    const items = getNavigationItems();
    expect(items.map((item) => item.part)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(new Set(items.map((item) => item.route)).size).toBe(items.length);
    expect(items.map((item) => item.route)).toEqual(["/", "/architecture-review/", "/roadmap/", "/systems-integration/", "/data-modeling/", "/ai-strategy/", "/executive-scenario/"]);
  });

  it("calculates progress and previous/next", () => {
    expect(getRouteProgress("/").percent).toBe(0);
    expect(getRouteProgress("/roadmap/").percent).toBe(33);
    expect(getRouteProgress("/roadmap/automatizacion-de-vuelos/").item.route).toBe("/roadmap/");
    expect(isRouteActive("/roadmap/", "/roadmap/automatizacion-de-vuelos/")).toBe(true);
    expect(getPreviousNext("/architecture-review/").next?.route).toBe("/roadmap/");
    expect(getPreviousNext("/executive-scenario/").previous?.route).toBe("/ai-strategy/");
  });

  it("keeps required architecture counts", () => {
    expect(content.architecture.strengths).toHaveLength(5);
    expect(content.architecture.risks).toHaveLength(5);
    expect(content.architecture.deferred).toHaveLength(3);
  });

  it("keeps required integration systems and events", () => {
    expect(content.integration.systems.map((system) => system.title)).toEqual(["ERP", "CRM", "Automatización de Vuelos", "Automatización de Imágenes", "Analítica", "IA"]);
    expect(content.integration.events.map((event) => event.name)).toEqual(["MissionCompleted", "MediaIngested", "SampleApproved", "InvoiceRequested"]);
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
