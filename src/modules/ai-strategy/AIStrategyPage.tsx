import { Activity, BadgeCheck, BarChart3, Bot, Braces, ClipboardCheck, Database, FileText, Handshake, ImageIcon, Landmark, ListChecks, Plane, Route, Scale, ShieldCheck, Sparkles, UserCheck, Users } from "lucide-react";
import type { ComponentType } from "react";
import { getPresentationContent } from "@/lib/content";
import { InlineInfoDialog } from "@/components/presentation/InlineInfoDialog";
import { PresentationSlide, PresentationSlideBody, PresentationSlideFooter, PresentationSlideHeader } from "@/components/presentation/PresentationPrimitives";
import type { AIStrategyIcon } from "@/types/presentation";

const iconMap = {
  activity: Activity,
  "badge-check": BadgeCheck,
  "bar-chart": BarChart3,
  bot: Bot,
  braces: Braces,
  database: Database,
  "file-text": FileText,
  gateway: Route,
  handshake: Handshake,
  image: ImageIcon,
  landmark: Landmark,
  "list-checks": ListChecks,
  plane: Plane,
  scale: Scale,
  "scan-check": ClipboardCheck,
  "shield-check": ShieldCheck,
  sparkles: Sparkles,
  "user-check": UserCheck,
  users: Users,
} satisfies Record<AIStrategyIcon, ComponentType<{ "aria-hidden"?: boolean; size?: number }>>;

export function AIStrategyPage() {
  const { aiStrategy } = getPresentationContent();

  return <PresentationSlide className="ai-strategy-slide">
    <PresentationSlideHeader
      actions={<InlineInfoDialog buttonLabel="Ver detalle" eyebrow="Estrategia de IA" id="ai-detail-dialog" title="Adopción segura de IA"><AIStrategyDetail /></InlineInfoDialog>}
      eyebrow="Parte 5 · Estrategia de IA"
      thesis={aiStrategy.thesis}
      title={aiStrategy.title}
    />
    <PresentationSlideBody>
      <main className="ai-strategy-map" aria-label="Estrategia ejecutiva de adopción segura de IA">
        <section className="ai-architecture-strip" aria-labelledby="ai-architecture-title">
          <header>
            <span id="ai-architecture-title">{aiStrategy.architecturePattern.label}</span>
            <b>{aiStrategy.architecturePattern.note}</b>
          </header>
          <ol aria-label="Secuencia del patrón recomendado">
            {aiStrategy.architecturePattern.steps.map((step) => {
              const Icon = iconMap[step.icon];
              return <li key={step.id}>
                <span className="ai-node-icon"><Icon aria-hidden="true" size={17} /></span>
                <b>{step.title}</b>
                <small>{step.description}</small>
              </li>;
            })}
          </ol>
        </section>

        <div className="ai-strategy-main">
          <section className="ai-priority-panel" aria-labelledby="ai-priority-title">
            <header>
              <span>Prioridad inmediata</span>
              <h2 id="ai-priority-title">Asistir tareas repetitivas con control humano</h2>
            </header>
            <div className="ai-priority-grid">
              {aiStrategy.immediatePriorities.map((priority) => {
                const Icon = iconMap[priority.icon];
                return <article className="ai-priority-card" key={priority.id}>
                  <span className="ai-card-icon"><Icon aria-hidden="true" size={18} /></span>
                  <div>
                    <h3>{priority.title}</h3>
                    <p>{priority.description}</p>
                    <small>{priority.authority}</small>
                  </div>
                </article>;
              })}
            </div>
          </section>

          <aside className="ai-authority-panel" aria-labelledby="ai-authority-title">
            <header>
              <span>Autoridad que no se delega</span>
              <h2 id="ai-authority-title">Gobierno empresarial</h2>
            </header>
            <p className="ai-authority-principle">{aiStrategy.authorityPrinciple}</p>
            <div className="ai-limit-list">
              {aiStrategy.authorityLimits.map((limit) => {
                const Icon = iconMap[limit.icon];
                return <article key={limit.id}>
                  <Icon aria-hidden="true" size={15} />
                  <div><b>{limit.title}</b><p>{limit.description}</p></div>
                </article>;
              })}
            </div>
            <section className="ai-later-band" aria-labelledby="ai-later-title">
              <span id="ai-later-title">{aiStrategy.laterWithEvidence.label}</span>
              <p>{aiStrategy.laterWithEvidence.summary}</p>
              <div>{aiStrategy.laterWithEvidence.cases.map((item) => <b key={item}>{item}</b>)}</div>
            </section>
          </aside>
        </div>
      </main>
    </PresentationSlideBody>
    <PresentationSlideFooter>
      <span>Production rule</span>
      <div className="ai-promotion-rule"><ShieldCheck aria-hidden="true" size={17} /><b>{aiStrategy.promotionRule}</b></div>
    </PresentationSlideFooter>
  </PresentationSlide>;
}

function AIStrategyDetail() {
  const { aiStrategy } = getPresentationContent();

  return <div className="ai-detail-dialog">
    <section className="dialog-panel ai-detail-section">
      <header><span>01</span><h3>Los ocho dominios donde usar IA</h3></header>
      <div className="ai-detail-domain-grid">
        {aiStrategy.domains.map((domain) => {
          const Icon = iconMap[domain.icon];
          return <article key={domain.id}>
            <Icon aria-hidden="true" size={18} />
            <h4>{domain.title}</h4>
            <p>{domain.summary}</p>
            <dl>
              <dt>Uso inmediato</dt><dd>{domain.immediateUse}</dd>
              <dt>Límite</dt><dd>{domain.authorityLimit}</dd>
            </dl>
          </article>;
        })}
      </div>
    </section>

    <section className="dialog-grid two">
      <div className="dialog-panel ai-detail-section">
        <header><span>02</span><h3>Casos posteriores</h3></header>
        <p>{aiStrategy.laterWithEvidence.summary}</p>
        <ul>{aiStrategy.laterWithEvidence.cases.map((item) => <li key={item}>{item}</li>)}</ul>
        <div className="ai-detail-chip-row">{aiStrategy.laterWithEvidence.conditions.map((item) => <b key={item}>{item}</b>)}</div>
      </div>
      <div className="dialog-panel ai-detail-section">
        <header><span>03</span><h3>Límites de autoridad</h3></header>
        <p>{aiStrategy.authorityPrinciple}</p>
        <ul>{aiStrategy.authorityLimits.map((limit) => <li key={limit.id}><b>{limit.title}.</b> {limit.description}</li>)}</ul>
      </div>
    </section>

    <section className="dialog-grid two">
      <div className="dialog-panel ai-detail-section">
        <header><span>04</span><h3>Diez gates para producción</h3></header>
        <ol>{aiStrategy.productionGates.map((gate) => <li key={gate}>{gate}</li>)}</ol>
      </div>
      <div className="dialog-panel ai-detail-section ai-detail-recommendation">
        <header><span>05</span><h3>Recomendación ejecutiva</h3></header>
        <ul>{aiStrategy.executiveRecommendation.map((item) => <li key={item}>{item}</li>)}</ul>
        <p>{aiStrategy.architecturePattern.noDirectWrite}</p>
      </div>
    </section>
  </div>;
}
