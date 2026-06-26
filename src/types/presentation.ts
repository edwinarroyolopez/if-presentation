export type Tone = "info" | "success" | "warning" | "danger" | "neutral";

export type ContentItem = {
  id: string;
  title: string;
  description: string;
  tone?: Tone;
};

export type AIStrategyIcon = "activity" | "badge-check" | "bar-chart" | "bot" | "braces" | "database" | "file-text" | "gateway" | "handshake" | "image" | "landmark" | "list-checks" | "plane" | "scale" | "scan-check" | "shield-check" | "sparkles" | "user-check" | "users";

export type AIStrategyArchitectureStep = {
  id: string;
  title: string;
  description: string;
  icon: AIStrategyIcon;
};

export type AIStrategyPriority = {
  id: string;
  title: string;
  description: string;
  authority: string;
  icon: AIStrategyIcon;
};

export type AIStrategyDomain = {
  id: string;
  title: string;
  summary: string;
  immediateUse: string;
  authorityLimit: string;
  icon: AIStrategyIcon;
};

export type AIStrategyAuthorityLimit = {
  id: string;
  title: string;
  description: string;
  icon: AIStrategyIcon;
};

export type AIStrategyContent = {
  sourceDocument: "docs/F7-AI-strategy.md";
  title: string;
  thesis: string;
  architecturePattern: {
    label: string;
    note: string;
    noDirectWrite: string;
    steps: AIStrategyArchitectureStep[];
  };
  immediatePriorities: AIStrategyPriority[];
  domains: AIStrategyDomain[];
  authorityPrinciple: string;
  authorityLimits: AIStrategyAuthorityLimit[];
  laterWithEvidence: {
    label: string;
    summary: string;
    conditions: string[];
    cases: string[];
  };
  promotionRule: string;
  productionGates: string[];
  executiveRecommendation: string[];
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

export type DataDomainId = "p1" | "p2" | "p3" | "p4" | "p5" | "p6" | "p7" | "p8";
export type DataDomainIcon = "plane" | "building" | "images" | "finance" | "compliance" | "analytics" | "people" | "ai";
export type DataRelationType = "Referencia por ID" | "Comando API" | "Evento" | "Read model" | "Regla de readiness" | "Recomendación asistida";

export type DataDomain = {
  id: DataDomainId;
  order: number;
  shortName: string;
  fullName: string;
  type: "core" | "transversal";
  owner: string;
  sourceOfTruth: string;
  icon: DataDomainIcon;
  functionalVerb: string;
  executiveSummary: string;
  primaryEntities: string[];
  lifecycle: string[];
  integrityRules: string[];
  events: string[];
  sourceDocument: string;
};

export type DataValueStage = {
  id: string;
  domainId: DataDomainId;
  label: string;
  owner: string;
  handoff: string;
};

export type DataCrossDomainLink = {
  id: string;
  from: DataDomainId;
  to: DataDomainId;
  type: DataRelationType;
  label: string;
  mechanism: string;
  initiator: string;
  receiver: string;
  cardinality: string;
  sharedIds: string[];
  events: string[];
};

export type DataLifecycleHighlight = {
  domainId: DataDomainId;
  title: string;
  states: string[];
  alternates: string[];
};

export type DataModelingContent = {
  title: string;
  thesis: string;
  meta: string[];
  valueStream: { title: string; summary: string; stages: DataValueStage[] };
  domains: DataDomain[];
  crossDomainLinks: DataCrossDomainLink[];
  lifecycleHighlights: DataLifecycleHighlight[];
  governanceRules: { id: string; title: string; description: string }[];
  footerInsight: { left: string; callout: string; badge: string };
};

export type PresentationContent = {
  navigation: NavigationContent;
  home: { title: string; intro: string; systems: string[]; parts: ContentItem[]; recommendation: string };
  architecture: { summary: string; strengths: ContentItem[]; risks: ContentItem[]; deferred: ContentItem[]; priorities: ContentItem[] };
  integration: IntegrationContent;
  dataModeling: DataModelingContent;
  aiStrategy: AIStrategyContent;
  executiveScenario: { scenario: string; memo: string; accept: string[]; negotiate: string[]; postpone: string[]; risks: string[]; phases: ContentItem[]; metrics: ContentItem[]; decision: string };
};
