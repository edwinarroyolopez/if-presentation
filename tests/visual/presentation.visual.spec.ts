import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "@playwright/test";

const artifactDir = resolve(process.cwd(), "../ai/artifacts/if-presentation/visual");
const shots = [
  ["/", "home-desktop.png"],
  ["/architecture-review/", "architecture-desktop.png"],
  ["/roadmap/", "roadmap-desktop.png"],
  ["/systems-integration/", "integrations-desktop.png"],
  ["/data-modeling/", "data-modeling-desktop.png"],
  ["/ai-strategy/", "ai-strategy-desktop.png"],
  ["/executive-scenario/", "executive-desktop.png"],
] as const;

test.beforeAll(() => mkdirSync(artifactDir, { recursive: true }));

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
