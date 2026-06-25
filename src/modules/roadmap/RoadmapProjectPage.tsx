import { Section } from "@/components/presentation/PresentationPrimitives";
import { getRoadmapProjectNavigation } from "@/lib/roadmaps/roadmap-registry";
import type { RoadmapProject } from "@/types/roadmap";
import { RoadmapExecutiveSummary } from "./RoadmapExecutiveSummary";
import { RoadmapProjectHero, RoadmapProjectNavigation } from "./RoadmapProjectHero";
import { RoadmapProjectMetrics } from "./RoadmapProjectMetrics";
import { RoadmapProjectPrinciples } from "./RoadmapProjectPrinciples";
import { RoadmapProjectRisks } from "./RoadmapProjectRisks";
import { RoadmapProjectRoad } from "./RoadmapProjectRoad";

export function RoadmapProjectPage({ project }: { project: RoadmapProject }) {
  const nav = getRoadmapProjectNavigation(project.slug);
  return <>
    <RoadmapProjectHero project={project} index={nav.index} total={nav.total} />
    <RoadmapProjectNavigation previous={nav.previous} next={nav.next} />
    <Section title="Objetivo estratégico" description={project.strategicObjective}><div className="grid grid-2"><article className="card"><h3>Incluido</h3><ul>{project.scope.included.map((item) => <li key={item}>{item}</li>)}</ul></article><article className="card"><h3>Fuera o diferido</h3><ul>{project.scope.deferred.map((item) => <li key={item}>{item}</li>)}</ul></article></div></Section>
    <RoadmapProjectMetrics northStar={project.northStarMetric} groups={project.supportingMetrics} />
    <RoadmapProjectPrinciples principles={project.principles} />
    <RoadmapProjectRoad project={project} />
    <Section title="Dependencias generales"><ul>{project.dependencies.map((item) => <li key={item}>{item}</li>)}</ul></Section>
    <Section title="Equipo recomendado"><div className="grid grid-3">{project.team.map((item) => <article className="card" key={item}><h3>{item}</h3></article>)}</div></Section>
    <RoadmapProjectRisks risks={project.risks} />
    <Section title="Resumen ejecutivo"><RoadmapExecutiveSummary rows={project.executiveSummary} /></Section>
    <section className="section" style={{ marginTop: 18 }}><div className="kicker">Mensaje final</div><p>{project.finalMessage}</p></section>
    <RoadmapProjectNavigation previous={nav.previous} next={nav.next} />
  </>;
}
