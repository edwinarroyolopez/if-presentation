import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { PresentationPageHero, Section } from "@/components/presentation/PresentationPrimitives";
import { getRoadmapCatalog, getRoadmapProjects } from "@/lib/roadmaps/roadmap-registry";
import { RoadmapIcon } from "@/components/roadmap/roadmap-icons";
import { RoadmapExecutiveSummary } from "./RoadmapExecutiveSummary";
import { RoadmapPortfolioRoad } from "./RoadmapPortfolioRoad";

export function RoadmapPortfolioPage() {
  const catalog = getRoadmapCatalog();
  const projects = getRoadmapProjects();
  return <>
    <PresentationPageHero eyebrow="Parte 2 · Roadmap InflightOS" title="Roadmap visual de ocho proyectos" lead={catalog.summary} meta={<div className="radar"><b>8</b></div>} />
    <nav aria-label="Breadcrumb" className="muted" style={{ marginBottom: 16 }}>InflightOS / Evaluación estratégica / <b>Roadmap</b></nav>
    <section className="section" style={{ marginTop: 18 }}><div className="kicker">Índice local</div><div className="grid grid-4" style={{ marginTop: 14 }}>{projects.map((project) => <Link className="card" href={`/roadmap/${project.slug}/`} key={project.id} data-roadmap-project={project.id}><Badge tone="info">Proyecto {project.order} de 8</Badge><div style={{ marginTop: 12, color: project.accent }}><RoadmapIcon name={project.icon} /></div><h3 style={{ marginTop: 10 }}>{project.title}</h3><p>{project.summary}</p></Link>)}</div></section>
    <RoadmapPortfolioRoad projects={projects} />
    <Section title="Resumen ejecutivo" description="La carretera muestra la secuencia; esta tabla conserva la lectura ejecutiva de los cuatro horizontes comunes."><RoadmapExecutiveSummary rows={catalog.executiveSummary} /></Section>
    <Section title="Secuencia y dependencias" description={catalog.sequenceExplanation}><div className="grid grid-2"><article className="card"><h3>Dependencias principales</h3><ul>{catalog.dependencies.map((item) => <li key={item}>{item}</li>)}</ul></article><article className="card"><h3>Contratación transversal</h3><ul>{catalog.hiring.map((item) => <li key={item}>{item}</li>)}</ul></article></div></Section>
    <section className="section" style={{ marginTop: 18 }}><div className="kicker">Continuidad de la presentación</div><p>{catalog.finalMessage}</p><div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}><Link className="btn ghost" href="/architecture-review/">Volver a Arquitectura</Link><Link className="btn primary" href="/systems-integration/">Continuar a Integraciones</Link></div></section>
  </>;
}
