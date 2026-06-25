import type { RoadmapExecutiveRow } from "@/types/roadmap";

export function RoadmapExecutiveSummary({ rows }: { rows: RoadmapExecutiveRow[] }) {
  return <div className="table-wrap"><table><thead><tr><th>Horizonte</th><th>Objetivo</th><th>Resultado visible</th></tr></thead><tbody>{rows.map((row) => <tr key={row.horizon}><td>{row.horizon}</td><td>{row.objective}</td><td>{row.visibleResult}</td></tr>)}</tbody></table></div>;
}
