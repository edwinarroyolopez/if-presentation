import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "@playwright/test";

const artifactDir = resolve(process.cwd(), "../ai/artifacts/if-presentation/visual");
const roadmapArtifactDir = resolve(process.cwd(), "../ai/artifacts/if-presentation-roadmaps/visual");
const slideArtifactDir = resolve(process.cwd(), "../ai/artifacts/if-presentation-slide-experience/visual");
const systemsIntegrationArtifactDir = resolve(process.cwd(), "../ai/artifacts/if-presentation-systems-integration/visual");
const dataModelingArtifactDir = resolve(process.cwd(), "../ai/artifacts/if-presentation-data-modeling/visual");
const aiStrategyArtifactDir = resolve(process.cwd(), "../ai/artifacts/if-presentation-ai-strategy/visual");
const shots = [
  ["/", "home-desktop.png"],
  ["/architecture-review/", "architecture-desktop.png"],
  ["/roadmap/", "roadmap-desktop.png"],
  ["/systems-integration/", "integrations-desktop.png"],
  ["/data-modeling/", "data-modeling-desktop.png"],
  ["/ai-strategy/", "ai-strategy-desktop.png"],
  ["/executive-scenario/", "executive-desktop.png"],
] as const;

test.beforeAll(() => { mkdirSync(artifactDir, { recursive: true }); mkdirSync(roadmapArtifactDir, { recursive: true }); mkdirSync(slideArtifactDir, { recursive: true }); mkdirSync(systemsIntegrationArtifactDir, { recursive: true }); mkdirSync(dataModelingArtifactDir, { recursive: true }); mkdirSync(aiStrategyArtifactDir, { recursive: true }); });

for (const [route, file] of shots) {
  test(`captures ${file}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);
    await page.screenshot({ fullPage: true, path: resolve(artifactDir, file) });
    await page.screenshot({ fullPage: true, path: resolve(slideArtifactDir, file) });
  });
}

const slideShots = [
  ["/roadmap/", "roadmap-portfolio-desktop.png"],
  ["/roadmap/automatizacion-de-vuelos/", "roadmap-flight-desktop.png"],
  ["/roadmap/erp-minimo-integrado/", "roadmap-erp-desktop.png"],
  ["/roadmap/automatizacion-de-imagenes/", "roadmap-images-desktop.png"],
  ["/roadmap/finanzas-y-facturacion/", "roadmap-finance-desktop.png"],
  ["/roadmap/cumplimiento-y-gestion-regulatoria/", "roadmap-compliance-desktop.png"],
  ["/roadmap/analitica-operativa-y-ejecutiva/", "roadmap-analytics-desktop.png"],
  ["/roadmap/recursos-humanos-y-gestion-de-capacidad/", "roadmap-hr-desktop.png"],
  ["/roadmap/capa-de-inteligencia-artificial-avanzada/", "roadmap-ai-desktop.png"],
] as const;

for (const [route, file] of slideShots) {
  test(`captures slide ${file}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route);
    await page.screenshot({ fullPage: true, path: resolve(slideArtifactDir, file) });
  });
}

test("captures slide dialogs and responsive states", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/roadmap/automatizacion-de-vuelos/");
  await page.getByRole("button", { name: /Abrir Objetivo/ }).click();
  await page.screenshot({ fullPage: true, path: resolve(slideArtifactDir, "objective-dialog.png") });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: /Abrir Métricas/ }).click();
  await page.screenshot({ fullPage: true, path: resolve(slideArtifactDir, "metrics-dialog.png") });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: /Abrir Dependencias/ }).click();
  await page.screenshot({ fullPage: true, path: resolve(slideArtifactDir, "dependencies-dialog.png") });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: /Abrir Riesgos/ }).click();
  await page.screenshot({ fullPage: true, path: resolve(slideArtifactDir, "risks-dialog.png") });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: /Explorar horizonte/ }).click();
  await page.screenshot({ fullPage: true, path: resolve(slideArtifactDir, "horizon-dialog.png") });
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.screenshot({ fullPage: true, path: resolve(slideArtifactDir, "roadmap-project-laptop.png") });
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.screenshot({ fullPage: true, path: resolve(slideArtifactDir, "roadmap-project-tablet.png") });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/roadmap/automatizacion-de-vuelos/");
  await page.screenshot({ fullPage: true, path: resolve(slideArtifactDir, "roadmap-project-mobile.png") });
  await page.getByRole("button", { name: /Información/ }).click();
  await page.screenshot({ fullPage: true, path: resolve(slideArtifactDir, "mobile-info-sheet.png") });
});

test("captures mobile states", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.screenshot({ fullPage: true, path: resolve(artifactDir, "home-mobile.png") });
  await page.getByRole("button", { name: "Abrir menú" }).click();
  await page.screenshot({ fullPage: true, path: resolve(artifactDir, "mobile-navigation-open.png") });
  await page.goto("/roadmap/");
  await page.screenshot({ fullPage: true, path: resolve(artifactDir, "roadmap-mobile.png") });
  await page.goto("/systems-integration/");
  await page.screenshot({ fullPage: true, path: resolve(artifactDir, "integrations-mobile.png") });
});

test("captures systems integration required viewports", async ({ page }) => {
  for (const viewport of [
    { width: 1366, height: 768, name: "after-1366x768.png" },
    { width: 1440, height: 900, name: "after-1440x900.png" },
    { width: 1920, height: 1080, name: "after-1920x1080.png" },
    { width: 390, height: 844, name: "after-mobile-390x844.png" },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/systems-integration/");
    await page.screenshot({ fullPage: true, path: resolve(systemsIntegrationArtifactDir, viewport.name) });
  }
});

test("captures systems integration dialogs", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/systems-integration/");
  for (const [label, file] of [
    ["Flujo de negocio", "dialog-business-flow.png"],
    ["Contratos de integración", "dialog-integration-contracts.png"],
    ["Conexiones y permisos", "dialog-connections-permissions.png"],
    ["Resiliencia y trazabilidad", "dialog-resilience-traceability.png"],
  ] as const) {
    await page.getByRole("button", { name: `Abrir ${label}` }).click();
    await page.screenshot({ fullPage: true, path: resolve(systemsIntegrationArtifactDir, file) });
    await page.keyboard.press("Escape");
  }
});

test("captures data modeling required evidence", async ({ page }) => {
  for (const viewport of [
    { width: 1600, height: 900, name: "after-data-modeling-desktop-1600x900.png" },
    { width: 1366, height: 768, name: "after-data-modeling-laptop-1366x768.png" },
    { width: 1280, height: 720, name: "after-data-modeling-1280x720.png" },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/data-modeling/");
    await page.screenshot({ fullPage: true, path: resolve(dataModelingArtifactDir, viewport.name) });
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/data-modeling/");
  await page.screenshot({ fullPage: true, path: resolve(dataModelingArtifactDir, "after-data-modeling-mobile.png") });

  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto("/data-modeling/");
  await page.getByRole("button", { name: "Abrir Dominios y ownership" }).click();
  await page.screenshot({ fullPage: true, path: resolve(dataModelingArtifactDir, "data-modeling-domains-dialog.png") });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Abrir Relaciones y eventos" }).click();
  await page.screenshot({ fullPage: true, path: resolve(dataModelingArtifactDir, "data-modeling-relations-dialog.png") });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Abrir Estados y lifecycles" }).click();
  await page.screenshot({ fullPage: true, path: resolve(dataModelingArtifactDir, "data-modeling-lifecycles-dialog.png") });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Abrir Gobierno e integridad" }).click();
  await page.screenshot({ fullPage: true, path: resolve(dataModelingArtifactDir, "data-modeling-governance-dialog.png") });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Abrir Dominios y ownership" }).focus();
  await page.screenshot({ fullPage: true, path: resolve(dataModelingArtifactDir, "data-modeling-keyboard-focus.png") });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.screenshot({ fullPage: true, path: resolve(dataModelingArtifactDir, "data-modeling-reduced-motion.png") });
});

test("captures AI strategy required evidence", async ({ page }) => {
  for (const viewport of [
    { width: 1920, height: 1080, name: "after-desktop-1920x1080.png" },
    { width: 1366, height: 768, name: "after-desktop-1366x768.png" },
    { width: 1280, height: 720, name: "after-desktop-1280x720.png" },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/ai-strategy/");
    await page.screenshot({ fullPage: true, path: resolve(aiStrategyArtifactDir, viewport.name) });
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ai-strategy/");
  await page.screenshot({ fullPage: true, path: resolve(aiStrategyArtifactDir, "after-mobile-390x844.png") });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/ai-strategy/");
  await page.getByRole("button", { name: /Ver detalle/ }).click();
  await page.screenshot({ fullPage: true, path: resolve(aiStrategyArtifactDir, "detail-dialog-desktop.png") });
  await page.keyboard.press("Escape");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ai-strategy/");
  await page.getByRole("button", { name: /Ver detalle/ }).click();
  await page.screenshot({ fullPage: true, path: resolve(aiStrategyArtifactDir, "detail-dialog-mobile.png") });
});

test("captures roadmap portfolio states", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/roadmap/");
  await page.screenshot({ fullPage: true, path: resolve(roadmapArtifactDir, "portfolio-desktop-comfortable.png") });
  await page.locator("[data-roadmap-station]").nth(3).click();
  await page.screenshot({ fullPage: true, path: resolve(roadmapArtifactDir, "portfolio-desktop-selected.png") });
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto("/roadmap/");
  await page.screenshot({ fullPage: true, path: resolve(roadmapArtifactDir, "portfolio-tablet.png") });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/roadmap/");
  await page.screenshot({ fullPage: true, path: resolve(roadmapArtifactDir, "portfolio-mobile.png") });
});

const projectShots = [
  ["/roadmap/automatizacion-de-vuelos/", "flight-roadmap-desktop.png"],
  ["/roadmap/erp-minimo-integrado/", "erp-roadmap-desktop.png"],
  ["/roadmap/automatizacion-de-imagenes/", "image-roadmap-desktop.png"],
  ["/roadmap/finanzas-y-facturacion/", "finance-roadmap-desktop.png"],
  ["/roadmap/cumplimiento-y-gestion-regulatoria/", "compliance-roadmap-desktop.png"],
  ["/roadmap/analitica-operativa-y-ejecutiva/", "analytics-roadmap-desktop.png"],
  ["/roadmap/recursos-humanos-y-gestion-de-capacidad/", "hr-roadmap-desktop.png"],
  ["/roadmap/capa-de-inteligencia-artificial-avanzada/", "ai-roadmap-desktop.png"],
] as const;

for (const [route, file] of projectShots) {
  test(`captures ${file}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);
    await page.screenshot({ fullPage: true, path: resolve(roadmapArtifactDir, file) });
  });
}

test("captures roadmap mobile and reduced motion", async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/roadmap/automatizacion-de-vuelos/");
  await page.screenshot({ fullPage: true, path: resolve(roadmapArtifactDir, "project-roadmap-mobile.png") });
  await context.grantPermissions([]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/roadmap/");
  await page.screenshot({ fullPage: true, path: resolve(roadmapArtifactDir, "reduced-motion.png") });
  await page.screenshot({ fullPage: true, path: resolve(slideArtifactDir, "reduced-motion.png") });
});
