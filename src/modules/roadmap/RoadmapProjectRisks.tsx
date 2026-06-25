import type { RoadmapRisk } from "@/types/roadmap";

export function RoadmapProjectRisks({ risks }: { risks: RoadmapRisk[] }) {
  return <section className="section" style={{ marginTop: 18 }}><header style={{ marginBottom: 16 }}><div className="kicker">Riesgos principales</div><p>Riesgos materiales y mitigaciones propuestas.</p></header><div className="grid grid-3">{risks.map((risk) => <article className="card" key={risk.title}><h3>{risk.title}</h3><p>{risk.mitigation}</p></article>)}</div></section>;
}
