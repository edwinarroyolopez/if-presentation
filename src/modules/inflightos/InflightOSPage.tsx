import { BrainGraphLive, type BrainGraphSnapshot } from "./BrainGraphLive";
import graphSnapshot from "./graph-snapshot.json";
import styles from "./InflightOSPage.module.css";

type BrainModel = {
  snapshot: BrainGraphSnapshot;
  metrics: {
    nodes: number;
    links: number;
    projects: number;
    domains: number;
  };
};

const model = graphSnapshot as BrainModel;

export function InflightOSPage() {
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
