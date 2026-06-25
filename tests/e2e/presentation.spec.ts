import { expect, test } from "@playwright/test";

const routes = ["/", "/architecture-review/", "/roadmap/", "/systems-integration/", "/data-modeling/", "/ai-strategy/", "/executive-scenario/"];
const headings = ["InflightOS une", "Revisión de arquitectura", "Roadmap visual", "ERP como núcleo", "Del cliente a factura", "IA donde existe", "18 meses sí"];
const projectRoutes = [
  "/roadmap/automatizacion-de-vuelos/",
  "/roadmap/erp-minimo-integrado/",
  "/roadmap/automatizacion-de-imagenes/",
  "/roadmap/finanzas-y-facturacion/",
  "/roadmap/cumplimiento-y-gestion-regulatoria/",
  "/roadmap/analitica-operativa-y-ejecutiva/",
  "/roadmap/recursos-humanos-y-gestion-de-capacidad/",
  "/roadmap/capa-de-inteligencia-artificial-avanzada/",
];

test.beforeEach(async ({ page }) => {
  const consoleErrors: string[] = [];
  const backendRequests: string[] = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("request", (request) => { const url = request.url(); if (url.includes("/api/") || url.includes("if-backend-main") || url.includes("NEXT_PUBLIC_API_BASE_URL")) backendRequests.push(url); });
  (page as typeof page & { __consoleErrors: string[]; __backendRequests: string[] }).__consoleErrors = consoleErrors;
  (page as typeof page & { __consoleErrors: string[]; __backendRequests: string[] }).__backendRequests = backendRequests;
});

test.afterEach(async ({ page }) => {
  const tracked = page as typeof page & { __consoleErrors: string[]; __backendRequests: string[] };
  expect(tracked.__consoleErrors).toEqual([]);
  expect(tracked.__backendRequests).toEqual([]);
});

test("home, CTA, menu, direct routes and content load", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /InflightOS une/ })).toBeVisible();
  await page.getByRole("link", { name: /Comenzar presentación/ }).click();
  await expect(page).toHaveURL(/architecture-review\/$/);
  await expect(page.getByRole("navigation", { name: "Partes de la presentación" }).getByRole("link")).toHaveCount(7);

  for (const [index, route] of routes.entries()) {
    await page.goto(route);
    await expect(page.getByRole("heading", { name: new RegExp(headings[index]) })).toBeVisible();
    await expect(page.locator(`[aria-current="page"]`).first()).toBeVisible();
    await expect(page).not.toHaveURL(/login/);
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
    const width = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    expect(width).toBe(true);
  }

  await page.goto("/systems-integration/");
  await expect(page.getByText("POST", { exact: true })).toBeVisible();
  await expect(page.getByText("/mission-completed", { exact: true })).toBeVisible();
  for (const eventName of ["MissionCompleted", "MediaIngested", "SampleApproved", "InvoiceRequested"]) await expect(page.getByText(eventName).first()).toBeVisible();

  await page.goto("/data-modeling/");
  for (const entity of ["Client", "MPO", "Project", "Mission", "MediaBatch", "Deliverable", "Invoice", "UserRole"]) await expect(page.getByText(entity).first()).toBeVisible();
});

test("previous next progress and mobile drawer", async ({ page }) => {
  await page.goto("/roadmap/");
  await expect(page.getByText("2 de 6").first()).toBeVisible();
  await page.getByRole("link", { name: "Siguiente" }).click();
  await expect(page).toHaveURL(/systems-integration\/$/);
  await page.getByRole("link", { name: "Anterior" }).click();
  await expect(page).toHaveURL(/roadmap\/$/);

  await page.goto("/executive-scenario/");
  await page.getByRole("link", { name: "Volver al inicio" }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const opener = page.getByRole("button", { name: "Abrir menú" });
  await opener.click();
  await expect(page.getByRole("button", { name: "Cerrar menú" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
});

test("static direct routes smoke", async ({ page }) => {
  await page.goto("/roadmap/");
  await expect(page.getByRole("heading", { name: /Roadmap visual/ })).toBeVisible();
  for (const route of projectRoutes) {
    await page.goto(route);
    await expect(page.getByText("North Star Metric")).toBeVisible();
  }
  await page.goto("/executive-scenario/");
  await expect(page.getByRole("heading", { name: /18 meses sí/ })).toBeVisible();
});

test("roadmap portfolio and project routes", async ({ page }) => {
  await page.goto("/roadmap/");
  await expect(page.getByRole("link", { name: /02 Roadmap/ })).toHaveAttribute("aria-current", "page");
  await expect(page.getByText("2 de 6").first()).toBeVisible();
  await expect(page.locator("[data-roadmap-station]")).toHaveCount(8);
  await expect(page.locator("[data-roadmap-card]")).toHaveCount(8);
  await expect(page.locator("[data-roadmap-connector]")).toHaveCount(8);
  await expect(page.locator("path").filter({ hasNotText: /./ })).toHaveCount(await page.locator("path").count());
  await expect(page.getByRole("button", { name: "Denso" })).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "Denso" }).click();
  await expect(page.getByRole("button", { name: "Denso" })).toHaveAttribute("aria-pressed", "true");
  await page.locator("[data-roadmap-station]").first().focus();
  await expect(page.locator("[data-roadmap-station]").first()).toBeFocused();
  await page.keyboard.press("Enter");
  await page.locator("[data-roadmap-card]").first().getByRole("link").click();
  await expect(page).toHaveURL(/automatizacion-de-vuelos\/$/);
  await expect(page.getByText("Proyecto 1 de 8")).toBeVisible();
  await expect(page.locator("[data-roadmap-station]")).toHaveCount(4);
  for (const label of ["30 días", "90 días", "180 días", "365 días"]) await expect(page.getByText(label).first()).toBeVisible();
});

test("all roadmap project routes load and navigate locally", async ({ page }) => {
  for (const route of projectRoutes) {
    await page.goto(route);
    await expect(page.getByRole("link", { name: /02 Roadmap/ })).toHaveAttribute("aria-current", "page");
    await expect(page.getByText("North Star Metric")).toBeVisible();
    await expect(page.getByText("Resumen ejecutivo").first()).toBeVisible();
    await expect(page.locator("[data-roadmap-station]")).toHaveCount(4);
    await expect(page).not.toHaveURL(/login/);
  }
  await page.goto(projectRoutes[1]);
  await page.getByRole("link", { name: "Proyecto anterior" }).first().click();
  await expect(page).toHaveURL(/automatizacion-de-vuelos\/$/);
  await page.getByRole("link", { name: "Proyecto siguiente" }).first().click();
  await expect(page).toHaveURL(/erp-minimo-integrado\/$/);
  await page.getByRole("link", { name: "Volver al roadmap InflightOS" }).first().click();
  await expect(page).toHaveURL(/roadmap\/$/);
});

test("roadmap collision and mobile smoke", async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 1280, height: 900 }, { width: 1024, height: 900 }, { width: 768, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto("/roadmap/");
    await expect(page.locator("[data-roadmap-canvas]")).toBeVisible();
    const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    expect(noOverflow).toBe(true);
    const significantOverlap = await page.locator("[data-roadmap-card]").evaluateAll((cards) => {
      const rects = cards.map((card) => card.getBoundingClientRect());
      for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
        const x = Math.max(0, Math.min(rects[i].right, rects[j].right) - Math.max(rects[i].left, rects[j].left));
        const y = Math.max(0, Math.min(rects[i].bottom, rects[j].bottom) - Math.max(rects[i].top, rects[j].top));
        if (x * y > 220) return true;
      }
      return false;
    });
    expect(significantOverlap).toBe(false);
  }
});

test("sitemap includes roadmap child routes", async ({ page }) => {
  await page.goto("/sitemap.xml");
  const text = await page.locator("body").innerText();
  for (const route of projectRoutes) expect(text).toContain(route);
});
