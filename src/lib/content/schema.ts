import { z } from "zod";

const toneSchema = z.enum(["info", "success", "warning", "danger", "neutral"]);
const itemSchema = z.object({ id: z.string().min(1), title: z.string().min(1), description: z.string().min(1), tone: toneSchema.optional() }).strict();

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
export const integrationSchema = z.object({ systems: z.array(itemSchema).length(6), endpoint: z.object({ method: z.literal("POST"), path: z.literal("/mission-completed"), steps: z.array(z.string().min(1)).min(6), errors: z.array(z.string().min(1)).min(1) }).strict(), events: z.array(z.object({ name: z.enum(["MissionCompleted", "MediaIngested", "SampleApproved", "InvoiceRequested"]), version: z.string().min(1), eventId: z.string().min(1), aggregateId: z.string().min(1), timestamp: z.string().min(1), payload: z.record(z.string(), z.unknown()), producer: z.string().min(1), consumers: z.array(z.string().min(1)).min(1), idempotency: z.string().min(1), failureHandling: z.string().min(1) }).strict()).length(4), failureHandling: z.array(itemSchema).min(1) }).strict().superRefine((value, ctx) => {
  const required = ["MissionCompleted", "MediaIngested", "SampleApproved", "InvoiceRequested"];
  if (value.events.map((event) => event.name).join(",") !== required.join(",")) ctx.addIssue({ code: "custom", message: "Missing required event order" });
});
export const dataModelingSchema = z.object({ entities: z.array(z.object({ name: z.enum(["Client", "MPO", "Project", "Mission", "MediaBatch", "Deliverable", "Invoice", "UserRole"]), responsibility: z.string().min(1), fields: z.array(z.string().min(1)).min(1), relationships: z.array(z.string().min(1)).min(1), owner: z.string().min(1), states: z.array(z.string().min(1)).min(1), lifecycle: z.array(z.string().min(1)).min(1), integrityRules: z.array(z.string().min(1)).min(1) }).strict()).length(8), relationships: z.array(itemSchema).min(1), lifecycles: z.array(itemSchema).min(1) }).strict();
export const aiStrategySchema = z.object({ useNow: z.array(itemSchema).min(1), postpone: z.array(itemSchema).min(1), humanSupervision: z.array(itemSchema).min(1), doNotAutomate: z.array(itemSchema).min(1), guardrails: z.array(itemSchema).min(1), promotionCriteria: z.array(z.string().min(1)).min(1) }).strict();
export const executiveScenarioSchema = z.object({ scenario: z.literal("La junta directiva quiere todos los módulos entregados dentro de 18 meses."), memo: z.string().min(1), accept: z.array(z.string().min(1)).min(1), negotiate: z.array(z.string().min(1)).min(1), postpone: z.array(z.string().min(1)).min(1), risks: z.array(z.string().min(1)).min(1), phases: z.array(itemSchema).min(1), metrics: z.array(itemSchema).min(1), decision: z.string().min(1) }).strict();

export const presentationSchema = z.object({ navigation: navigationSchema, home: homeSchema, architecture: architectureSchema, integration: integrationSchema, dataModeling: dataModelingSchema, aiStrategy: aiStrategySchema, executiveScenario: executiveScenarioSchema }).strict();
