import type { RoadmapMetricGroup } from "@/types/roadmap";

export function RoadmapProjectMetrics({ northStar, groups }: { northStar: { title: string; description: string }; groups: RoadmapMetricGroup[] }) {
  return <section className="section" style={{ marginTop: 18 }}><header style={{ marginBottom: 16 }}><div className="kicker">North Star Metric</div><h2>{northStar.title}</h2><p>{northStar.description}</p></header><div className="grid grid-3">{groups.map((group) => <article className="card" key={group.title}><h3>{group.title}</h3><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></section>;
}
