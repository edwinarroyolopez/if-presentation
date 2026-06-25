"use client";

import { useState } from "react";
import { CheckCircle2, Flag, GitBranch, ShieldAlert } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { PresentationDialog, PresentationDialogBody, PresentationDialogFooter, PresentationDialogHeader } from "@/components/presentation/PresentationDialog";
import { ItemGrid, PresentationCallout, PresentationSlide, PresentationSlideBody, PresentationSlideFooter, PresentationSlideHeader } from "@/components/presentation/PresentationPrimitives";
import { getPresentationContent } from "@/lib/content";

type DialogKey = "decision" | "phases" | "gates" | "risks";

const executiveActions = [
  { key: "decision", label: "Decisión", Icon: CheckCircle2 },
  { key: "phases", label: "Fases", Icon: Flag },
  { key: "gates", label: "Gates", Icon: GitBranch },
  { key: "risks", label: "Riesgos", Icon: ShieldAlert },
] satisfies { key: DialogKey; label: string; Icon: typeof CheckCircle2 }[];

export function ExecutiveScenarioPage() {
  const { executiveScenario } = getPresentationContent();
  const [dialog, setDialog] = useState<DialogKey | null>(null);

  return <PresentationSlide className="executive-scenario-slide">
    <PresentationSlideHeader
      actions={<ExecutiveActions onOpen={setDialog} />}
      eyebrow="Parte 6 · Escenario ejecutivo"
      meta={<><span>GO condicionado</span><span>18 meses</span></>}
      thesis="Aprobar el horizonte; condicionar inversión y avance a fases, métricas y gates trimestrales."
      title="18 meses sí. Big bang no."
    />
    <PresentationSlideBody>
      <div className="executive-board-layout">
        <div className="exec-main-stack">
          <section className="exec-thesis-v3">
            <span>RECOMENDACIÓN A JUNTA</span>
            <h2>GO condicionado por fases, métricas y gates.</h2>
            <div className="exec-approval-grid" aria-label="Decisión recomendada">
              <DecisionPillar label="Aprobar" value="Horizonte de 18 meses" />
              <DecisionPillar label="No aprobar" value="Big bang paralelo" />
              <DecisionPillar label="Condicionar" value="Inversión por evidencia" />
            </div>
            <p className="exec-value-flow">Un solo programa: Cliente → Oportunidad → Proyecto → Misión → Captura → Entregable → Factura → Cobro → Rentabilidad.</p>
          </section>
          <section className="exec-phase-rail" aria-label="Secuencia de 18 meses">
            {executiveScenario.phases.slice(0, 4).map((phase, index) => <PhaseCard index={index} key={phase.id} phase={phase} />)}
          </section>
        </div>
        <aside className="exec-board-ask">
          <span>DECISIÓN DE JUNTA</span>
          <h3>Qué debe decidir la junta</h3>
          <div className="exec-ask-list">
            {executiveScenario.accept.slice(0, 3).map((item, index) => <article key={item}><b>{String.fromCharCode(65 + index)}</b><p>{item}</p></article>)}
          </div>
          <div className="exec-recommendation">
            <small>RECOMENDACIÓN FINAL</small>
            <strong>{executiveScenario.decision}</strong>
          </div>
        </aside>
      </div>
    </PresentationSlideBody>
    <PresentationSlideFooter>
      <span>Aprobar horizonte; condicionar ejecución.</span>
      <PresentationCallout tone="success"><b>GO condicionado.</b> No big bang.</PresentationCallout>
      <ButtonLink href="/" variant="ghost">Regresar</ButtonLink>
    </PresentationSlideFooter>
    <ExecutiveDialogs dialog={dialog} onClose={() => setDialog(null)} />
  </PresentationSlide>;
}

function ExecutiveActions({ onOpen }: { onOpen: (key: DialogKey) => void }) {
  return <div className="presentation-action-bar" aria-label="Lectura ejecutiva">{executiveActions.map(({ Icon, key, label }) => <button aria-label={`Abrir ${label}`} className="info-action" key={key} onClick={() => onOpen(key)} type="button"><Icon aria-hidden="true" size={17} /><span className="info-action-tooltip">{label}</span></button>)}</div>;
}

function DecisionPillar({ label, value }: { label: string; value: string }) {
  return <article><span>{label}</span><b>{value}</b></article>;
}

function PhaseCard({ index, phase }: { index: number; phase: { title: string; description: string; tone?: string } }) {
  const [range, title] = phase.title.split(": ");
  const { gate, outcome } = parsePhaseDescription(phase.description);

  return <article className={`exec-phase-card ${phase.tone ?? "neutral"}`}>
    <header><span>{String(index + 1).padStart(2, "0")}</span><small>{range}</small></header>
    <h3>{title}</h3>
    <p><b>Outcome:</b> {outcome}</p>
    <p><b>Gate:</b> {gate}</p>
  </article>;
}

function ExecutiveDialogs({ dialog, onClose }: { dialog: DialogKey | null; onClose: () => void }) {
  const { executiveScenario } = getPresentationContent();
  const open = (key: DialogKey) => dialog === key;

  return <>
    <InfoDialog eyebrow="Decisión" id="executive-decision-dialog" onClose={onClose} open={open("decision")} title="Decisión ejecutiva"><div className="dialog-grid two"><PresentationCallout tone="success"><b>{executiveScenario.decision}</b><p>{executiveScenario.memo}</p></PresentationCallout><DecisionList items={executiveScenario.accept} title="Aprobar" /><DecisionList items={executiveScenario.negotiate} title="Condiciones" /><DecisionList items={executiveScenario.postpone} title="No construir en 18 meses" /></div></InfoDialog>
    <InfoDialog eyebrow="Fases" id="executive-phases-dialog" onClose={onClose} open={open("phases")} title="Secuencia de 18 meses"><div className="dialog-grid two">{executiveScenario.phases.map((phase, index) => <article className="dialog-panel" key={phase.id}><span className="num">{index + 1}</span><h3>{phase.title}</h3><p>{parsePhaseDescription(phase.description).outcome}</p><p><b>Gate:</b> {parsePhaseDescription(phase.description).gate}</p></article>)}</div></InfoDialog>
    <InfoDialog eyebrow="Gates" id="executive-gates-dialog" onClose={onClose} open={open("gates")} title="Evidencia para continuar"><div className="dialog-grid"><PresentationCallout><b>Revisión cada 90 días</b><p>Continuar, acelerar, reducir o detener iniciativas con evidencia de valor, adopción, confiabilidad, seguridad, calidad de datos, riesgo y capacidad disponible.</p></PresentationCallout><ItemGrid columns={4} items={executiveScenario.metrics} /></div></InfoDialog>
    <InfoDialog eyebrow="Riesgos y controles" id="executive-risks-dialog" onClose={onClose} open={open("risks")} title="Qué controla el riesgo"><div className="dialog-grid two"><DecisionList items={executiveScenario.risks} title="Riesgos" /><DecisionList items={["Propietario de negocio", "Datos confiables", "Contratos versionados", "Permisos, auditoría y recuperación", "Adopción real", "Mejora cuantificable"]} title="Definición de terminado" /></div></InfoDialog>
  </>;
}

function InfoDialog({ children, eyebrow, id, onClose, open, title }: { children: React.ReactNode; eyebrow: string; id: string; onClose: () => void; open: boolean; title: string }) {
  const titleId = `${id}-title`;
  return <PresentationDialog id={id} labelledBy={titleId} onClose={onClose} open={open}><PresentationDialogHeader eyebrow={eyebrow} id={titleId} title={title} /><PresentationDialogBody>{children}</PresentationDialogBody><PresentationDialogFooter>Contenido derivado de `docs/F8-executive-scene.md`.</PresentationDialogFooter></PresentationDialog>;
}

function DecisionList({ title, items }: { title: string; items: string[] }) {
  return <article className="dialog-panel"><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>;
}

function parsePhaseDescription(description: string) {
  const [outcome = description, gate = "Gate trimestral con evidencia ejecutiva."] = description.replace("Outcome: ", "").split(" Gate: ");
  return { gate, outcome };
}
