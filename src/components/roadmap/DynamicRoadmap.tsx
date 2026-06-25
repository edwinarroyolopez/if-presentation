"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { RoadmapIconName } from "@/types/roadmap";
import { RoadmapIcon } from "./roadmap-icons";
import { buildConnectorPath, computeRoadmapLayout, type RoadmapCardPlacement, type RoadmapDensity, type RoadmapPoint, type RoadmapVariant } from "./roadmap-layout";
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
  const dragRef = useRef<{ cardH: number; cardW: number; cardX: number; cardY: number; id: string; moved: boolean; pointerId: number; startX: number; startY: number } | null>(null);
  const suppressClickRef = useRef(false);
  const [width, setWidth] = useState(1080);
  const [cardOverrides, setCardOverrides] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);

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
  const pointById = new Map(layout.points.map((point) => [point.id, point]));
  const displayCards = layout.cards.map((card) => {
    const override = cardOverrides[card.id];
    const point = pointById.get(card.id);
    if (!override || !point) return card;
    return { ...card, x: override.x, y: override.y, side: getConnectorSide(point, override) };
  });

  function canvasPoint(event: React.PointerEvent<HTMLElement>) {
    const canvas = shellRef.current?.firstElementChild as HTMLElement | null;
    const rect = canvas?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return null;
    return { x: ((event.clientX - rect.left) / rect.width) * layout.width, y: ((event.clientY - rect.top) / rect.height) * layout.height };
  }

  function startCardDrag(event: React.PointerEvent<HTMLElement>, card: RoadmapCardPlacement) {
    if (event.button !== 0) return;
    const point = canvasPoint(event);
    const canvas = shellRef.current?.firstElementChild as HTMLElement | null;
    const canvasRect = canvas?.getBoundingClientRect();
    const cardRect = event.currentTarget.getBoundingClientRect();
    if (!point || !canvasRect || canvasRect.width === 0 || canvasRect.height === 0) return;
    const cardW = (cardRect.width / canvasRect.width) * layout.width;
    const cardH = (cardRect.height / canvasRect.height) * layout.height;
    dragRef.current = { cardH, cardW, cardX: card.x, cardY: card.y, id: card.id, moved: false, pointerId: event.pointerId, startX: point.x, startY: point.y };
    suppressClickRef.current = false;
    setDraggingId(card.id);
  }

  function dragCard(event: React.PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const point = canvasPoint(event);
    if (!point) return;
    const dx = point.x - drag.startX;
    const dy = point.y - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) > 6) {
      drag.moved = true;
      suppressClickRef.current = true;
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (!drag.moved) return;
    event.preventDefault();
    const x = clamp(drag.cardX + dx, drag.cardW / 2 + 18, layout.width - drag.cardW / 2 - 18);
    const y = clamp(drag.cardY + dy, drag.cardH / 2 + 18, layout.height - drag.cardH / 2 - 18);
    setCardOverrides((current) => ({ ...current, [drag.id]: { x, y } }));
  }

  function endCardDrag(event: React.PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const moved = drag.moved;
    dragRef.current = null;
    setDraggingId(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (moved) {
      window.setTimeout(() => { suppressClickRef.current = false; }, 0);
    }
  }

  function stopClickAfterDrag(event: React.MouseEvent<HTMLElement>) {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  }

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
          {displayCards.map((card) => {
            const point = pointById.get(card.id);
            const item = itemById.get(card.id);
            if (!point || !item) return null;
            return <g key={card.id} data-roadmap-connector data-roadmap-connector-for={card.id}><path className={styles.connector} d={buildConnectorPath(point, card)} stroke={item.tone} /><circle className={styles.connectorDot} data-roadmap-connector-dot={card.id} cx={card.x} cy={card.y} r="5" fill={item.tone} /></g>;
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
        {displayCards.map((card) => {
          const item = itemById.get(card.id);
          if (!item) return null;
          const active = selectedId === item.id;
          const content = <><div className={styles.cardTop}><span className={styles.cardKicker}><span className={styles.legendDot} style={{ "--tone": item.tone } as React.CSSProperties} />{item.sequenceLabel}</span></div><h3>{item.title}</h3><p>{item.summary}</p></>;
          return <article className={`${styles.card} ${active ? styles.cardActive : ""} ${draggingId === item.id ? styles.cardDragging : ""}`} data-roadmap-card data-roadmap-card-id={item.id} data-roadmap-card-dragging={draggingId === item.id ? "true" : undefined} key={item.id} style={{ left: card.x, top: card.y, "--tone": item.tone } as React.CSSProperties} onClickCapture={stopClickAfterDrag} onMouseEnter={() => select(item.id)} onPointerCancel={endCardDrag} onPointerDown={(event) => startCardDrag(event, card)} onPointerMove={dragCard} onPointerUp={endCardDrag}>
            {renderHref ? <Link className={styles.cardLink} draggable={false} href={renderHref(item)}>{content}</Link> : <button type="button" onClick={() => select(item.id)}>{content}</button>}
          </article>;
        })}
      </div>
    </div>
    <div className={styles.accessibleList} aria-label="Lista textual equivalente del roadmap">
      {items.map((item) => renderHref ? <Link href={renderHref(item)} key={item.id}><b>{item.sequenceLabel}: {item.title}</b><br />{item.summary}</Link> : <button key={item.id} type="button" onClick={() => select(item.id)}><b>{item.sequenceLabel}: {item.title}</b><br />{item.summary}</button>)}
    </div>
  </>;
}

function getConnectorSide(point: RoadmapPoint, card: { x: number; y: number }): -1 | 0 | 1 {
  const dx = Math.abs(card.x - point.x);
  const dy = card.y - point.y;
  if (Math.abs(dy) > 72 || Math.abs(dy) > dx * 0.45) return dy >= 0 ? 1 : -1;
  return 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
