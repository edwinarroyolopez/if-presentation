import { expect, test } from "@playwright/test";

const routes = ["/", "/architecture-review/", "/roadmap/", "/systems-integration/", "/data-modeling/", "/ai-strategy/", "/executive-scenario/"];
const headings = ["InflightOS une", "Revisión de arquitectura", "Roadmap 30", "ERP como núcleo", "Del cliente a factura", "IA donde existe", "18 meses sí"];

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
  await expect(page.getByRole("heading", { name: /Roadmap 30/ })).toBeVisible();
  await page.goto("/executive-scenario/");
  await expect(page.getByRole("heading", { name: /18 meses sí/ })).toBeVisible();
});
