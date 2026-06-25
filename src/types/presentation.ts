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
  icon?: "brain";
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

export type IntegrationDomain = {
  id: "crm" | "flight-ops" | "flight-engine" | "image-ops" | "image-engine" | "analytics" | "ai-gateway";
  title: string;
  responsibility: string;
  icon: "handshake" | "clipboard-check" | "plane" | "image" | "cpu" | "bar-chart" | "sparkles";
  contract: "api" | "event" | "job" | "object";
};

export type IntegrationDialog = {
  id: "business-flow" | "integration-contracts" | "connections-permissions" | "resilience-traceability";
  label: string;
  title: string;
  eyebrow: string;
  icon: "route" | "workflow" | "key-round" | "activity";
  sections: { title: string; items: string[] }[];
};

export type IntegrationContent = {
  title: string;
  thesis: string;
  core: { title: string; subtitle: string; context: string[]; governance: string[]; description: string };
  connection: { title: string; subtitle: string; description: string; signals: string[]; attributes: string[]; formula: string[] };
  domains: IntegrationDomain[];
  contracts: { id: "api" | "event" | "job" | "object"; label: string; title: string; description: string }[];
  dialogs: IntegrationDialog[];
  footer: { primary: string; secondary: string };
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
  integration: IntegrationContent;
  dataModeling: { entities: DataEntity[]; relationships: ContentItem[]; lifecycles: ContentItem[] };
  aiStrategy: { useNow: ContentItem[]; postpone: ContentItem[]; humanSupervision: ContentItem[]; doNotAutomate: ContentItem[]; guardrails: ContentItem[]; promotionCriteria: string[] };
  executiveScenario: { scenario: string; memo: string; accept: string[]; negotiate: string[]; postpone: string[]; risks: string[]; phases: ContentItem[]; metrics: ContentItem[]; decision: string };
};
