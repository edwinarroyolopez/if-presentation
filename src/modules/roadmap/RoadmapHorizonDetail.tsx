import type { RoadmapHorizon } from "@/types/roadmap";

export function RoadmapHorizonDetail({ horizon }: { horizon: RoadmapHorizon }) {
  return <article className="card" style={{ marginTop: 16 }} data-roadmap-horizon={horizon.id}>
    <div className="kicker">Detalle seleccionado · {horizon.rangeLabel}</div>
    <h3 style={{ marginTop: 8 }}>{horizon.title}</h3>
    <p>{horizon.result}</p>
    <div className="grid grid-2" style={{ marginTop: 14 }}>
      {horizon.workstreams.map((workstream) => <div className="diagram-node" key={workstream.id}><h4>{workstream.title}</h4><ul>{workstream.activities.map((item) => <li key={item}>{item}</li>)}</ul><p><b>Entregable:</b> {workstream.deliverable}</p></div>)}
    </div>
    <div className="grid grid-4" style={{ marginTop: 14 }}>
      <List title="Dependencias" items={horizon.dependencies} />
      <List title="Equipo" items={horizon.team} />
      <List title="Gate" items={horizon.gate} />
      <List title="Métricas y riesgos" items={[...horizon.metrics, ...horizon.risks]} />
    </div>
  </article>;
}

function List({ title, items }: { title: string; items: string[] }) {
  return <div className="diagram-node"><h4>{title}</h4><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}
