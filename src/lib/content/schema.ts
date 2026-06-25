import { z } from "zod";

const toneSchema = z.enum(["info", "success", "warning", "danger", "neutral"]);
const itemSchema = z.object({ id: z.string().min(1), title: z.string().min(1), description: z.string().min(1), tone: toneSchema.optional() }).strict();
const nonEmptyStringArraySchema = z.array(z.string().min(1)).min(1);

const unique = (values: string[]) => new Set(values).size === values.length;

export const navigationSchema = z.object({
  brand: z.literal("InflightOS"),
  subtitle: z.literal("Evaluación estratégica"),
  items: z.array(z.object({ id: z.string().min(1), label: z.string().min(1), shortLabel: z.string().min(1), route: z.string().regex(/^\/$|^\/(architecture-review|roadmap|systems-integration|data-modeling|ai-strategy|executive-scenario|inflightos)\/$/), part: z.number().int().min(0).max(6), icon: z.literal("brain").optional() }).strict()).length(8),
}).strict().superRefine((value, ctx) => {
  if (!unique(value.items.map((item) => item.id))) ctx.addIssue({ code: "custom", message: "Duplicate navigation ids" });
  if (!unique(value.items.map((item) => item.route))) ctx.addIssue({ code: "custom", message: "Duplicate navigation routes" });
  if (value.items.slice(0, 7).map((item) => item.part).join(",") !== "0,1,2,3,4,5,6") ctx.addIssue({ code: "custom", message: "Navigation parts must be 0..6 before extra items" });
  if (value.items.at(-1)?.id !== "inflightos" || value.items.at(-1)?.icon !== "brain" || value.items.at(-1)?.part !== 6) ctx.addIssue({ code: "custom", message: "InflightOS extra navigation item must close the menu with brain icon" });
});

export const homeSchema = z.object({ title: z.string().min(1), intro: z.string().min(1), systems: z.array(z.string().min(1)).min(12), parts: z.array(itemSchema).length(6), recommendation: z.string().min(1) }).strict();
export const architectureSchema = z.object({ summary: z.string().min(1), strengths: z.array(itemSchema).length(5), risks: z.array(itemSchema).length(5), deferred: z.array(itemSchema).length(3), priorities: z.array(itemSchema).min(3) }).strict();
const integrationContractIdSchema = z.enum(["api", "event", "job", "object"]);
const integrationDialogIdSchema = z.enum(["business-flow", "integration-contracts", "connections-permissions", "resilience-traceability"]);

export const integrationSchema = z.object({
  title: z.literal("ERP como núcleo, conexiones por proyecto"),
  thesis: z.string().min(120),
  core: z.object({
    title: z.literal("InflightOS ERP"),
    subtitle: z.literal("Project Control Plane"),
    context: z.array(z.string().min(1)).length(4),
    governance: z.array(z.string().min(1)).length(4),
    description: z.string().min(1),
  }).strict(),
  connection: z.object({
    title: z.literal("Project Connection"),
    subtitle: z.literal("Project -> Project Connector Connection -> Connector"),
    description: z.string().min(1),
    signals: z.array(z.string().min(1)).length(4),
    attributes: z.array(z.enum(["projectKey", "connector", "host", "status", "permissionScopes", "auditTrail"])).length(6),
    formula: z.array(z.string().min(1)).length(4),
  }).strict(),
  domains: z.array(z.object({
    id: z.enum(["crm", "flight-ops", "flight-engine", "image-ops", "image-engine", "analytics", "ai-gateway"]),
    title: z.string().min(1),
    responsibility: z.string().min(1),
    icon: z.enum(["handshake", "clipboard-check", "plane", "image", "cpu", "bar-chart", "sparkles"]),
    contract: integrationContractIdSchema,
  }).strict()).length(7),
  contracts: z.array(z.object({ id: integrationContractIdSchema, label: z.string().min(1), title: z.string().min(1), description: z.string().min(1) }).strict()).length(4),
  dialogs: z.array(z.object({
    id: integrationDialogIdSchema,
    label: z.string().min(1),
    title: z.string().min(1),
    eyebrow: z.string().min(1),
    icon: z.enum(["route", "workflow", "key-round", "activity"]),
    sections: z.array(z.object({ title: z.string().min(1), items: z.array(z.string().min(1)).min(1) }).strict()).min(2),
  }).strict()).length(4),
  footer: z.object({ primary: z.string().min(1), secondary: z.string().min(1) }).strict(),
}).strict().superRefine((value, ctx) => {
  const domainOrder = ["crm", "flight-ops", "flight-engine", "image-ops", "image-engine", "analytics", "ai-gateway"];
  const contractOrder = ["api", "event", "job", "object"];
  const dialogOrder = ["business-flow", "integration-contracts", "connections-permissions", "resilience-traceability"];
  if (value.domains.map((domain) => domain.id).join(",") !== domainOrder.join(",")) ctx.addIssue({ code: "custom", message: "Missing required integration domain order" });
  if (value.contracts.map((contract) => contract.id).join(",") !== contractOrder.join(",")) ctx.addIssue({ code: "custom", message: "Missing required integration contract order" });
  if (value.dialogs.map((dialog) => dialog.id).join(",") !== dialogOrder.join(",")) ctx.addIssue({ code: "custom", message: "Missing required integration dialog order" });
  if (!value.connection.formula.some((item) => item.includes("API key") && item.includes("autenticación"))) ctx.addIssue({ code: "custom", message: "Connection formula must define API key as authentication" });
  if (!value.connection.formula.some((item) => item.includes("Permisos") && item.includes("autorizadas"))) ctx.addIssue({ code: "custom", message: "Connection formula must define permissions as authorization" });
  if (!value.footer.secondary.includes("Ningún sistema escribe directamente")) ctx.addIssue({ code: "custom", message: "Integration footer must preserve no direct database writes rule" });
});
const dataDomainIdSchema = z.enum(["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"]);
const dataDomainIconSchema = z.enum(["plane", "building", "images", "finance", "compliance", "analytics", "people", "ai"]);
const dataRelationTypeSchema = z.enum(["Referencia por ID", "Comando API", "Evento", "Read model", "Regla de readiness", "Recomendación asistida"]);

const dataDomainSchema = z.object({
  id: dataDomainIdSchema,
  order: z.number().int().min(1).max(8),
  shortName: z.string().min(1),
  fullName: z.string().min(1),
  type: z.enum(["core", "transversal"]),
  owner: z.string().min(1),
  sourceOfTruth: z.string().min(1),
  icon: dataDomainIconSchema,
  functionalVerb: z.string().min(1),
  executiveSummary: z.string().min(1),
  primaryEntities: nonEmptyStringArraySchema,
  lifecycle: nonEmptyStringArraySchema,
  integrityRules: nonEmptyStringArraySchema,
  events: nonEmptyStringArraySchema,
  sourceDocument: z.string().regex(/^docs\/roadmaps\/p[1-8]-/),
}).strict();

const dataValueStageSchema = z.object({
  id: z.string().min(1),
  domainId: dataDomainIdSchema,
  label: z.string().min(1),
  owner: z.string().min(1),
  handoff: z.string().min(1),
}).strict();

const dataCrossDomainLinkSchema = z.object({
  id: z.string().min(1),
  from: dataDomainIdSchema,
  to: dataDomainIdSchema,
  type: dataRelationTypeSchema,
  label: z.string().min(1),
  mechanism: z.string().min(1),
  initiator: z.string().min(1),
  receiver: z.string().min(1),
  cardinality: z.string().min(1),
  sharedIds: nonEmptyStringArraySchema,
  events: nonEmptyStringArraySchema,
}).strict();

const dataLifecycleHighlightSchema = z.object({
  domainId: dataDomainIdSchema,
  title: z.string().min(1),
  states: nonEmptyStringArraySchema,
  alternates: nonEmptyStringArraySchema,
}).strict();

export const dataModelingSchema = z.object({
  title: z.string().min(1),
  thesis: z.string().min(1),
  meta: z.array(z.string().min(1)).length(2),
  valueStream: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    stages: z.array(dataValueStageSchema).min(7),
  }).strict(),
  domains: z.array(dataDomainSchema).length(8),
  crossDomainLinks: z.array(dataCrossDomainLinkSchema).min(1),
  lifecycleHighlights: z.array(dataLifecycleHighlightSchema).length(8),
  governanceRules: z.array(z.object({ id: z.string().min(1), title: z.string().min(1), description: z.string().min(1) }).strict()).min(1),
  footerInsight: z.object({ left: z.string().min(1), callout: z.string().min(1), badge: z.string().min(1) }).strict(),
}).strict().superRefine((value, ctx) => {
  const requiredDomainIds = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"] as const;
  const domainIds = value.domains.map((domain) => domain.id);
  const domainIdSet = new Set(domainIds);
  if (!unique(domainIds)) ctx.addIssue({ code: "custom", message: "Duplicate data modeling domain ids" });
  if (requiredDomainIds.some((id) => !domainIdSet.has(id))) ctx.addIssue({ code: "custom", message: "Data modeling domains must include p1..p8" });
  if (!unique(value.domains.map((domain) => String(domain.order)))) ctx.addIssue({ code: "custom", message: "Duplicate data modeling domain order" });
  if (value.domains.filter((domain) => domain.type === "core").length !== 4 || value.domains.filter((domain) => domain.type === "transversal").length !== 4) ctx.addIssue({ code: "custom", message: "Data modeling must keep four core and four transversal domains" });
  for (const stage of value.valueStream.stages) {
    if (!domainIdSet.has(stage.domainId)) ctx.addIssue({ code: "custom", message: `Unknown value stream domain ${stage.domainId}` });
  }
  for (const link of value.crossDomainLinks) {
    if (!domainIdSet.has(link.from) || !domainIdSet.has(link.to)) ctx.addIssue({ code: "custom", message: `Unknown cross-domain link domain in ${link.id}` });
  }
  for (const lifecycle of value.lifecycleHighlights) {
    if (!domainIdSet.has(lifecycle.domainId)) ctx.addIssue({ code: "custom", message: `Unknown lifecycle domain ${lifecycle.domainId}` });
  }
  if (!value.footerInsight.badge.includes("Sin escrituras cross-DB")) ctx.addIssue({ code: "custom", message: "Data modeling footer must preserve no cross-DB writes rule" });
  if (!value.domains.find((domain) => domain.id === "p8")?.integrityRules.some((rule) => rule.includes("La IA propone"))) ctx.addIssue({ code: "custom", message: "AI proposal rule must be explicit" });
});
export const aiStrategySchema = z.object({ useNow: z.array(itemSchema).min(1), postpone: z.array(itemSchema).min(1), humanSupervision: z.array(itemSchema).min(1), doNotAutomate: z.array(itemSchema).min(1), guardrails: z.array(itemSchema).min(1), promotionCriteria: z.array(z.string().min(1)).min(1) }).strict();
export const executiveScenarioSchema = z.object({ scenario: z.literal("La junta directiva quiere todos los módulos entregados dentro de 18 meses."), memo: z.string().min(1), accept: z.array(z.string().min(1)).min(1), negotiate: z.array(z.string().min(1)).min(1), postpone: z.array(z.string().min(1)).min(1), risks: z.array(z.string().min(1)).min(1), phases: z.array(itemSchema).min(1), metrics: z.array(itemSchema).min(1), decision: z.string().min(1) }).strict();

export const presentationSchema = z.object({ navigation: navigationSchema, home: homeSchema, architecture: architectureSchema, integration: integrationSchema, dataModeling: dataModelingSchema, aiStrategy: aiStrategySchema, executiveScenario: executiveScenarioSchema }).strict();
