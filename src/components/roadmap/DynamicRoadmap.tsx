"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RoadmapIconName } from "@/types/roadmap";
import { RoadmapIcon } from "./roadmap-icons";
import { buildConnectorPath, computeRoadmapLayout, type RoadmapDensity, type RoadmapVariant } from "./roadmap-layout";
import styles from "./DynamicRoadmap.module.css";

export type DynamicRoadmapItem = {
  id: string;
  title: string;
  summary: string;
  sequenceLabel: string;
  icon: RoadmapIconName;
  tone: string;
};

export function DynamicRoadmap({ items, density, selectedId, onSelect, renderHref, ariaLabel, variant }: { items: DynamicRoadmapItem[]; density: RoadmapDensity; selectedId?: string; onSelect?: (id: string) => void; renderHref?: (item: DynamicRoadmapItem) => string; ariaLabel: string; variant: RoadmapVariant }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const [width, setWidth] = useState(1080);

  useEffect(() => {
    const node = shellRef.current;
    if (!node) return;
    const update = () => setWidth(Math.max(320, node.clientWidth));
    update();
    const observer = new ResizeObserver(() => {
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(update);
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  const layout = useMemo(() => computeRoadmapLayout({ items, width, density, variant }), [density, items, variant, width]);
  const gradientsId = `roadGradient-${variant}`;

  const select = useCallback((id: string) => onSelect?.(id), [onSelect]);
  const onStationKey = useCallback((event: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      select(id);
    }
  }, [select]);

  const itemById = new Map(items.map((item) => [item.id, item]));

  return <>
    <div className={styles.shell} ref={shellRef} data-roadmap-canvas aria-label={ariaLabel} role="group">
      <div className={styles.canvas} style={{ width: layout.width, height: layout.height }}>
        <svg className={styles.svg} viewBox={`0 0 ${layout.width} ${layout.height}`} aria-hidden="true">
          <defs><linearGradient id={gradientsId} x1="0%" x2="100%" y1="0%" y2="0%"><stop offset="0%" stopColor="#0e2d65" /><stop offset="48%" stopColor="#1594ff" /><stop offset="100%" stopColor="#51c0ff" /></linearGradient></defs>
          <path className={`${styles.roadPath} ${styles.roadGlow}`} d={layout.path} />
          <path className={`${styles.roadPath} ${styles.roadShadow}`} d={layout.path} />
          <path className={`${styles.roadPath} ${styles.roadBorder}`} d={layout.path} />
          <path className={`${styles.roadPath} ${styles.roadMain}`} d={layout.path} stroke={`url(#${gradientsId})`} />
          <path className={`${styles.roadPath} ${styles.roadHighlight}`} d={layout.path} />
          <path className={`${styles.roadPath} ${styles.roadLane}`} d={layout.path} />
          {layout.cards.map((card) => {
            const point = layout.points.find((candidate) => candidate.id === card.id);
            const item = itemById.get(card.id);
            if (!point || !item) return null;
            return <g key={card.id} data-roadmap-connector><path className={styles.connector} d={buildConnectorPath(point, card)} stroke={item.tone} /><circle className={styles.connectorDot} cx={card.x} cy={card.y} r="5" fill={item.tone} /></g>;
          })}
        </svg>
        {layout.points.map((point, index) => {
          const item = itemById.get(point.id);
          if (!item) return null;
          const active = selectedId === item.id;
          return <button className={`${styles.station} ${active ? styles.stationActive : ""}`} data-roadmap-station data-roadmap-project={variant === "portfolio" ? item.id : undefined} data-roadmap-horizon={variant === "project" ? item.id : undefined} key={item.id} type="button" onClick={() => select(item.id)} onKeyDown={(event) => onStationKey(event, item.id)} aria-pressed={active} aria-label={`${item.sequenceLabel}: ${item.title}`} style={{ left: point.x, top: point.y, "--tone": item.tone } as React.CSSProperties}>
            <RoadmapIcon name={item.icon} size={30} /><small>{index + 1}</small>
          </button>;
        })}
        {layout.cards.map((card) => {
          const item = itemById.get(card.id);
          if (!item) return null;
          const active = selectedId === item.id;
          const content = <><div className={styles.cardTop}><span className={styles.cardKicker}><span className={styles.legendDot} style={{ "--tone": item.tone } as React.CSSProperties} />{item.sequenceLabel}</span></div><h3>{item.title}</h3><p>{item.summary}</p></>;
          return <article className={`${styles.card} ${active ? styles.cardActive : ""}`} data-roadmap-card key={item.id} style={{ left: card.x, top: card.y, "--tone": item.tone } as React.CSSProperties} onMouseEnter={() => select(item.id)}>
            {renderHref ? <Link className={styles.cardLink} href={renderHref(item)}>{content}</Link> : <button type="button" onClick={() => select(item.id)}>{content}</button>}
          </article>;
        })}
      </div>
    </div>
    <div className={styles.accessibleList} aria-label="Lista textual equivalente del roadmap">
      {items.map((item) => renderHref ? <Link href={renderHref(item)} key={item.id}><b>{item.sequenceLabel}: {item.title}</b><br />{item.summary}</Link> : <button key={item.id} type="button" onClick={() => select(item.id)}><b>{item.sequenceLabel}: {item.title}</b><br />{item.summary}</button>)}
    </div>
  </>;
}
