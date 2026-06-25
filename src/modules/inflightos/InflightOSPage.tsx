import { readFile } from "node:fs/promises";
import path from "node:path";
import { BrainGraphLive, type BrainGraphSnapshot } from "./BrainGraphLive";
import styles from "./InflightOSPage.module.css";

const GRAPHIFY_IF_PATH = path.join(process.cwd(), "..", "graphify-if");
const GLOBAL_GRAPH_PATH = path.join(GRAPHIFY_IF_PATH, "global", "if-global.graph.json");
const PROJECTS_MANIFEST_PATH = path.join(GRAPHIFY_IF_PATH, "manifests", "projects.json");
const DOMAINS_MANIFEST_PATH = path.join(GRAPHIFY_IF_PATH, "manifests", "domains.json");
const MAX_VISUAL_NODES = 420;
const MAX_VISUAL_LINKS = 860;

type GraphNode = {
  id: string;
  _project?: string;
  file_type?: string;
};

type GraphLink = {
  source: string | { id?: string };
  target: string | { id?: string };
  relation?: string;
  _project?: string;
};

type GlobalGraphPayload = {
  nodes?: GraphNode[];
  links?: GraphLink[];
  edges?: GraphLink[];
};

type ProjectsManifest = {
  projects?: Array<{ id: string; kind?: string }>;
};

type DomainsManifest = {
  domains?: Array<{ id: string }>;
};

type BrainModel = {
  snapshot: BrainGraphSnapshot;
  metrics: {
    nodes: number;
    links: number;
    projects: number;
    domains: number;
  };
};

const palette = ["#22d3ee", "#38bdf8", "#a78bfa", "#34d399", "#f59e0b", "#fb7185", "#60a5fa", "#2dd4bf"];

export async function InflightOSPage() {
  const model = await loadBrainModel();

  if (!model) {
    return (
      <section className={styles.page}>
        <div className={styles.heroCard}>
          <p className={styles.kicker}>Graphify IF global graph</p>
          <h1 className={styles.title}>InflightOS</h1>
          <p className={styles.description}>No encontramos el grafo global esperado en graphify-if.</p>
          <p className={styles.description}>Ruta esperada: {GLOBAL_GRAPH_PATH}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.heroCard}>
        <div>
          <p className={styles.kicker}>Graphify IF global graph</p>
          <h1 className={styles.title}>El cerebro vivo de InflightOS</h1>
          <p className={styles.description}>
            Una foto animada del grafo global: proyectos, dominios y conexiones compiladas por graphify-if sin exponer listas internas del codigo.
          </p>
        </div>
        <div className={styles.metricsGrid}>
          <Metric label="Nodos" value={model.metrics.nodes.toLocaleString("es")} />
          <Metric label="Links" value={model.metrics.links.toLocaleString("es")} />
          <Metric label="Proyectos" value={model.metrics.projects.toLocaleString("es")} />
          <Metric label="Dominios" value={model.metrics.domains.toLocaleString("es")} />
        </div>
      </div>

      <div className={styles.graphCard}>
        <BrainGraphLive snapshot={model.snapshot} />
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.metric}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

async function loadBrainModel(): Promise<BrainModel | null> {
  try {
    const [graph, projectsManifest, domainsManifest] = await Promise.all([
      readJson<GlobalGraphPayload>(GLOBAL_GRAPH_PATH),
      readJson<ProjectsManifest>(PROJECTS_MANIFEST_PATH),
      readJson<DomainsManifest>(DOMAINS_MANIFEST_PATH),
    ]);
    const nodes = graph.nodes ?? [];
    const links = graph.links ?? graph.edges ?? [];
    return createBrainModel(nodes, links, projectsManifest.projects ?? [], domainsManifest.domains ?? []);
  } catch {
    return null;
  }
}

async function readJson<T>(filePath: string): Promise<T> {
  return JSON.parse(await readFile(filePath, "utf8")) as T;
}

function createBrainModel(
  nodes: GraphNode[],
  links: GraphLink[],
  projects: Array<{ id: string; kind?: string }>,
  domains: Array<{ id: string }>,
): BrainModel {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const degree = new Map<string, number>();
  const linkProjectCounts = new Map<string, number>();

  for (const link of links) {
    const source = endpointId(link.source);
    const target = endpointId(link.target);
    if (!source || !target) {
      continue;
    }
    degree.set(source, (degree.get(source) ?? 0) + 1);
    degree.set(target, (degree.get(target) ?? 0) + 1);

    const project = link._project ?? projectFor(nodesById.get(source), source);
    linkProjectCounts.set(project, (linkProjectCounts.get(project) ?? 0) + 1);
  }

  const projectIds = projects.length > 0 ? projects.map((project) => project.id) : [...new Set(nodes.map((node) => projectFor(node, node.id)))];
  const projectColors = new Map(projectIds.map((projectId, index) => [projectId, palette[index % palette.length]]));
  const selectedIds = new Set<string>();
  const perProjectBudget = Math.max(28, Math.floor(MAX_VISUAL_NODES / Math.max(projectIds.length, 1)));

  for (const projectId of projectIds) {
    const candidates = nodes
      .filter((node) => projectFor(node, node.id) === projectId && (degree.get(node.id) ?? 0) > 0)
      .sort((a, b) => (degree.get(b.id) ?? 0) - (degree.get(a.id) ?? 0) || hash(a.id) - hash(b.id));
    for (const node of candidates.slice(0, perProjectBudget)) {
      selectedIds.add(node.id);
    }
  }

  const visualNodes = [...selectedIds]
    .map((id) => {
      const node = nodesById.get(id);
      const project = projectFor(node, id);
      return {
        id,
        project,
        weight: degree.get(id) ?? 1,
      };
    })
    .slice(0, MAX_VISUAL_NODES);
  const visualNodeIds = new Set(visualNodes.map((node) => node.id));
  const visualLinks = links
    .map((link) => ({
      source: endpointId(link.source),
      target: endpointId(link.target),
      relation: link.relation ?? "related",
    }))
    .filter((link) => visualNodeIds.has(link.source) && visualNodeIds.has(link.target))
    .sort((a, b) => (degree.get(b.source) ?? 0) + (degree.get(b.target) ?? 0) - ((degree.get(a.source) ?? 0) + (degree.get(a.target) ?? 0)))
    .slice(0, MAX_VISUAL_LINKS);

  return {
    metrics: {
      nodes: nodes.length,
      links: links.length,
      projects: projectIds.length,
      domains: domains.length,
    },
    snapshot: {
      projects: projectIds.map((projectId) => ({
        id: projectId,
        color: projectColors.get(projectId) ?? palette[0],
        nodes: nodes.filter((node) => projectFor(node, node.id) === projectId).length,
        links: linkProjectCounts.get(projectId) ?? 0,
      })),
      nodes: visualNodes,
      links: visualLinks,
    },
  };
}

function endpointId(endpoint: GraphLink["source"]) {
  return typeof endpoint === "string" ? endpoint : endpoint.id ?? "";
}

function projectFor(node: GraphNode | undefined, fallbackId: string) {
  return node?._project ?? fallbackId.split(":")[0] ?? "global";
}

function hash(value: string) {
  let result = 0;
  for (let index = 0; index < value.length; index += 1) {
    result = (result * 31 + value.charCodeAt(index)) >>> 0;
  }
  return result;
}
