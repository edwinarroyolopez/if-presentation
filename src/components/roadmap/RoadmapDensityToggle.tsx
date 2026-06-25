"use client";

import type { RoadmapDensity } from "./roadmap-layout";
import styles from "./DynamicRoadmap.module.css";

export function RoadmapDensityToggle({ density, onChange }: { density: RoadmapDensity; onChange: (density: RoadmapDensity) => void }) {
  return <div className={styles.toolbarGroup} aria-label="Selector de densidad">
    <button className={styles.densityButton} type="button" aria-pressed={density === "comfortable"} onClick={() => onChange("comfortable")}>Amplio</button>
    <button className={styles.densityButton} type="button" aria-pressed={density === "dense"} onClick={() => onChange("dense")}>Denso</button>
  </div>;
}
