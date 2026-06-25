"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Compass, FileText, Gauge, GitBranch, Layers3, Menu, ShieldAlert, Target, UsersRound } from "lucide-react";
import { DynamicRoadmap, type DynamicRoadmapItem } from "@/components/roadmap/DynamicRoadmap";
import { PresentationDialog, PresentationDialogBody, PresentationDialogFooter, PresentationDialogHeader } from "@/components/presentation/PresentationDialog";
import { CompactList, PresentationCallout, PresentationSlide, PresentationSlideBody, PresentationSlideFooter, PresentationSlideHeader } from "@/components/presentation/PresentationPrimitives";
import type { RoadmapProject } from "@/types/roadmap";
import { RoadmapExecutiveSummary } from "./RoadmapExecutiveSummary";
import { RoadmapZoomFrame } from "./RoadmapZoomFrame";

type DialogKey = "objective" | "metrics" | "scope" | "principles" | "dependencies" | "team" | "risks" | "executive" | "horizon" | "mobile-info";

const actions = [
  { key: "objective", label: "Objetivo", Icon: Target },
  { key: "metrics", label: "Métricas", Icon: Gauge },
  { key: "scope", label: "Alcance", Icon: Layers3 },
  { key: "principles", label: "Principios", Icon: Compass },
  { key: "dependencies", label: "Dependencias", Icon: GitBranch },
  { key: "team", label: "Equipo", Icon: UsersRound },
  { key: "risks", label: "Riesgos", Icon: ShieldAlert },
  { key: "executive", label: "Resumen", Icon: FileText },
] satisfies { key: DialogKey; label: string; Icon: typeof Target }[];

export function RoadmapProjectSlide({ index, next, previous, project, total }: { index: number; next?: RoadmapProject; previous?: RoadmapProject; project: RoadmapProject; total: number }) {
  const [selectedId, setSelectedId] = useState(project.horizons[0].id);
  const [dialog, setDialog] = useState<DialogKey | null>(null);
  const selected = project.horizons.find((horizon) => horizon.id === selectedId) ?? project.horizons[0];

  useEffect(() => {
    const selectFromHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace("#", ""));
      setSelectedId(project.horizons.some((horizon) => horizon.id === hash) ? hash : project.horizons[0].id);
    };
    selectFromHash();
    window.addEventListener("popstate", selectFromHash);
    return () => window.removeEventListener("popstate", selectFromHash);
  }, [project.horizons]);

  const items = useMemo<DynamicRoadmapItem[]>(() => project.horizons.map((horizon, horizonIndex) => ({
    id: horizon.id,
    title: `${horizon.days} días · ${horizon.title}`,
    summary: horizon.summary,
    sequenceLabel: `Estación ${horizonIndex + 1} · ${horizon.rangeLabel}`,
    icon: horizon.icon,
    tone: toneToColor(horizon.tone, project.accent),
  })), [project]);

  function select(id: string) {
    setSelectedId(id);
    if (typeof window !== "undefined") window.history.pushState(null, "", `#${id}`);
  }

  return <PresentationSlide className="roadmap-project-slide">
    <PresentationSlideHeader
      actions={<><ProjectActions onOpen={setDialog} /><button className="btn ghost info-actions-mobile" onClick={() => setDialog("mobile-info")} type="button"><Menu aria-hidden="true" size={16} /> Información</button></>}
      eyebrow={`Parte 2 · Proyecto ${index + 1} de ${total}`}
      meta={<><span>{selected.rangeLabel}</span><span>{index + 1}/{total}</span></>}
      thesis={project.summary}
      title={project.title.length > 46 ? project.shortTitle : project.title}
    />
    <PresentationSlideBody>
      <div className="roadmap-project-layout">
        <div className="roadmap-road-primary">
          <RoadmapZoomFrame><DynamicRoadmap ariaLabel={`Roadmap del proyecto ${project.title}`} density="dense" items={items} onSelect={select} selectedId={selectedId} variant="project" /></RoadmapZoomFrame>
        </div>
        <HorizonSummary horizon={selected} onExplore={() => setDialog("horizon")} />
      </div>
    </PresentationSlideBody>
    <PresentationSlideFooter>
      <div className="roadmap-local-nav"><Link className="btn ghost" href="/roadmap/">Volver al roadmap InflightOS</Link>{previous ? <Link className="btn ghost" href={`/roadmap/${previous.slug}/`}>Proyecto anterior</Link> : <span />}</div>
      <div className="roadmap-local-nav">{next ? <Link className="btn primary" href={`/roadmap/${next.slug}/`}>Proyecto siguiente</Link> : <Link className="btn primary" href="/systems-integration/">Continuar</Link>}</div>
    </PresentationSlideFooter>
    <ProjectDialogs dialog={dialog} onClose={() => setDialog(null)} project={project} selectedId={selectedId} />
  </PresentationSlide>;
}

function ProjectActions({ onOpen }: { onOpen: (key: DialogKey) => void }) {
  return <div className="presentation-action-bar" aria-label="Información del proyecto">{actions.map(({ Icon, key, label }) => <button aria-label={`Abrir ${label}`} className="info-action" key={key} onClick={() => onOpen(key)} type="button"><Icon aria-hidden="true" size={17} /><span className="info-action-tooltip">{label}</span></button>)}</div>;
}

function HorizonSummary({ horizon, onExplore }: { horizon: RoadmapProject["horizons"][number]; onExplore: () => void }) {
  return <article className="horizon-summary" data-active-horizon={horizon.id}>
    <div><span>Horizonte activo · {horizon.rangeLabel}</span><h3>{horizon.title}</h3><p>{horizon.result}</p><CompactList items={[...horizon.metrics.slice(0, 1), ...horizon.gate.slice(0, 1)]} limit={2} /></div>
    <button className="btn primary" onClick={onExplore} type="button">Explorar horizonte</button>
  </article>;
}

function ProjectDialogs({ dialog, onClose, project, selectedId }: { dialog: DialogKey | null; onClose: () => void; project: RoadmapProject; selectedId: string }) {
  const selected = project.horizons.find((horizon) => horizon.id === selectedId) ?? project.horizons[0];
  const open = (key: DialogKey) => dialog === key;
  return <>
    <InfoDialog id="project-objective-dialog" open={open("objective")} onClose={onClose} title="Objetivo y alcance" eyebrow={project.shortTitle}><div className="dialog-grid two"><PresentationCallout><b>Objetivo estratégico</b><p>{project.strategicObjective}</p></PresentationCallout><div className="dialog-panel"><h3>Decisión</h3><p>{project.subtitle}</p><p>{project.finalMessage}</p></div><ListPanel title="Incluido" items={project.scope.included} /><ListPanel title="Fuera o diferido" items={project.scope.deferred} /></div></InfoDialog>
    <InfoDialog id="project-metrics-dialog" open={open("metrics")} onClose={onClose} title="Métricas" eyebrow="North Star"><div className="dialog-grid"><PresentationCallout tone="success"><b>{project.northStarMetric.title}</b><p>{project.northStarMetric.description}</p></PresentationCallout><div className="dialog-grid three">{project.supportingMetrics.map((group) => <ListPanel items={group.items} key={group.title} title={group.title} />)}</div></div></InfoDialog>
    <InfoDialog id="project-scope-dialog" open={open("scope")} onClose={onClose} title="Alcance" eyebrow="Scope"><div className="dialog-grid two"><ListPanel title="Incluido" items={project.scope.included} /><ListPanel title="Diferido" items={project.scope.deferred} /></div></InfoDialog>
    <InfoDialog id="project-principles-dialog" open={open("principles")} onClose={onClose} title="Principios" eyebrow="Principios"><div className="dialog-grid two">{project.principles.map((principle, principleIndex) => <article className="dialog-panel" key={principle.title}><span className="num">{principleIndex + 1}</span><h3>{principle.title}</h3><p>{principle.description}</p></article>)}</div></InfoDialog>
    <InfoDialog id="project-dependencies-dialog" open={open("dependencies")} onClose={onClose} title="Mapa de dependencias" eyebrow="Dependencias"><div className="dependency-map-simple">{project.dependencies.map((dependency, depIndex) => <div className="dep-node-simple" key={dependency}><span>{String(depIndex + 1).padStart(2, "0")}</span><b>{dependency}</b></div>)}</div><PresentationCallout><b>Lectura</b><p>Las dependencias conectan producto, plataforma, datos y operación. No son checklist: determinan cuándo escalar el proyecto.</p></PresentationCallout></InfoDialog>
    <InfoDialog id="project-team-dialog" open={open("team")} onClose={onClose} title="Equipo recomendado" eyebrow="Capacidad"><div className="capacity-list">{project.team.map((role, roleIndex) => <div key={role}><span>{roleIndex < 3 ? "D0-D90" : roleIndex < 6 ? "D91-D180" : "D181+"}</span><b>{role}</b><p>Responsabilidad vinculada al horizonte y al gate de adopción.</p></div>)}</div></InfoDialog>
    <InfoDialog id="project-risks-dialog" open={open("risks")} onClose={onClose} title="Registro de riesgos" eyebrow="Riesgos"><table className="risk-table"><thead><tr><th>Riesgo</th><th>Impacto</th><th>Mitigación</th></tr></thead><tbody>{project.risks.map((risk) => <tr key={risk.title}><td>{risk.title}</td><td>Puede bloquear adopción, calidad o escalamiento del roadmap.</td><td>{risk.mitigation}</td></tr>)}</tbody></table></InfoDialog>
    <InfoDialog id="project-executive-dialog" open={open("executive")} onClose={onClose} title="Resumen ejecutivo" eyebrow="30 · 90 · 180 · 365"><RoadmapExecutiveSummary rows={project.executiveSummary} /><PresentationCallout><b>Conclusión</b><p>{project.finalMessage}</p><p><strong>Fuente:</strong> {project.sourceDocument}</p></PresentationCallout></InfoDialog>
    <InfoDialog id="project-horizon-dialog" open={open("horizon")} onClose={onClose} title={`${selected.rangeLabel} · ${selected.title}`} eyebrow="Detalle del horizonte"><HorizonDetailContent horizon={selected} /></InfoDialog>
    <InfoDialog id="project-mobile-info-dialog" open={open("mobile-info")} onClose={onClose} title="Información del proyecto" eyebrow="Categorías"><div className="dialog-grid two">{actions.map(({ Icon, key, label }) => <button className="dialog-panel info-menu-option" key={key} onClick={() => { onClose(); requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[aria-label='Abrir ${label}']`)?.click()); }} type="button"><Icon aria-hidden="true" size={18} /><b>{label}</b></button>)}</div></InfoDialog>
  </>;
}

function InfoDialog({ children, eyebrow, id, onClose, open, title }: { children: React.ReactNode; eyebrow: string; id: string; onClose: () => void; open: boolean; title: string }) {
  const titleId = `${id}-title`;
  return <PresentationDialog id={id} labelledBy={titleId} onClose={onClose} open={open}><PresentationDialogHeader eyebrow={eyebrow} id={titleId} title={title} /><PresentationDialogBody>{children}</PresentationDialogBody><PresentationDialogFooter>Escape cierra · Tab permanece dentro del modal</PresentationDialogFooter></PresentationDialog>;
}

function ListPanel({ items, title }: { items: string[]; title: string }) {
  return <article className="dialog-panel"><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>;
}

function HorizonDetailContent({ horizon }: { horizon: RoadmapProject["horizons"][number] }) {
  return <div className="dialog-grid horizon-detail-dialog"><PresentationCallout><b>Resultado esperado</b><p>{horizon.result}</p></PresentationCallout><div className="dialog-grid horizon-workstreams">{horizon.workstreams.map((workstream) => <article className="dialog-panel" key={workstream.id}><h3>{workstream.title}</h3><ul>{workstream.activities.map((activity) => <li key={activity}>{activity}</li>)}</ul><p><b>Entregable:</b> {workstream.deliverable}</p></article>)}</div><div className="dialog-grid horizon-signals"><ListPanel title="Dependencias" items={horizon.dependencies} /><ListPanel title="Equipo" items={horizon.team} /><ListPanel title="Gate" items={horizon.gate} /><ListPanel title="Métricas" items={horizon.metrics} /><ListPanel title="Riesgos" items={horizon.risks} /></div></div>;
}

function toneToColor(tone: string, fallback: string) {
  const map: Record<string, string> = { amber: "#f0c66b", blue: "#51c0ff", cyan: "#45d6ff", green: "#65dfb2", red: "#ff7f91", slate: "#8fa1b8", violet: "#b58cff" };
  return map[tone] ?? fallback;
}
