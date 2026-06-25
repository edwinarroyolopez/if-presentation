import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "@playwright/test";

const artifactDir = resolve(process.cwd(), "../ai/artifacts/if-presentation/visual");
const roadmapArtifactDir = resolve(process.cwd(), "../ai/artifacts/if-presentation-roadmaps/visual");
const shots = [
  ["/", "home-desktop.png"],
  ["/architecture-review/", "architecture-desktop.png"],
  ["/roadmap/", "roadmap-desktop.png"],
  ["/systems-integration/", "integrations-desktop.png"],
  ["/data-modeling/", "data-modeling-desktop.png"],
  ["/ai-strategy/", "ai-strategy-desktop.png"],
  ["/executive-scenario/", "executive-desktop.png"],
] as const;

test.beforeAll(() => { mkdirSync(artifactDir, { recursive: true }); mkdirSync(roadmapArtifactDir, { recursive: true }); });

for (const [route, file] of shots) {
  test(`captures ${file}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);
    await page.screenshot({ fullPage: true, path: resolve(artifactDir, file) });
  });
}

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

test("captures roadmap portfolio states", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/roadmap/");
  await page.screenshot({ fullPage: true, path: resolve(roadmapArtifactDir, "portfolio-desktop-comfortable.png") });
  await page.getByRole("button", { name: "Denso" }).click();
  await page.screenshot({ fullPage: true, path: resolve(roadmapArtifactDir, "portfolio-desktop-dense.png") });
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
});
