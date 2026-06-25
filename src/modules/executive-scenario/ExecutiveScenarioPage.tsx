import { ButtonLink } from "@/components/ui/Button";
import { getPresentationContent } from "@/lib/content";
import { ItemGrid, PresentationCallout, PresentationSlide, PresentationSlideBody, PresentationSlideFooter, PresentationSlideHeader } from "@/components/presentation/PresentationPrimitives";
import { InlineInfoDialog } from "@/components/presentation/InlineInfoDialog";

export function ExecutiveScenarioPage() {
  const { executiveScenario } = getPresentationContent();
  return <PresentationSlide><PresentationSlideHeader eyebrow="Parte 6 · Escenario ejecutivo" title="18 meses sí; big bang no" thesis={executiveScenario.scenario} actions={<InlineInfoDialog eyebrow="Junta directiva" id="executive-detail-dialog" title="Respuesta completa"><div className="dialog-grid"><div className="dialog-panel"><h3>Memo ejecutivo</h3><p>{executiveScenario.memo}</p></div><DecisionList title="Aceptar" items={executiveScenario.accept} /><DecisionList title="Negociar" items={executiveScenario.negotiate} /><DecisionList title="Posponer" items={executiveScenario.postpone} /><div className="dialog-panel"><h3>Riesgos</h3><ul>{executiveScenario.risks.map((risk) => <li key={risk}>{risk}</li>)}</ul></div><div className="dialog-panel"><h3>Métricas</h3><ItemGrid items={executiveScenario.metrics} columns={4} /></div></div></InlineInfoDialog>} /><PresentationSlideBody><div className="executive-frame"><section className="exec-thesis-v2"><span>BOARD THESIS</span><h2>Aprobar la visión, financiarla por gates y decisiones reversibles.</h2><p>{executiveScenario.memo}</p><div className="exec-nonnegotiables">{executiveScenario.phases.slice(0, 4).map((phase, index) => <div key={phase.id}><b>{String(index + 1).padStart(2, "0")}</b><span>{phase.title}</span></div>)}</div></section><aside className="exec-ask"><h3>Qué debe decidir la junta</h3>{executiveScenario.accept.slice(0, 3).map((item, index) => <div key={item}><span>{String.fromCharCode(65 + index)}</span><p>{item}</p></div>)}<div className="exec-decision"><small>RECOMMENDATION</small><b>{executiveScenario.decision}</b></div></aside></div></PresentationSlideBody><PresentationSlideFooter><span>Decisión recomendada</span><PresentationCallout tone="success"><b>{executiveScenario.decision}</b></PresentationCallout><ButtonLink href="/" variant="ghost">Regresar</ButtonLink></PresentationSlideFooter></PresentationSlide>;
}

function DecisionList({ title, items }: { title: string; items: string[] }) {
  return <article className="dialog-panel"><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>;
}
