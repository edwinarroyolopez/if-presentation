import { expect, test } from "@playwright/test";

const routes = ["/", "/architecture-review/", "/roadmap/", "/systems-integration/", "/data-modeling/", "/ai-strategy/", "/executive-scenario/"];
const headings = ["InflightOS une", "Revisión de arquitectura", "Roadmap visual", "ERP como núcleo", "Ocho dominios", "IA como copiloto", "18 meses sí"];
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
    await expect(page.getByRole("navigation", { name: "Partes de la presentación" }).getByRole("link")).toHaveCount(8);

  for (const [index, route] of routes.entries()) {
    await page.goto(route);
    await expect(page.getByRole("heading", { name: new RegExp(headings[index]) })).toBeVisible();
    await expect(page.locator(".slide-frame")).toBeVisible();
    await expect(page.locator(`[aria-current="page"]`).first()).toBeVisible();
    await expect(page).not.toHaveURL(/login/);
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
    const width = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    expect(width).toBe(true);
  }

  await page.goto("/systems-integration/");
  await expect(page.getByRole("heading", { name: "ERP como núcleo, conexiones por proyecto" })).toBeVisible();
  await expect(page.getByText("InflightOS gobierna el contexto, los permisos y la trazabilidad")).toBeVisible();
  await expect(page.getByText("InflightOS ERP")).toBeVisible();
  await expect(page.getByText("Project Control Plane")).toBeVisible();
  await expect(page.getByText("Project Connection")).toBeVisible();
  await expect(page.getByText("API key revocable", { exact: true })).toBeVisible();
  await expect(page.getByText("Permisos por scope", { exact: true })).toBeVisible();
  for (const contract of ["API", "Evento", "Job / Queue", "Object Store"]) await expect(page.getByText(contract, { exact: true })).toBeVisible();
  await expect(page.getByText("Ningún sistema escribe directamente en la base de datos de otro.")).toBeVisible();
  for (const label of ["Flujo de negocio", "Contratos de integración", "Conexiones y permisos", "Resiliencia y trazabilidad"]) await expect(page.getByRole("button", { name: `Abrir ${label}` })).toBeVisible();

  await page.goto("/data-modeling/");
  await expect(page.getByRole("heading", { name: "Ocho dominios, un flujo trazable" })).toBeVisible();
  for (const project of ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"]) await expect(page.getByText(project, { exact: true }).first()).toBeVisible();
  for (const label of ["Dominios y ownership", "Relaciones y eventos", "Estados y lifecycles", "Gobierno e integridad"]) await expect(page.getByRole("button", { name: `Abrir ${label}` })).toBeVisible();
});

test("previous next progress and mobile drawer", async ({ page }) => {
  await page.goto("/roadmap/");
  await expect(page.getByText("2 de 6").first()).toBeVisible();
  await page.getByRole("link", { name: "Siguiente" }).click();
  await expect(page).toHaveURL(/systems-integration\/$/);
  await page.getByRole("link", { name: "Anterior" }).click();
  await expect(page).toHaveURL(/roadmap\/$/);

  await page.goto("/");
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
    await expect(page.locator("[data-roadmap-station]")).toHaveCount(4);
    await expect(page.getByRole("button", { name: /Abrir Métricas/ })).toBeVisible();
  }
  await page.goto("/executive-scenario/");
  await expect(page.getByRole("heading", { name: /18 meses sí/ })).toBeVisible();
});

test("systems integration blueprint and dialogs", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/systems-integration/");
  await expect(page.getByRole("heading", { name: "ERP como núcleo, conexiones por proyecto" })).toBeVisible();
  await expect(page.locator("main.integration-blueprint")).toBeVisible();
  await expect(page.locator(".connection-path")).toHaveAttribute("aria-label", "Project -> Project Connector Connection -> Connector");
  await expect(page.getByText("API key revocable", { exact: true })).toBeVisible();
  await expect(page.getByText("Permisos por scope", { exact: true })).toBeVisible();
  await expect(page.getByText("Aislamiento por proyecto", { exact: true })).toBeVisible();
  await expect(page.getByText("Auditoría y estado", { exact: true })).toBeVisible();
  await expect(page.getByText("Flight Operations")).toBeVisible();
  await expect(page.getByText("Image Engine")).toBeVisible();
  await expect(page.getByText("AI Gateway")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  for (const label of ["Flujo de negocio", "Contratos de integración", "Conexiones y permisos", "Resiliencia y trazabilidad"]) {
    const action = page.getByRole("button", { name: `Abrir ${label}` });
    await action.focus();
    await expect(action).toBeFocused();
    await expect(page.getByText(label).first()).toBeVisible();
    await action.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog")).toContainText(label);
    if (label === "Conexiones y permisos") {
      await expect(page.getByRole("dialog")).toContainText("Autenticación");
      await expect(page.getByRole("dialog")).toContainText("Autorización");
      await expect(page.getByRole("dialog")).toContainText("project.*");
      await expect(page.getByRole("dialog")).toContainText("OAuth2 client credentials");
    }
    if (label === "Contratos de integración") {
      for (const eventName of ["OpportunityWon.v1", "ProjectCreated.v1", "MissionReviewedClosed.v1", "SampleApproved.v1", "DeliverableApproved.v1", "InvoiceRequested.v1"]) await expect(page.getByRole("dialog")).toContainText(eventName);
    }
    if (label === "Resiliencia y trazabilidad") {
      for (const traceId of ["requestId", "correlationId", "eventId", "organizationId", "projectId", "resourceId"]) await expect(page.getByRole("dialog")).toContainText(traceId);
    }
    await page.keyboard.press("Escape");
    await expect(action).toBeFocused();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }

  const noOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  expect(noOverflow).toBe(true);
});

test("architecture review premium slide and dialogs", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/architecture-review/");
  await expect(page.getByRole("heading", { name: "Revisión de arquitectura InflightOS" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Primero, el núcleo operativo que mueve ingresos." })).toBeVisible();
  await expect(page.locator(".presentation-slide-meta").getByText("8 prioridades", { exact: true })).toBeVisible();
  await expect(page.locator(".presentation-slide-meta").getByText("3 frentes MVP", { exact: true })).toBeVisible();
  for (const priority of ["Automatización de vuelos", "ERP mínimo integrado", "Automatización de imágenes"]) await expect(page.locator(".architecture-sequence-list").getByText(priority, { exact: true })).toBeVisible();
  for (const forbidden of ["Monolito modular", "Bounded contexts", "Outbox", "Scopes", "Gates"]) await expect(page.getByText(forbidden)).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Ver detalle/ })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Abrir Riesgos" })).toHaveCount(1);

  const dialogExpectations = [
    { label: "Fortalezas", title: "5 fortalezas", texts: ["Integración de CRM, ventas y gestión de proyectos", "ERP unificado", "Capa de analítica e inteligencia artificial"] },
    { label: "Riesgos", title: "5 riesgos", texts: ["Alta complejidad inicial por múltiples módulos", "Dependencia de automatización de vuelos", "Alto costo de desarrollar un ERP desde cero"] },
    { label: "Fuera del MVP", title: "3 áreas fuera del MVP inicial", texts: ["Capa de IA avanzada", "Módulos de recursos humanos y cumplimiento", "Analítica avanzada"] },
    { label: "Prioridades", title: "Secuencia completa de prioridades", texts: ["01", "02", "03", "04", "05", "06", "07", "08", "MVP inicial", "Secuencia posterior"] },
  ];

  for (const expectation of dialogExpectations) {
    const action = page.getByRole("button", { name: `Abrir ${expectation.label}` });
    await expect(action).toHaveAttribute("aria-label", `Abrir ${expectation.label}`);
    await action.focus();
    await expect(action).toBeFocused();
    await expect(page.getByText(expectation.label).first()).toBeVisible();
    await action.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog")).toContainText(expectation.title);
    for (const text of expectation.texts) await expect(page.getByRole("dialog")).toContainText(text);
    await page.keyboard.press("Tab");
    const activeInsideDialog = await page.evaluate(() => Boolean(document.activeElement?.closest("dialog")));
    expect(activeInsideDialog).toBe(true);
    await page.keyboard.press("Escape");
    await expect(action).toBeFocused();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }

  const noInternalOverflow = await page.locator(".presentation-slide-body").evaluate((body) => body.scrollHeight <= body.clientHeight + 1);
  expect(noInternalOverflow).toBe(true);
  const noHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  expect(noHorizontalOverflow).toBe(true);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/architecture-review/");
  await expect(page.getByRole("button", { name: /Información/ })).toBeVisible();
  await page.getByRole("button", { name: /Información/ }).click();
  await expect(page.getByRole("dialog")).toContainText("Información de arquitectura");
  await expect(page.getByRole("dialog")).toContainText("Fortalezas");
  await page.keyboard.press("Escape");
  const mobileNoOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  expect(mobileNoOverflow).toBe(true);
});

test("data modeling v2 slide and dialogs", async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.goto("/data-modeling/");
  await expect(page.getByRole("heading", { name: "Ocho dominios, un flujo trazable" })).toBeVisible();
  await expect(page.getByText("Client / Opportunity -> Project / MPO -> Mission -> MediaBatch / Sample -> Deliverable -> Invoice / Payment -> Margin")).toBeVisible();
  for (const name of ["CRM, Ventas y Proyectos", "Flight Operations", "Image Operations", "Finanzas", "Cumplimiento", "Analítica", "Personas y capacidad", "Plataforma de IA"]) await expect(page.getByText(name).first()).toBeVisible();
  for (const text of ["habilita o bloquea", "observa y certifica", "asigna capacidad", "recomienda con aprobación", "Sin escrituras cross-DB"]) await expect(page.getByText(text).first()).toBeVisible();

  await expect(page.getByRole("button", { name: /Ver detalle/ })).toHaveCount(0);
  for (const label of ["Dominios y ownership", "Relaciones y eventos", "Estados y lifecycles", "Gobierno e integridad"]) {
    const action = page.getByRole("button", { name: `Abrir ${label}` });
    await expect(action).toHaveAttribute("aria-label", `Abrir ${label}`);
    await action.focus();
    await expect(action).toBeFocused();
    await expect(page.getByText(label).first()).toBeVisible();
    await action.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog")).toContainText(label);
    if (label === "Relaciones y eventos") {
      for (const eventName of ["OpportunityWon.v1", "ProjectCreated.v1", "MissionReviewedClosed.v1", "MediaIngested.v1", "SampleApproved.v1", "DeliverableApproved.v1", "InvoiceRequested.v1"]) await expect(page.getByRole("dialog")).toContainText(eventName);
    }
    if (label === "Estados y lifecycles") {
      for (const state of ["MissionPilotCompleted", "REVIEWED_CLOSED", "CHANGES_REQUESTED", "DEGRADED", "RETIRED"]) await expect(page.getByRole("dialog")).toContainText(state);
    }
    if (label === "Gobierno e integridad") {
      await expect(page.getByRole("dialog")).toContainText("Organization / tenant scope");
      await expect(page.getByRole("dialog")).toContainText("Outbox");
      await expect(page.getByRole("dialog")).toContainText("IA sin commit autónomo");
    }
    await page.keyboard.press("Escape");
    await expect(action).toBeFocused();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }

  const noInternalOverflow = await page.locator(".presentation-slide-body").evaluate((body) => body.scrollHeight <= body.clientHeight + 1);
  expect(noInternalOverflow).toBe(true);
  const noHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  expect(noHorizontalOverflow).toBe(true);
  const collision = await page.locator(".data-model-map").evaluate((map) => {
    const cards = Array.from(map.querySelectorAll(".data-domain-card"), (card) => card.getBoundingClientRect());
    for (let i = 0; i < cards.length; i++) for (let j = i + 1; j < cards.length; j++) {
      const x = Math.max(0, Math.min(cards[i].right, cards[j].right) - Math.max(cards[i].left, cards[j].left));
      const y = Math.max(0, Math.min(cards[i].bottom, cards[j].bottom) - Math.max(cards[i].top, cards[j].top));
      if (x * y > 80) return true;
    }
    return false;
  });
  expect(collision).toBe(false);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/data-modeling/");
  await expect(page.getByRole("heading", { name: "Ocho dominios, un flujo trazable" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plataforma de IA" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Abrir Gobierno e integridad" })).toBeVisible();
  const mobileNoOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  expect(mobileNoOverflow).toBe(true);
});

test("AI strategy premium slide and dialog", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/ai-strategy/");
  await expect(page.getByRole("heading", { name: "IA como copiloto, no como autoridad" })).toBeVisible();
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByText("Patrón recomendado")).toBeVisible();
  await expect(page.getByText("Sin escritura directa a las bases de datos del ERP.")).toBeVisible();
  for (const step of ["Datos autorizados", "AI Gateway", "Modelo aprobado", "Resultado estructurado", "Validación + preview", "Revisión humana", "API del dominio + auditoría"]) await expect(page.locator(".ai-architecture-strip").getByText(step, { exact: true })).toBeVisible();
  for (const priority of ["Calidad y clasificación de imágenes", "Documentación estructurada", "Resúmenes operativos y ejecutivos", "Calidad de datos", "Planificación de vuelos asistida", "Extracción en Finanzas y Cumplimiento"]) await expect(page.locator(".ai-priority-panel").getByText(priority, { exact: true })).toBeVisible();
  for (const limit of ["Autorizar o controlar vuelos", "Aprobar facturas o mover dinero", "Decisiones regulatorias definitivas", "Decisiones laborales", "Entregables premium autónomos", "Agentes con acceso general al ERP", "IA sin trazabilidad ni revisión"]) await expect(page.locator(".ai-authority-panel").getByText(limit, { exact: true })).toBeVisible();
  await expect(page.getByText("Después, con evidencia")).toBeVisible();
  await expect(page.getByText("Sin baseline, datos autorizados, validación, revisión humana, owner y rollback")).toBeVisible();

  const noInternalOverflow = await page.locator(".presentation-slide-body").evaluate((body) => body.scrollHeight <= body.clientHeight + 1);
  expect(noInternalOverflow).toBe(true);
  const noHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  expect(noHorizontalOverflow).toBe(true);

  const action = page.getByRole("button", { name: /Ver detalle/ });
  await action.focus();
  await expect(action).toBeFocused();
  await action.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  for (const domain of ["Imágenes", "Documentación de proyectos", "CRM y ventas", "Analítica operativa y ejecutiva", "Planificación de vuelos", "Cumplimiento", "Finanzas", "Recursos Humanos y capacidad"]) await expect(page.getByRole("dialog")).toContainText(domain);
  for (const gate of ["Problema y usuario definidos", "Baseline sin IA", "Datos autorizados y con calidad", "Resultado validable", "Revisión humana", "Fallback manual", "Costo medible", "Errores reversibles", "Métricas de calidad y valor", "Owner, auditoría y rollback"]) await expect(page.getByRole("dialog")).toContainText(gate);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Escape");
  await expect(action).toBeFocused();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ai-strategy/");
  await expect(page.getByRole("heading", { name: "IA como copiloto, no como autoridad" })).toBeVisible();
  await expect(page.locator("h1")).toHaveCount(1);
  const mobileNoOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  expect(mobileNoOverflow).toBe(true);
  await page.getByRole("button", { name: /Ver detalle/ }).click();
  await expect(page.getByRole("dialog")).toContainText("Diez gates para producción");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("roadmap portfolio and project routes", async ({ page }) => {
  await page.goto("/roadmap/");
  await expect(page.getByRole("link", { name: /02 Roadmap/ })).toHaveAttribute("aria-current", "page");
  await expect(page.getByText("2 de 6").first()).toBeVisible();
  await expect(page.locator("[data-roadmap-station]")).toHaveCount(8);
    await expect(page.locator("[data-roadmap-card]")).toHaveCount(8);
    await expect(page.locator("[data-roadmap-connector]")).toHaveCount(8);
    const zoomOut = page.getByRole("button", { name: "Reducir tamaño del roadmap" });
    const zoomIn = page.getByRole("button", { name: "Aumentar tamaño del roadmap" });
    await expect(zoomOut).toBeVisible();
    await expect(zoomIn).toBeVisible();
    const initialZoom = await page.locator(".roadmap-zoom-controls span").innerText();
    expect(Number(initialZoom.replace("%", ""))).toBeLessThanOrEqual(72);
    await page.getByRole("button", { name: "Aumentar tamaño del roadmap" }).click();
  const zoomedIn = await page.locator(".roadmap-zoom-controls span").innerText();
  expect(Number(zoomedIn.replace("%", ""))).toBeGreaterThan(Number(initialZoom.replace("%", "")));
  const firstCard = page.locator("[data-roadmap-card]").first();
  const firstConnectorDot = page.locator("[data-roadmap-connector-dot]").first();
  const cardBox = await firstCard.boundingBox();
  expect(cardBox).not.toBeNull();
  const connectorBefore = await firstConnectorDot.evaluate((dot) => ({ cx: Number(dot.getAttribute("cx")), cy: Number(dot.getAttribute("cy")) }));
  await page.mouse.move(cardBox!.x + cardBox!.width / 2, cardBox!.y + cardBox!.height / 2);
  await page.mouse.down();
  await page.mouse.move(cardBox!.x + cardBox!.width / 2 + 90, cardBox!.y + cardBox!.height / 2 + 42, { steps: 8 });
  await page.mouse.up();
  const draggedBox = await firstCard.boundingBox();
  expect(draggedBox).not.toBeNull();
  expect(Math.hypot(draggedBox!.x - cardBox!.x, draggedBox!.y - cardBox!.y)).toBeGreaterThan(24);
  const connectorAfter = await firstConnectorDot.evaluate((dot) => ({ cx: Number(dot.getAttribute("cx")), cy: Number(dot.getAttribute("cy")) }));
  expect(Math.hypot(connectorAfter.cx - connectorBefore.cx, connectorAfter.cy - connectorBefore.cy)).toBeGreaterThan(24);
  await expect(page.locator("path").filter({ hasNotText: /./ })).toHaveCount(await page.locator("path").count());
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
    await page.getByRole("button", { name: /Abrir Métricas/ }).click();
    await expect(page.getByRole("dialog")).toContainText("North Star");
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: /Abrir Resumen/ }).click();
    await expect(page.getByRole("dialog")).toContainText("Resumen ejecutivo");
    await page.keyboard.press("Escape");
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
    const stationCardOverlap = await page.locator("[data-roadmap-canvas]").evaluate((canvas) => {
      const stations = Array.from(canvas.querySelectorAll("[data-roadmap-station]"), (station) => {
        const rect = station.getBoundingClientRect();
        return { left: rect.left - 10, right: rect.right + 10, top: rect.top - 10, bottom: rect.bottom + 10 };
      });
      const cards = Array.from(canvas.querySelectorAll("[data-roadmap-card]"), (card) => card.getBoundingClientRect());
      return cards.some((card) => stations.some((station) => {
        const x = Math.max(0, Math.min(card.right, station.right) - Math.max(card.left, station.left));
        const y = Math.max(0, Math.min(card.bottom, station.bottom) - Math.max(card.top, station.top));
        return x * y > 16;
      }));
    });
    expect(stationCardOverlap).toBe(false);
    if (viewport.width >= 860) {
      await expect.poll(async () => page.locator("[data-roadmap-canvas]").evaluate((canvas) => {
        const bounds = canvas.getBoundingClientRect();
        const cards = Array.from(canvas.querySelectorAll("[data-roadmap-card]"), (card) => card.getBoundingClientRect());
        return cards.every((card) => card.left >= bounds.left - 1 && card.right <= bounds.right + 1 && card.top >= bounds.top - 1 && card.bottom <= bounds.bottom + 1);
      })).toBe(true);
    }
  }
});

test("slide experience progressive disclosure and hashes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/roadmap/automatizacion-de-vuelos/");
  const frameFits = await page.evaluate(() => {
    const frame = document.querySelector(".slide-frame")?.getBoundingClientRect();
    return Boolean(frame && frame.top >= -1 && frame.bottom <= window.innerHeight + 80);
  });
  expect(frameFits).toBe(true);
  await expect(page.locator("[data-roadmap-canvas]")).toBeInViewport();
  for (const label of ["Objetivo", "Métricas", "Alcance", "Principios", "Dependencias", "Equipo", "Riesgos", "Resumen"]) {
    const action = page.getByRole("button", { name: new RegExp(`Abrir ${label}`) });
    await expect(action).toHaveAttribute("aria-label", `Abrir ${label}`);
    await action.focus();
    await expect(page.getByText(label).first()).toBeVisible();
    await action.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    const centered = await page.getByRole("dialog").evaluate((dialog) => {
      const rect = dialog.getBoundingClientRect();
      return Math.abs(rect.left + rect.width / 2 - window.innerWidth / 2) < 8 && Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2) < 8;
    });
    expect(centered).toBe(true);
    await page.keyboard.press("Escape");
    await expect(action).toBeFocused();
  }
  await page.locator("[data-roadmap-station]").nth(2).click();
  await expect(page).toHaveURL(/#flight-180$/);
  await page.reload();
  await expect(page.locator("[data-active-horizon='flight-180']")).toBeVisible();
  await page.getByRole("button", { name: /Explorar horizonte/ }).click();
  await expect(page.getByRole("dialog")).toContainText("Entregable");
  await expect(page.getByRole("dialog")).toContainText("Gate");
  await expect(page.getByRole("dialog")).toContainText("Equipo");
});

test("sitemap includes roadmap child routes", async ({ page }) => {
  await page.goto("/sitemap.xml");
  const text = await page.locator("body").innerText();
  for (const route of projectRoutes) expect(text).toContain(route);
});
