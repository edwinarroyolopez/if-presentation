"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FileText, GitBranch, ListTree, UsersRound } from "lucide-react";
import { DynamicRoadmap, type DynamicRoadmapItem } from "@/components/roadmap/DynamicRoadmap";
import { RoadmapIcon } from "@/components/roadmap/roadmap-icons";
import { PresentationDialog, PresentationDialogBody, PresentationDialogFooter, PresentationDialogHeader } from "@/components/presentation/PresentationDialog";
import { PresentationCallout, PresentationSlide, PresentationSlideBody, PresentationSlideFooter, PresentationSlideHeader } from "@/components/presentation/PresentationPrimitives";
import type { RoadmapCatalog, RoadmapProject } from "@/types/roadmap";
import { RoadmapExecutiveSummary } from "./RoadmapExecutiveSummary";
import { RoadmapZoomFrame } from "./RoadmapZoomFrame";

type PortfolioDialog = "sequence" | "dependencies" | "hiring" | "executive" | null;

export function RoadmapPortfolioSlide({ catalog, projects }: { catalog: RoadmapCatalog; projects: RoadmapProject[] }) {
  const [selectedId, setSelectedId] = useState(projects[0]?.id);
  const [dialog, setDialog] = useState<PortfolioDialog>(null);
  const selected = projects.find((project) => project.id === selectedId) ?? projects[0];
  const items = useMemo<DynamicRoadmapItem[]>(() => projects.map((project) => ({ id: project.id, title: project.shortTitle, summary: project.summary, sequenceLabel: `Proyecto ${project.order} de 8`, icon: project.icon, tone: project.accent })), [projects]);

  return <PresentationSlide className="roadmap-portfolio-slide">
    <PresentationSlideHeader
      actions={<div className="presentation-action-bar" aria-label="Información del portfolio"><InfoButton label="Secuencia" onClick={() => setDialog("sequence")}><ListTree aria-hidden="true" size={17} /></InfoButton><InfoButton label="Dependencias" onClick={() => setDialog("dependencies")}><GitBranch aria-hidden="true" size={17} /></InfoButton><InfoButton label="Contratación" onClick={() => setDialog("hiring")}><UsersRound aria-hidden="true" size={17} /></InfoButton><InfoButton label="Resumen" onClick={() => setDialog("executive")}><FileText aria-hidden="true" size={17} /></InfoButton></div>}
      eyebrow="Parte 2 · Roadmap InflightOS"
      meta={<><span>8 proyectos</span><span>Portfolio</span></>}
      thesis={catalog.summary}
      title="Roadmap visual de ocho proyectos"
    />
    <PresentationSlideBody>
      <div className="portfolio-slide-layout">
        <div className="roadmap-road-primary"><RoadmapZoomFrame><DynamicRoadmap ariaLabel="Roadmap global de ocho proyectos InflightOS" density="dense" items={items} onSelect={setSelectedId} renderHref={(item) => `/roadmap/${projects.find((project) => project.id === item.id)?.slug ?? ""}/`} selectedId={selectedId} variant="portfolio" /></RoadmapZoomFrame></div>
        <aside className="portfolio-active-card" aria-live="polite">
          <div style={{ color: selected.accent }}><RoadmapIcon name={selected.icon} size={34} /></div>
          <span className="eyebrow">Proyecto {selected.order} de 8</span>
          <h3>{selected.title}</h3>
          <p>{selected.summary}</p>
          <Link className="btn primary" href={`/roadmap/${selected.slug}/`}>Entrar al proyecto</Link>
          <div className="portfolio-mini-list" style={{ marginTop: 12 }}>{projects.map((project) => <Link className={project.id === selected.id ? "active" : ""} href={`/roadmap/${project.slug}/`} key={project.id}><span>{String(project.order).padStart(2, "0")}</span><b>{project.shortTitle}</b></Link>)}</div>
        </aside>
      </div>
    </PresentationSlideBody>
    <PresentationSlideFooter><span>InflightOS · Parte 2 de 6</span><span>{catalog.finalMessage}</span><Link className="btn ghost" href="/systems-integration/">Continuar</Link></PresentationSlideFooter>
    <PortfolioDialogs catalog={catalog} dialog={dialog} onClose={() => setDialog(null)} />
  </PresentationSlide>;
}

function InfoButton({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return <button aria-label={`Abrir ${label}`} className="info-action" onClick={onClick} type="button">{children}<span className="info-action-tooltip">{label}</span></button>;
}

function PortfolioDialogs({ catalog, dialog, onClose }: { catalog: RoadmapCatalog; dialog: PortfolioDialog; onClose: () => void }) {
  return <>
    <Dialog id="portfolio-sequence-dialog" open={dialog === "sequence"} onClose={onClose} title="Secuencia de inversión" eyebrow="Secuencia"><PresentationCallout><b>Lectura ejecutiva</b><p>{catalog.sequenceExplanation}</p></PresentationCallout></Dialog>
    <Dialog id="portfolio-dependencies-dialog" open={dialog === "dependencies"} onClose={onClose} title="Dependencias globales" eyebrow="Dependencias"><div className="dependency-map-simple">{catalog.dependencies.map((dependency, index) => <div className="dep-node-simple" key={dependency}><span>{String(index + 1).padStart(2, "0")}</span><b>{dependency}</b></div>)}</div></Dialog>
    <Dialog id="portfolio-hiring-dialog" open={dialog === "hiring"} onClose={onClose} title="Contratación transversal" eyebrow="Capacidad"><div className="capacity-list">{catalog.hiring.map((item, index) => <div key={item}><span>{index < 2 ? "D0-D90" : index < 4 ? "D91-D180" : "D181+"}</span><b>{item}</b><p>Capacidad vinculada a reducción de riesgo y secuencia del portfolio.</p></div>)}</div></Dialog>
    <Dialog id="portfolio-executive-dialog" open={dialog === "executive"} onClose={onClose} title="Resumen ejecutivo" eyebrow="30 · 90 · 180 · 365"><RoadmapExecutiveSummary rows={catalog.executiveSummary} /><PresentationCallout><b>Conclusión</b><p>{catalog.finalMessage}</p></PresentationCallout></Dialog>
  </>;
}

function Dialog({ children, eyebrow, id, onClose, open, title }: { children: React.ReactNode; eyebrow: string; id: string; onClose: () => void; open: boolean; title: string }) {
  const titleId = `${id}-title`;
  return <PresentationDialog id={id} labelledBy={titleId} onClose={onClose} open={open}><PresentationDialogHeader eyebrow={eyebrow} id={titleId} title={title} /><PresentationDialogBody>{children}</PresentationDialogBody><PresentationDialogFooter>Contenido preservado desde `src/data/roadmaps/catalog.json`.</PresentationDialogFooter></PresentationDialog>;
}
