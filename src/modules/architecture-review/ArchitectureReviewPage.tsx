"use client";

import { useState } from "react";
import { BadgeCheck, Clock3, ListOrdered, Menu, TriangleAlert } from "lucide-react";
import { RoadmapIcon } from "@/components/roadmap/roadmap-icons";
import { PresentationDialog, PresentationDialogBody, PresentationDialogFooter, PresentationDialogHeader } from "@/components/presentation/PresentationDialog";
import { PresentationSlide, PresentationSlideBody, PresentationSlideFooter, PresentationSlideHeader } from "@/components/presentation/PresentationPrimitives";
import { getPresentationContent } from "@/lib/content";
import type { ArchitectureContent, ArchitectureItem, ArchitecturePriority } from "@/types/presentation";

type ArchitectureDialogKey = "strengths" | "risks" | "deferred" | "priorities" | "mobile-info";

const architectureActions = [
  { key: "strengths", Icon: BadgeCheck },
  { key: "risks", Icon: TriangleAlert },
  { key: "deferred", Icon: Clock3 },
  { key: "priorities", Icon: ListOrdered },
] satisfies { key: Exclude<ArchitectureDialogKey, "mobile-info">; Icon: typeof BadgeCheck }[];

export function ArchitectureReviewPage() {
  const { architecture } = getPresentationContent();
  const [dialog, setDialog] = useState<ArchitectureDialogKey | null>(null);
  const mvpPriorities = architecture.priorities.filter((priority) => priority.phase === "mvp");

  return <PresentationSlide className="architecture-review-slide">
    <PresentationSlideHeader
      actions={<><ArchitectureActions architecture={architecture} onOpen={setDialog} /><button className="btn ghost info-actions-mobile" onClick={() => setDialog("mobile-info")} type="button"><Menu aria-hidden="true" size={16} /> Información</button></>}
      eyebrow={architecture.eyebrow}
      meta={<>{architecture.metadata.map((item) => <span key={item}>{item}</span>)}</>}
      thesis={architecture.thesis}
      title={architecture.title}
    />
    <PresentationSlideBody>
      <main className="architecture-premium-layout" aria-label={architecture.decision.headline}>
        <section className="architecture-executive-card" aria-labelledby="architecture-decision-title">
          <span>{architecture.decision.kicker}</span>
          <h2 id="architecture-decision-title">{architecture.decision.headline}</h2>
          <p>{architecture.decision.summary}</p>
          <div className="architecture-risk-callout"><b>{architecture.primaryRisk.label}</b><p>{architecture.primaryRisk.text}</p></div>
          <div className="architecture-after-mvp" aria-label="Después del MVP"><small>Después del MVP</small><div>{architecture.deferred.map((item) => <span key={item.id}>{item.shortTitle}</span>)}</div></div>
        </section>
        <section className="architecture-sequence-panel" aria-labelledby="architecture-sequence-title">
          <header><span id="architecture-sequence-title">Secuencia inicial</span><b>3 frentes MVP</b></header>
          <ol className="architecture-sequence-list">{mvpPriorities.map((priority) => <ArchitectureSequenceItem key={priority.id} priority={priority} />)}</ol>
        </section>
      </main>
    </PresentationSlideBody>
    <PresentationSlideFooter><span>{architecture.footerInsight.label}</span><span>{architecture.footerInsight.text}</span><b className="architecture-footer-badge">{architecture.footerInsight.badge}</b></PresentationSlideFooter>
    <ArchitectureDialogs architecture={architecture} dialog={dialog} onClose={() => setDialog(null)} onOpen={setDialog} />
  </PresentationSlide>;
}

function ArchitectureActions({ architecture, onOpen }: { architecture: ArchitectureContent; onOpen: (key: ArchitectureDialogKey) => void }) {
  return <div className="presentation-action-bar" aria-label="Información de arquitectura">
    {architectureActions.map(({ Icon, key }) => {
      const label = architecture.dialogs[key].label;
      return <button aria-label={`Abrir ${label}`} className="info-action" key={key} onClick={() => onOpen(key)} type="button"><Icon aria-hidden="true" size={17} /><span className="info-action-tooltip">{label}</span></button>;
    })}
  </div>;
}

function ArchitectureSequenceItem({ priority }: { priority: ArchitecturePriority }) {
  return <li>
    <div className="architecture-sequence-marker"><RoadmapIcon name={priority.icon} size={24} /><span>{String(priority.order).padStart(2, "0")}</span></div>
    <div><h3>{priority.shortTitle}</h3><p>{priority.description}</p></div>
  </li>;
}

function ArchitectureDialogs({ architecture, dialog, onClose, onOpen }: { architecture: ArchitectureContent; dialog: ArchitectureDialogKey | null; onClose: () => void; onOpen: (key: ArchitectureDialogKey) => void }) {
  const open = (key: ArchitectureDialogKey) => dialog === key;
  return <>
    <ArchitectureDialog dialog={architecture.dialogs.strengths} id="architecture-strengths-dialog" open={open("strengths")} onClose={onClose}><ArchitectureItemGrid items={architecture.strengths} /></ArchitectureDialog>
    <ArchitectureDialog dialog={architecture.dialogs.risks} id="architecture-risks-dialog" open={open("risks")} onClose={onClose}><ArchitectureNumberedList items={architecture.risks} /></ArchitectureDialog>
    <ArchitectureDialog dialog={architecture.dialogs.deferred} id="architecture-deferred-dialog" open={open("deferred")} onClose={onClose}><ArchitectureItemGrid items={architecture.deferred} /></ArchitectureDialog>
    <ArchitectureDialog dialog={architecture.dialogs.priorities} id="architecture-priorities-dialog" open={open("priorities")} onClose={onClose}><ArchitecturePriorityList priorities={architecture.priorities} /></ArchitectureDialog>
    <ArchitectureDialog dialog={{ ...architecture.dialogs.priorities, title: "Información de arquitectura", eyebrow: "Categorías" }} id="architecture-mobile-info-dialog" open={open("mobile-info")} onClose={onClose}>
      <div className="dialog-grid two">{architectureActions.map(({ Icon, key }) => {
        const label = architecture.dialogs[key].label;
        return <button className="dialog-panel info-menu-option" key={key} onClick={() => { onClose(); requestAnimationFrame(() => onOpen(key)); }} type="button"><Icon aria-hidden="true" size={18} /><b>{label}</b></button>;
      })}</div>
    </ArchitectureDialog>
  </>;
}

function ArchitectureDialog({ children, dialog, id, onClose, open }: { children: React.ReactNode; dialog: { eyebrow: string; title: string }; id: string; onClose: () => void; open: boolean }) {
  const titleId = `${id}-title`;
  return <PresentationDialog id={id} labelledBy={titleId} onClose={onClose} open={open}><PresentationDialogHeader eyebrow={dialog.eyebrow} id={titleId} title={dialog.title} /><PresentationDialogBody>{children}</PresentationDialogBody><PresentationDialogFooter>Escape cierra · Tab permanece dentro del modal · Contenido desde `src/data/architecture-review.json`.</PresentationDialogFooter></PresentationDialog>;
}

function ArchitectureItemGrid({ items }: { items: ArchitectureItem[] }) {
  return <div className="architecture-dialog-grid">{items.map((item, index) => <article className="dialog-panel" key={item.id}><span className="num">{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.description}</p></article>)}</div>;
}

function ArchitectureNumberedList({ items }: { items: ArchitectureItem[] }) {
  return <ol className="architecture-dialog-list">{items.map((item, index) => <li className="number-row" key={item.id}><span className="num">{index + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></li>)}</ol>;
}

function ArchitecturePriorityList({ priorities }: { priorities: ArchitecturePriority[] }) {
  return <ol className="architecture-priority-dialog-list">{priorities.map((priority) => <li data-phase={priority.phase} key={priority.id}><span>{String(priority.order).padStart(2, "0")}</span><RoadmapIcon name={priority.icon} size={20} /><div><h3>{priority.title}</h3><p>{priority.detail}</p></div><b>{priority.phase === "mvp" ? "MVP inicial" : "Secuencia posterior"}</b></li>)}</ol>;
}
