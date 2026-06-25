import { z } from "zod";

const iconSchema = z.enum(["plane", "building", "images", "finance", "compliance", "analytics", "people", "ai"]);
const toneSchema = z.enum(["blue", "green", "amber", "red", "violet", "cyan", "slate"]);
const idSchema = z.string().regex(/^[a-z0-9-]+$/);

export const roadmapMetricGroupSchema = z.object({
  title: z.string().min(1),
  items: z.array(z.string().min(1)).min(1),
}).strict();

export const roadmapPrincipleSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
}).strict();

export const roadmapRiskSchema = z.object({
  title: z.string().min(1),
  mitigation: z.string().min(1),
}).strict();

export const roadmapExecutiveRowSchema = z.object({
  horizon: z.string().min(1),
  objective: z.string().min(1),
  visibleResult: z.string().min(1),
}).strict();

export const roadmapWorkstreamSchema = z.object({
  id: idSchema,
  title: z.string().min(1),
  activities: z.array(z.string().min(1)).min(1),
  deliverable: z.string().min(1),
}).strict();

export const roadmapHorizonSchema = z.object({
  id: idSchema,
  days: z.union([z.literal(30), z.literal(90), z.literal(180), z.literal(365)]),
  rangeLabel: z.string().min(1),
  title: z.string().min(1),
  result: z.string().min(1),
  summary: z.string().min(1),
  icon: iconSchema,
  tone: toneSchema,
  workstreams: z.array(roadmapWorkstreamSchema).min(1),
  dependencies: z.array(z.string().min(1)).min(1),
  team: z.array(z.string().min(1)).min(1),
  gate: z.array(z.string().min(1)).min(1),
  metrics: z.array(z.string().min(1)).min(1),
  risks: z.array(z.string().min(1)).min(1),
}).strict();

export const roadmapProjectSchema = z.object({
  id: z.string().regex(/^p[1-8]$/),
  slug: idSchema,
  order: z.number().int().min(1).max(8),
  title: z.string().min(1),
  shortTitle: z.string().min(1),
  subtitle: z.string().min(1),
  summary: z.string().min(1),
  sourceDocument: z.string().regex(/^docs\/roadmaps\/p[1-8]-[a-z0-9-]+\.md$/),
  icon: iconSchema,
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  strategicObjective: z.string().min(1),
  northStarMetric: z.object({ title: z.string().min(1), description: z.string().min(1) }).strict(),
  supportingMetrics: z.array(roadmapMetricGroupSchema).min(1),
  principles: z.array(roadmapPrincipleSchema).min(1),
  scope: z.object({ included: z.array(z.string().min(1)).min(1), deferred: z.array(z.string().min(1)) }).strict(),
  horizons: z.array(roadmapHorizonSchema).length(4),
  dependencies: z.array(z.string().min(1)).min(1),
  team: z.array(z.string().min(1)).min(1),
  risks: z.array(roadmapRiskSchema).min(1),
  executiveSummary: z.array(roadmapExecutiveRowSchema).length(4),
  finalMessage: z.string().min(1),
}).strict().superRefine((project, ctx) => {
  const horizonOrder = project.horizons.map((horizon) => horizon.days).join(",");
  if (horizonOrder !== "30,90,180,365") ctx.addIssue({ code: "custom", message: "Horizons must be 30,90,180,365" });
  const horizonIds = project.horizons.map((horizon) => horizon.id);
  if (new Set(horizonIds).size !== horizonIds.length) ctx.addIssue({ code: "custom", message: "Duplicate horizon ids" });
});

export const roadmapCatalogSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  sequenceExplanation: z.string().min(1),
  dependencies: z.array(z.string().min(1)).min(1),
  hiring: z.array(z.string().min(1)).min(1),
  executiveSummary: z.array(roadmapExecutiveRowSchema).min(4),
  finalMessage: z.string().min(1),
}).strict();

export const roadmapPortfolioSchema = z.object({
  catalog: roadmapCatalogSchema,
  projects: z.array(roadmapProjectSchema).length(8),
}).strict().superRefine((value, ctx) => {
  const orders = value.projects.map((project) => project.order).join(",");
  if (orders !== "1,2,3,4,5,6,7,8") ctx.addIssue({ code: "custom", message: "Project order must be 1..8" });
  for (const field of ["id", "slug"] as const) {
    const values = value.projects.map((project) => project[field]);
    if (new Set(values).size !== values.length) ctx.addIssue({ code: "custom", message: `Duplicate project ${field}` });
  }
});
