import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { RoadmapIcon } from "@/components/roadmap/roadmap-icons";
import type { RoadmapProject } from "@/types/roadmap";

export function RoadmapProjectHero({ project, index, total }: { project: RoadmapProject; index: number; total: number }) {
  return <section className="page-hero"><div><nav aria-label="Breadcrumb" className="muted">InflightOS / Roadmaps / <b>{project.title}</b></nav><div className="eyebrow" style={{ marginTop: 16 }}>Parte 2 · Proyecto {index + 1} de {total}</div><h1>{project.title}</h1><p className="lead">{project.summary}</p><div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}><Badge tone="info">{project.sourceDocument}</Badge><Badge tone="success">4 horizontes</Badge></div></div><div className="hero-panel"><div style={{ color: project.accent }}><RoadmapIcon name={project.icon} size={96} /></div></div></section>;
}

export function RoadmapProjectNavigation({ previous, next }: { previous?: RoadmapProject; next?: RoadmapProject }) {
  return <nav aria-label="Navegación local de proyectos" className="section" style={{ marginTop: 18 }}><div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10 }}><Link className="btn ghost" href="/roadmap/">Volver al roadmap InflightOS</Link><div style={{ display: "flex", gap: 8 }}>{previous ? <Link className="btn ghost" href={`/roadmap/${previous.slug}/`}>Proyecto anterior</Link> : null}{next ? <Link className="btn primary" href={`/roadmap/${next.slug}/`}>Proyecto siguiente</Link> : null}</div></div></nav>;
}
