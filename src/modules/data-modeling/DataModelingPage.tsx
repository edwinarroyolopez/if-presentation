"use client";

import { useState } from "react";
import { GitBranch, Layers3, ShieldCheck, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { RoadmapIcon } from "@/components/roadmap/roadmap-icons";
import { getPresentationContent } from "@/lib/content";
import { PresentationCallout, PresentationSlide, PresentationSlideBody, PresentationSlideFooter, PresentationSlideHeader } from "@/components/presentation/PresentationPrimitives";
import { PresentationDialog, PresentationDialogBody, PresentationDialogFooter, PresentationDialogHeader } from "@/components/presentation/PresentationDialog";
import type { DataCrossDomainLink, DataDomain, DataDomainId, DataLifecycleHighlight, DataModelingContent } from "@/types/presentation";

type DialogId = "domains" | "relations" | "lifecycles" | "governance";

const coreOrder: DataDomainId[] = ["p2", "p1", "p3", "p4"];
const controlOrder: DataDomainId[] = ["p5", "p6", "p7", "p8"];
const actions = [
  { id: "domains", label: "Dominios y ownership", icon: Layers3 },
  { id: "relations", label: "Relaciones y eventos", icon: GitBranch },
  { id: "lifecycles", label: "Estados y lifecycles", icon: Workflow },
  { id: "governance", label: "Gobierno e integridad", icon: ShieldCheck },
] satisfies { id: DialogId; label: string; icon: typeof Layers3 }[];

export function DataModelingPage() {
  const { dataModeling } = getPresentationContent();
  const [dialog, setDialog] = useState<DialogId | null>(null);
  const domainsById = new Map(dataModeling.domains.map((domain) => [domain.id, domain]));
  const coreDomains = coreOrder.map((id) => domainsById.get(id)).filter(Boolean) as DataDomain[];
  const controlDomains = controlOrder.map((id) => domainsById.get(id)).filter(Boolean) as DataDomain[];

  return <PresentationSlide className="data-modeling-slide">
    <PresentationSlideHeader
      actions={<DataModelingActions onOpen={setDialog} />}
      eyebrow="Parte 4 · Modelo de datos"
      meta={<>{dataModeling.meta.map((item) => <span key={item}>{item}</span>)}</>}
      thesis={dataModeling.thesis}
      title={dataModeling.title}
    />
    <PresentationSlideBody>
      <main className="data-model-map" aria-label="Modelo de datos por dominios y value stream">
        <section className="value-stream-ribbon" aria-label="Value stream principal">
          <span>Value stream</span>
          <b>{dataModeling.valueStream.title}</b>
        </section>

        <section className="data-core-flow" aria-label="Dominios transaccionales">
          {coreDomains.map((domain, index) => <CoreDomainCard domain={domain} key={domain.id} showArrow={index < coreDomains.length - 1} />)}
        </section>

        <section className="data-control-plane" aria-label="Dominios transversales de control">
          <div className="control-plane-label"><span>Control plane</span><b>Gobierna, observa y asiste el flujo sin escribir bases ajenas</b></div>
          <div className="control-plane-grid">
            {controlDomains.map((domain) => <ControlDomainCard domain={domain} key={domain.id} />)}
          </div>
        </section>
      </main>
    </PresentationSlideBody>
    <PresentationSlideFooter>
      <span>{dataModeling.footerInsight.left}</span>
      <PresentationCallout><b>{dataModeling.footerInsight.callout}</b></PresentationCallout>
      <Badge tone="info">{dataModeling.footerInsight.badge}</Badge>
    </PresentationSlideFooter>
    <DataModelingDialogs content={dataModeling} dialog={dialog} onClose={() => setDialog(null)} />
  </PresentationSlide>;
}

function DataModelingActions({ onOpen }: { onOpen: (dialog: DialogId) => void }) {
  return <div className="presentation-action-bar data-modeling-action-bar" aria-label="Información del modelo de datos">
    {actions.map((action) => {
      const Icon = action.icon;
      return <button aria-label={`Abrir ${action.label}`} className="info-action" key={action.id} onClick={() => onOpen(action.id)} type="button">
        <Icon aria-hidden="true" size={17} />
        <span className="info-action-tooltip">{action.label}</span>
      </button>;
    })}
  </div>;
}

function CoreDomainCard({ domain, showArrow }: { domain: DataDomain; showArrow: boolean }) {
  return <article className="data-domain-card core" data-domain-id={domain.id}>
    <header>
      <span>{domain.id.toUpperCase()}</span>
      <RoadmapIcon name={domain.icon} size={24} />
    </header>
    <h3>{domain.shortName}</h3>
    <p className="domain-owner">{domain.owner}</p>
    <ul>
      {domain.primaryEntities.slice(0, 4).map((entity) => <li key={entity}>{entity}</li>)}
    </ul>
    <p className="domain-role">{domain.functionalVerb}</p>
    {showArrow ? <i aria-hidden="true" className="domain-handoff">handoff</i> : null}
  </article>;
}

function ControlDomainCard({ domain }: { domain: DataDomain }) {
  return <article className="data-domain-card control" data-domain-id={domain.id}>
    <header>
      <RoadmapIcon name={domain.icon} size={21} />
      <span>{domain.id.toUpperCase()}</span>
    </header>
    <h3>{domain.shortName}</h3>
    <p className="domain-role">{domain.functionalVerb}</p>
    <ul>
      {domain.primaryEntities.slice(0, 4).map((entity) => <li key={entity}>{entity}</li>)}
    </ul>
  </article>;
}

function DataModelingDialogs({ content, dialog, onClose }: { content: DataModelingContent; dialog: DialogId | null; onClose: () => void }) {
  return <>
    <Dialog id="data-modeling-domains-dialog" open={dialog === "domains"} onClose={onClose} title="Dominios y ownership" eyebrow="Fuentes de verdad">
      <DomainsDialog domains={content.domains} />
    </Dialog>
    <Dialog id="data-modeling-relations-dialog" open={dialog === "relations"} onClose={onClose} title="Relaciones y eventos" eyebrow="Handoffs controlados">
      <RelationsDialog domains={content.domains} links={content.crossDomainLinks} />
    </Dialog>
    <Dialog id="data-modeling-lifecycles-dialog" open={dialog === "lifecycles"} onClose={onClose} title="Estados y lifecycles" eyebrow="Rails de estado">
      <LifecyclesDialog domains={content.domains} lifecycles={content.lifecycleHighlights} />
    </Dialog>
    <Dialog id="data-modeling-governance-dialog" open={dialog === "governance"} onClose={onClose} title="Gobierno e integridad" eyebrow="Reglas no negociables">
      <GovernanceDialog content={content} />
    </Dialog>
  </>;
}

function Dialog({ children, eyebrow, id, onClose, open, title }: { children: React.ReactNode; eyebrow: string; id: string; onClose: () => void; open: boolean; title: string }) {
  const titleId = `${id}-title`;
  return <PresentationDialog id={id} labelledBy={titleId} onClose={onClose} open={open}>
    <PresentationDialogHeader eyebrow={eyebrow} id={titleId} title={title} />
    <PresentationDialogBody>{children}</PresentationDialogBody>
    <PresentationDialogFooter>Escape cierra · Tab permanece dentro del modal · Contenido desde `src/data/data-modeling.json`.</PresentationDialogFooter>
  </PresentationDialog>;
}

function DomainsDialog({ domains }: { domains: DataDomain[] }) {
  return <div className="data-domain-catalog">
    {domains.map((domain) => <article className="dialog-panel data-domain-detail" key={domain.id}>
      <header>
        <span>{domain.id.toUpperCase()} · {domain.type}</span>
        <RoadmapIcon name={domain.icon} size={22} />
      </header>
      <h3>{domain.fullName}</h3>
      <dl>
        <dt>Owner</dt><dd>{domain.owner}</dd>
        <dt>Fuente</dt><dd>{domain.sourceOfTruth}</dd>
        <dt>Responsabilidad</dt><dd>{domain.executiveSummary}</dd>
        <dt>Entidades</dt><dd>{domain.primaryEntities.join(" · ")}</dd>
        <dt>Regla critica</dt><dd>{domain.integrityRules[0]}</dd>
      </dl>
      <p className="source-line">{domain.sourceDocument}</p>
    </article>)}
  </div>;
}

function RelationsDialog({ domains, links }: { domains: DataDomain[]; links: DataCrossDomainLink[] }) {
  const names = new Map(domains.map((domain) => [domain.id, domain.shortName]));
  return <div className="data-relations-list">
    {links.map((link) => <article className="dialog-panel data-relation-card" key={link.id}>
      <header><span>{link.type}</span><b>{names.get(link.from)} {"->"} {names.get(link.to)}</b></header>
      <h3>{link.label}</h3>
      <p>{link.mechanism}</p>
      <div className="relation-meta">
        <span><b>Inicia</b>{link.initiator}</span>
        <span><b>Recibe</b>{link.receiver}</span>
        <span><b>Cardinalidad</b>{link.cardinality}</span>
        <span><b>IDs</b>{link.sharedIds.join(" · ")}</span>
      </div>
      <div className="event-strip" aria-label={`Eventos para ${link.label}`}>{link.events.map((event) => <code key={event}>{event}</code>)}</div>
    </article>)}
  </div>;
}

function LifecyclesDialog({ domains, lifecycles }: { domains: DataDomain[]; lifecycles: DataLifecycleHighlight[] }) {
  const domainMap = new Map(domains.map((domain) => [domain.id, domain]));
  return <div className="data-lifecycle-grid">
    {lifecycles.map((lifecycle) => {
      const domain = domainMap.get(lifecycle.domainId);
      return <article className="dialog-panel lifecycle-rail" key={lifecycle.domainId}>
        <header><span>{lifecycle.domainId.toUpperCase()}</span><h3>{lifecycle.title}</h3></header>
        <div className="state-rail">{lifecycle.states.map((state) => <b key={state}>{state}</b>)}</div>
        <p><strong>{domain?.shortName}</strong> alternativos: {lifecycle.alternates.join(" · ")}</p>
      </article>;
    })}
  </div>;
}

function GovernanceDialog({ content }: { content: DataModelingContent }) {
  const aiDomain = content.domains.find((domain) => domain.id === "p8");
  return <div className="data-governance-layout">
    <PresentationCallout tone="success"><b>Regla conceptual</b><p>La IA propone; InflightOS valida, aprueba, ejecuta y registra.</p></PresentationCallout>
    <section className="data-governance-grid">
      {content.governanceRules.map((rule) => <article className="dialog-panel" key={rule.id}>
        <h3>{rule.title}</h3>
        <p>{rule.description}</p>
      </article>)}
    </section>
    {aiDomain ? <section className="dialog-panel ai-guardrail-panel">
      <h3>Limites de IA</h3>
      <ul>{aiDomain.integrityRules.map((rule) => <li key={rule}>{rule}</li>)}</ul>
    </section> : null}
  </div>;
}
