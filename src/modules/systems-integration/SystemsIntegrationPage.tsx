"use client";

import { useState } from "react";
import { Activity, BarChart3, ClipboardCheck, Cpu, Handshake, Image, KeyRound, Plane, Route, Sparkles, Workflow } from "lucide-react";
import { getPresentationContent } from "@/lib/content";
import { PresentationCallout, PresentationSlide, PresentationSlideBody, PresentationSlideFooter, PresentationSlideHeader } from "@/components/presentation/PresentationPrimitives";
import { PresentationDialog, PresentationDialogBody, PresentationDialogFooter, PresentationDialogHeader } from "@/components/presentation/PresentationDialog";
import type { IntegrationContent, IntegrationDialog, IntegrationDomain } from "@/types/presentation";

type DialogId = IntegrationDialog["id"];

const dialogIcons = { route: Route, workflow: Workflow, "key-round": KeyRound, activity: Activity } satisfies Record<IntegrationDialog["icon"], typeof Route>;
const domainIcons = { handshake: Handshake, "clipboard-check": ClipboardCheck, plane: Plane, image: Image, cpu: Cpu, "bar-chart": BarChart3, sparkles: Sparkles } satisfies Record<IntegrationDomain["icon"], typeof Plane>;

export function SystemsIntegrationPage() {
  const { integration } = getPresentationContent();
  const [dialog, setDialog] = useState<DialogId | null>(null);

  return <PresentationSlide className="systems-integration-slide">
    <PresentationSlideHeader
      actions={<IntegrationActions dialogs={integration.dialogs} onOpen={setDialog} />}
      eyebrow="Parte 3 · Integración de sistemas"
      title={integration.title}
      thesis={integration.thesis}
    />
    <PresentationSlideBody>
      <main className="integration-blueprint" aria-label="Blueprint de integración por proyecto">
        <section className="integration-architecture" aria-label="InflightOS y dominios conectados">
          <article className="erp-core-card" aria-label={`${integration.core.title}, ${integration.core.subtitle}`}>
            <span className="integration-node-kicker">{integration.core.subtitle}</span>
            <h2>{integration.core.title}</h2>
            <p>{integration.core.description}</p>
            <div className="erp-pill-grid" aria-label="Contexto gobernado por ERP">
              {integration.core.context.map((item) => <span key={item}>{item}</span>)}
            </div>
            <div className="erp-governance-grid" aria-label="Gobierno del ERP">
              {integration.core.governance.map((item) => <span key={item}>{item}</span>)}
            </div>
          </article>

          <article className="project-connection-card" aria-label={integration.connection.title}>
            <span className="integration-node-kicker">{integration.connection.title}</span>
            <ConnectionPath subtitle={integration.connection.subtitle} />
            <p>{integration.connection.description}</p>
            <div className="connection-signals">
              {integration.connection.signals.map((signal) => <span key={signal}>{signal}</span>)}
            </div>
            <div className="connection-attributes" aria-label="Atributos de la conexión por proyecto">
              {integration.connection.attributes.map((attribute) => <code key={attribute}>{attribute}</code>)}
            </div>
          </article>

          <section className="connected-domains" aria-label="Dominios especializados conectados">
            <header>
              <span className="integration-node-kicker">Dominios conectados</span>
              <p>Capacidades autónomas, conectadas por contratos.</p>
            </header>
            <div className="domain-node-grid">
              {integration.domains.map((domain) => <DomainNode domain={domain} key={domain.id} />)}
            </div>
          </section>
        </section>

        <section className="contract-legend" aria-label="Contratos de comunicación">
          {integration.contracts.map((contract) => <article data-contract={contract.id} key={contract.id}>
            <span>{contract.label}</span>
            <b>{contract.title}</b>
            <p>{contract.description}</p>
          </article>)}
        </section>
      </main>
    </PresentationSlideBody>
    <PresentationSlideFooter>
      <span>{integration.footer.primary}</span>
      <PresentationCallout><b>{integration.footer.secondary}</b></PresentationCallout>
    </PresentationSlideFooter>
    <IntegrationDialogs dialog={dialog} integration={integration} onClose={() => setDialog(null)} />
  </PresentationSlide>;
}

function IntegrationActions({ dialogs, onOpen }: { dialogs: IntegrationDialog[]; onOpen: (key: DialogId) => void }) {
  return <div className="presentation-action-bar integration-action-bar" aria-label="Información de integración">
    {dialogs.map((item) => {
      const Icon = dialogIcons[item.icon];
      return <button aria-label={`Abrir ${item.label}`} className="info-action" key={item.id} onClick={() => onOpen(item.id)} type="button">
        <Icon aria-hidden="true" size={17} />
        <span className="info-action-tooltip">{item.label}</span>
      </button>;
    })}
  </div>;
}

function ConnectionPath({ subtitle }: { subtitle: string }) {
  return <div className="connection-path" aria-label={subtitle}>
    {subtitle.split(" -> ").map((item, index, items) => <span key={item}>
      <b>{item}</b>
      {index < items.length - 1 ? <i aria-hidden="true">→</i> : null}
    </span>)}
  </div>;
}

function DomainNode({ domain }: { domain: IntegrationDomain }) {
  const Icon = domainIcons[domain.icon];
  return <article className="integration-domain-node" data-contract={domain.contract}>
    <Icon aria-hidden="true" size={18} />
    <div>
      <b>{domain.title}</b>
      <p>{domain.responsibility}</p>
    </div>
  </article>;
}

function IntegrationDialogs({ dialog, integration, onClose }: { dialog: DialogId | null; integration: IntegrationContent; onClose: () => void }) {
  return <>
    {integration.dialogs.map((item) => <IntegrationDialogModal dialog={item} key={item.id} onClose={onClose} open={dialog === item.id} />)}
  </>;
}

function IntegrationDialogModal({ dialog, onClose, open }: { dialog: IntegrationDialog; onClose: () => void; open: boolean }) {
  const titleId = `integration-${dialog.id}-dialog-title`;
  return <PresentationDialog id={`integration-${dialog.id}-dialog`} labelledBy={titleId} onClose={onClose} open={open}>
    <PresentationDialogHeader eyebrow={dialog.eyebrow} id={titleId} title={dialog.title} />
    <PresentationDialogBody>
      <div className="dialog-grid integration-dialog-grid">
        {dialog.sections.map((section) => <article className="dialog-panel integration-dialog-panel" key={section.title}>
          <h3>{section.title}</h3>
          <ul>
            {section.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>)}
      </div>
    </PresentationDialogBody>
    <PresentationDialogFooter>Escape cierra · Tab permanece dentro del modal</PresentationDialogFooter>
  </PresentationDialog>;
}
