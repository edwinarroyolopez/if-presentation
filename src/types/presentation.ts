export type Tone = "info" | "success" | "warning" | "danger" | "neutral";

export type ContentItem = {
  id: string;
  title: string;
  description: string;
  tone?: Tone;
};

export type NavigationItem = {
  id: string;
  label: string;
  shortLabel: string;
  route: string;
  part: number;
};

export type NavigationContent = {
  brand: string;
  subtitle: string;
  items: NavigationItem[];
};

export type EventContract = {
  name: "MissionCompleted" | "MediaIngested" | "SampleApproved" | "InvoiceRequested";
  version: string;
  eventId: string;
  aggregateId: string;
  timestamp: string;
  payload: Record<string, unknown>;
  producer: string;
  consumers: string[];
  idempotency: string;
  failureHandling: string;
};

export type DataEntity = {
  name: "Client" | "MPO" | "Project" | "Mission" | "MediaBatch" | "Deliverable" | "Invoice" | "UserRole";
  responsibility: string;
  fields: string[];
  relationships: string[];
  owner: string;
  states: string[];
  lifecycle: string[];
  integrityRules: string[];
};

export type PresentationContent = {
  navigation: NavigationContent;
  home: { title: string; intro: string; systems: string[]; parts: ContentItem[]; recommendation: string };
  architecture: { summary: string; strengths: ContentItem[]; risks: ContentItem[]; deferred: ContentItem[]; priorities: ContentItem[] };
  roadmap: { phases: Array<{ days: 30 | 90 | 180 | 365; title: string; deliverables: string[]; risks: string[]; exitCriteria: string[] }>; dependencies: ContentItem[]; hiring: ContentItem[] };
  integration: { systems: ContentItem[]; endpoint: { method: "POST"; path: "/mission-completed"; steps: string[]; errors: string[] }; events: EventContract[]; failureHandling: ContentItem[] };
  dataModeling: { entities: DataEntity[]; relationships: ContentItem[]; lifecycles: ContentItem[] };
  aiStrategy: { useNow: ContentItem[]; postpone: ContentItem[]; humanSupervision: ContentItem[]; doNotAutomate: ContentItem[]; guardrails: ContentItem[]; promotionCriteria: string[] };
  executiveScenario: { scenario: string; memo: string; accept: string[]; negotiate: string[]; postpone: string[]; risks: string[]; phases: ContentItem[]; metrics: ContentItem[]; decision: string };
};
