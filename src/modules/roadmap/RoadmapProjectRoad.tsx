"use client";

import { useState } from "react";
import { DynamicRoadmap, type DynamicRoadmapItem } from "@/components/roadmap/DynamicRoadmap";
import { RoadmapDensityToggle } from "@/components/roadmap/RoadmapDensityToggle";
import { RoadmapLegend } from "@/components/roadmap/RoadmapLegend";
import type { RoadmapProject } from "@/types/roadmap";
import type { RoadmapDensity } from "@/components/roadmap/roadmap-layout";
import { RoadmapHorizonDetail } from "./RoadmapHorizonDetail";

export function RoadmapProjectRoad({ project }: { project: RoadmapProject }) {
  const [density, setDensity] = useState<RoadmapDensity>("comfortable");
  const [selectedId, setSelectedId] = useState(() => {
    if (typeof window === "undefined") return project.horizons[0].id;
    const hash = window.location.hash.replace("#", "");
    return project.horizons.some((horizon) => horizon.id === hash) ? hash : project.horizons[0].id;
  });
  const selected = project.horizons.find((horizon) => horizon.id === selectedId) ?? project.horizons[0];
  const items: DynamicRoadmapItem[] = project.horizons.map((horizon, index) => ({ id: horizon.id, title: `${horizon.days} días · ${horizon.title}`, summary: horizon.summary, sequenceLabel: `Estación ${index + 1} · ${horizon.rangeLabel}`, icon: horizon.icon, tone: toneToColor(horizon.tone, project.accent) }));

  function select(id: string) {
    setSelectedId(id);
    if (typeof window !== "undefined") window.history.replaceState(null, "", `#${id}`);
  }

  return <section className="section" aria-labelledby="project-road" style={{ marginTop: 18 }}>
    <header style={{ marginBottom: 16 }}><div className="kicker" id="project-road">Carretera del proyecto</div><p>Cuatro estaciones: 30, 90, 180 y 365 días. La tarjeta resume; el panel conserva el detalle operativo.</p></header>
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
      <RoadmapLegend count={items.length} />
      <RoadmapDensityToggle density={density} onChange={setDensity} />
    </div>
    <DynamicRoadmap ariaLabel={`Roadmap del proyecto ${project.title}`} density={density} items={items} onSelect={select} selectedId={selectedId} variant="project" />
    <RoadmapHorizonDetail horizon={selected} />
  </section>;
}

function toneToColor(tone: string, fallback: string) {
  const map: Record<string, string> = { blue: "#51c0ff", green: "#65dfb2", amber: "#f0c66b", red: "#ff7f91", violet: "#b58cff", cyan: "#45d6ff", slate: "#8fa1b8" };
  return map[tone] ?? fallback;
}
