import { describe, expect, it } from "vitest";
import { getNavigationItems, getPresentationContent, getPreviousNext, getRouteProgress } from "@/lib/content";

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
    expect(getPreviousNext("/architecture-review/").next?.route).toBe("/roadmap/");
    expect(getPreviousNext("/executive-scenario/").previous?.route).toBe("/ai-strategy/");
  });

  it("keeps required architecture counts", () => {
    expect(content.architecture.strengths).toHaveLength(5);
    expect(content.architecture.risks).toHaveLength(5);
    expect(content.architecture.deferred).toHaveLength(3);
  });

  it("keeps required roadmap horizons", () => {
    expect(content.roadmap.phases.map((phase) => phase.days)).toEqual([30, 90, 180, 365]);
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
