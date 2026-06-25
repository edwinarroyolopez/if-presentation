import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { getPresentationContent } from "@/lib/content";
import { ItemGrid, PresentationPageHero, Section } from "@/components/presentation/PresentationPrimitives";

export function ExecutiveScenarioPage() {
  const { executiveScenario } = getPresentationContent();
  return <><PresentationPageHero eyebrow="Parte 6 · Escenario ejecutivo" title="18 meses sí; big bang no" lead={executiveScenario.scenario} /><section className="card" style={{ background: "#f4f1e9", color: "#182232" }}><div className="kicker" style={{ color: "#007a93" }}>Memo ejecutivo</div><h2>Respuesta recomendada a la junta</h2><p style={{ color: "#182232" }}>{executiveScenario.memo}</p></section><Section title="Aceptar, negociar, posponer"><div className="grid grid-3"><DecisionList title="Aceptar" items={executiveScenario.accept} tone="success" /><DecisionList title="Negociar" items={executiveScenario.negotiate} tone="warning" /><DecisionList title="Posponer" items={executiveScenario.postpone} tone="danger" /></div></Section><Section title="Todo a la vez vs entrega iterativa"><div className="grid grid-2"><article className="card"><Badge tone="danger">Riesgo</Badge><h3>Intentar todo simultáneamente</h3><ul>{executiveScenario.risks.map((risk) => <li key={risk}>{risk}</li>)}</ul></article><article className="card"><Badge tone="success">Recomendado</Badge><h3>Entrega iterativa por fases</h3><p>Foco trimestral, métricas auditables, contratación por etapa y gates de inversión.</p></article></div></Section><Section title="Plan de 18 meses"><ItemGrid items={executiveScenario.phases} columns={4} /></Section><Section title="Métricas de éxito"><ItemGrid items={executiveScenario.metrics} columns={4} /><div className="card" style={{ marginTop: 16 }}><h2>Decisión recomendada</h2><p>{executiveScenario.decision}</p><ButtonLink href="/" variant="primary">Regresar al índice</ButtonLink></div></Section></>;
}

function DecisionList({ title, items, tone }: { title: string; items: string[]; tone: "success" | "warning" | "danger" }) {
  return <article className="card"><Badge tone={tone}>{title}</Badge><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>;
}
