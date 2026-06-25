import { getPresentationContent } from "@/lib/content";
import { ItemGrid, PresentationPageHero, Section } from "@/components/presentation/PresentationPrimitives";

export function AIStrategyPage() {
  const { aiStrategy } = getPresentationContent();
  return <><PresentationPageHero eyebrow="Parte 5 · Estrategia de IA" title="IA donde existe señal, no donde hay presión" lead="La capa de IA debe mejorar calidad, búsqueda o velocidad con supervisión humana; no debe automatizar decisiones críticas sin control." /><Section title="Matriz ahora / después"><div className="grid grid-2"><div><h2>Usar ahora</h2><ItemGrid items={aiStrategy.useNow} columns={2} /></div><div><h2>Posponer</h2><ItemGrid items={aiStrategy.postpone} columns={2} /></div></div></Section><Section title="Supervisión humana y límites"><div className="grid grid-2"><div><h2>Human-in-the-loop</h2><ItemGrid items={aiStrategy.humanSupervision} columns={2} /></div><div><h2>No automatizar decisiones críticas</h2><ItemGrid items={aiStrategy.doNotAutomate} columns={2} /></div></div></Section><Section title="Guardrails y promoción"><ItemGrid items={aiStrategy.guardrails} columns={4} /><div className="card" style={{ marginTop: 16 }}><h3>Criterios para promover un caso de uso</h3><ul>{aiStrategy.promotionCriteria.map((criterion) => <li key={criterion}>{criterion}</li>)}</ul></div></Section></>;
}
