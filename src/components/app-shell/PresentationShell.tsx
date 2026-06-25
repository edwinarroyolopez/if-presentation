"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getNavigationItems, getRouteProgress, isRouteActive, normalizePath } from "@/lib/content";
import { BrandBlock } from "@/components/layout/BrandBlock";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { FullscreenToggle } from "./FullscreenToggle";

export function PresentationShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const normalized = normalizePath(pathname);
  const progress = getRouteProgress(normalized);
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); openerRef.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const sidebar = <><BrandBlock /><Progress part={progress.item.part} percent={progress.percent} /><Nav active={normalized} onNavigate={() => setOpen(false)} /><div className="sidebar-foot">Teclado: Tab para navegar · Escape cierra menú móvil</div></>;

  return <div className="presentation-app"><aside aria-label="Navegación principal" className="presentation-sidebar">{sidebar}</aside><div className="workspace"><header className="topbar"><button ref={openerRef} className="icon-btn mobile-menu" aria-label="Abrir menú" onClick={() => setOpen(true)}><Icon name="menu" /></button><div className="crumb"><small>InflightOS / Evaluación estratégica</small><strong>{progress.item.shortLabel}</strong></div><div className="top-actions"><span className="counter">{progress.item.part} de 6</span><FullscreenToggle /></div></header><main className="content-stage"><div className="slide-frame"><div className="slide-pad">{children}</div></div><PreviousNext previous={progress.previous} next={progress.next} /></main></div><div className={open ? "drawer-backdrop open" : "drawer-backdrop"} aria-hidden={!open} onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}><aside aria-label="Menú móvil" className="mobile-drawer"><button ref={closeRef} className="icon-btn" aria-label="Cerrar menú" onClick={() => { setOpen(false); openerRef.current?.focus(); }} style={{ margin: 14 }}><Icon name="close" /></button>{sidebar}</aside></div></div>;
}

function Progress({ part, percent }: { part: number; percent: number }) {
  return <div className="progress-panel"><header><b>Progreso</b><span>{part} de 6</span></header><div className="progress-track" aria-hidden="true"><i style={{ width: `${percent}%` }} /></div></div>;
}

function Nav({ active, onNavigate }: { active: string; onNavigate?: () => void }) {
  return <nav className="part-nav" aria-label="Partes de la presentación"><div className="nav-label">Índice</div>{getNavigationItems().map((item) => { const current = isRouteActive(item.route, active); return <Link aria-current={current ? "page" : undefined} className={current ? "part-link active" : "part-link"} href={item.route} key={item.id} onClick={onNavigate}><span className="n">{item.part === 0 ? "00" : String(item.part).padStart(2, "0")}</span><span><b>{item.label}</b><small>{item.part === 0 ? "Preámbulo" : `Parte ${item.part} de 6`}</small></span></Link>; })}</nav>;
}

function PreviousNext({ previous, next }: { previous?: { route: string; shortLabel: string }; next?: { route: string; shortLabel: string } }) {
  return <nav className="footer-nav" aria-label="Navegación anterior y siguiente"><div className="prev-title">{previous ? <><span>Anterior</span><b>{previous.shortLabel}</b></> : null}</div><div style={{ display: "flex", gap: 8 }}>{previous ? <ButtonLink href={previous.route} variant="ghost">Anterior</ButtonLink> : <span />} {next ? <ButtonLink href={next.route} variant="primary">Siguiente</ButtonLink> : <ButtonLink href="/" variant="primary">Volver al inicio</ButtonLink>}</div><div className="next-title">{next ? <><span>Siguiente</span><b>{next.shortLabel}</b></> : <><span>Cierre</span><b>Inicio</b></>}</div></nav>;
}
