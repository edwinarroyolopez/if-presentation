export type RoadmapIconName = "plane" | "building" | "images" | "finance" | "compliance" | "analytics" | "people" | "ai";

export type RoadmapTone = "blue" | "green" | "amber" | "red" | "violet" | "cyan" | "slate";

export type RoadmapMetricGroup = {
  title: string;
  items: string[];
};

export type RoadmapPrinciple = {
  title: string;
  description: string;
};

export type RoadmapWorkstream = {
  id: string;
  title: string;
  activities: string[];
  deliverable: string;
};

export type RoadmapHorizon = {
  id: string;
  days: 30 | 90 | 180 | 365;
  rangeLabel: string;
  title: string;
  result: string;
  summary: string;
  icon: RoadmapIconName;
  tone: RoadmapTone;
  workstreams: RoadmapWorkstream[];
  dependencies: string[];
  team: string[];
  gate: string[];
  metrics: string[];
  risks: string[];
};

export type RoadmapRisk = {
  title: string;
  mitigation: string;
};

export type RoadmapExecutiveRow = {
  horizon: string;
  objective: string;
  visibleResult: string;
};

export type RoadmapProject = {
  id: string;
  slug: string;
  order: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  summary: string;
  sourceDocument: string;
  icon: RoadmapIconName;
  accent: string;
  strategicObjective: string;
  northStarMetric: {
    title: string;
    description: string;
  };
  supportingMetrics: RoadmapMetricGroup[];
  principles: RoadmapPrinciple[];
  scope: {
    included: string[];
    deferred: string[];
  };
  horizons: RoadmapHorizon[];
  dependencies: string[];
  team: string[];
  risks: RoadmapRisk[];
  executiveSummary: RoadmapExecutiveRow[];
  finalMessage: string;
};

export type RoadmapCatalog = {
  title: string;
  summary: string;
  sequenceExplanation: string;
  dependencies: string[];
  hiring: string[];
  executiveSummary: RoadmapExecutiveRow[];
  finalMessage: string;
};
