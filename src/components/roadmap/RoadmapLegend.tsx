import styles from "./DynamicRoadmap.module.css";

export function RoadmapLegend({ count }: { count: number }) {
  return <div className={styles.toolbarGroup} aria-label="Leyenda del roadmap">
    <span className={styles.pill}>{count} estaciones</span>
    <span className={styles.pill}><span className={styles.legendDot} /> Estación activa</span>
    <span className={styles.pill}>Conectores curvos</span>
    <span className={styles.pill}>Carretera SVG multicapa</span>
  </div>;
}
