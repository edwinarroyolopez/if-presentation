import type { RoadmapPrinciple } from "@/types/roadmap";

export function RoadmapProjectPrinciples({ principles }: { principles: RoadmapPrinciple[] }) {
  return <section className="section" style={{ marginTop: 18 }}><header style={{ marginBottom: 16 }}><div className="kicker">Principios</div><p>Reglas de diseño y operación extraídas del documento fuente.</p></header><div className="grid grid-2">{principles.map((principle) => <article className="card" key={principle.title}><h3>{principle.title}</h3><p>{principle.description}</p></article>)}</div></section>;
}
