import { Fragment } from "react";
import { getPresentationContent } from "@/lib/content";
import { Badge } from "@/components/ui/Badge";
import { ItemGrid, PresentationPageHero, Section } from "@/components/presentation/PresentationPrimitives";

export function RoadmapPage() {
  const { roadmap } = getPresentationContent();
  return <><PresentationPageHero eyebrow="Parte 2 · Roadmap ERP" title="Roadmap 30 / 90 / 180 / 365 días" lead="Una carretera operativa inspirada en la referencia visual: primero se ensancha el camino, después se suman estaciones y dependencias." meta={<div className="radar"><b>365</b></div>} /><Section title="Timeline de escritorio y móvil" description="En escritorio funciona como horizonte; en móvil cae verticalmente sin perder entregables."><div className="timeline">{roadmap.phases.map((phase) => <article className="card" key={phase.days}><Badge tone="info">{phase.days} días</Badge><h3 style={{ marginTop: 12 }}>{phase.title}</h3><h4>Entregables</h4><ul>{phase.deliverables.map((item) => <li key={item}>{item}</li>)}</ul><h4>Riesgos</h4><ul>{phase.risks.map((item) => <li key={item}>{item}</li>)}</ul><h4>Criterios para avanzar</h4><ul>{phase.exitCriteria.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></Section><Section title="Dependencias visuales"><div className="diagram-flow">{roadmap.dependencies.map((item, index) => <Fragment key={item.id}><article className="diagram-node"><Badge tone={item.tone}>{index + 1}</Badge><h3>{item.title}</h3><p>{item.description}</p></article>{index < roadmap.dependencies.length - 1 ? <span className="arrow">→</span> : null}</Fragment>)}</div></Section><Section title="Contratación por etapa"><ItemGrid items={roadmap.hiring} columns={4} /></Section></>;
}
