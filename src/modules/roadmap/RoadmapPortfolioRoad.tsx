"use client";

import { useState } from "react";
import { DynamicRoadmap, type DynamicRoadmapItem } from "@/components/roadmap/DynamicRoadmap";
import { RoadmapDensityToggle } from "@/components/roadmap/RoadmapDensityToggle";
import { RoadmapLegend } from "@/components/roadmap/RoadmapLegend";
import type { RoadmapProject } from "@/types/roadmap";
import type { RoadmapDensity } from "@/components/roadmap/roadmap-layout";

export function RoadmapPortfolioRoad({ projects }: { projects: RoadmapProject[] }) {
  const [density, setDensity] = useState<RoadmapDensity>("comfortable");
  const [selectedId, setSelectedId] = useState(projects[0]?.id);
  const items: DynamicRoadmapItem[] = projects.map((project) => ({ id: project.id, title: project.shortTitle, summary: project.summary, sequenceLabel: `Proyecto ${project.order} de 8`, icon: project.icon, tone: project.accent }));
  return <section className="section" aria-labelledby="roadmap-portfolio-road" style={{ marginTop: 18 }}>
    <header style={{ marginBottom: 16 }}><div className="kicker" id="roadmap-portfolio-road">Carretera dinámica</div><p>Selecciona una estación o abre el roadmap individual desde la tarjeta asociada.</p></header>
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
      <RoadmapLegend count={projects.length} />
      <RoadmapDensityToggle density={density} onChange={setDensity} />
    </div>
    <DynamicRoadmap ariaLabel="Roadmap global de ocho proyectos InflightOS" density={density} items={items} onSelect={setSelectedId} renderHref={(item) => `/roadmap/${projects.find((project) => project.id === item.id)?.slug ?? ""}/`} selectedId={selectedId} variant="portfolio" />
  </section>;
}
