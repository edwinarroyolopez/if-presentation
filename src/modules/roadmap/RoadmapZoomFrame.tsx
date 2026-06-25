"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const zoomLevels = [0.32, 0.38, 0.42, 0.5, 0.58, 0.66, 0.72, 0.84, 0.96, 1.08] as const;
const fallbackFitZoomIndex = 5;

export function RoadmapZoomFrame({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [fitZoomIndex, setFitZoomIndex] = useState(fallbackFitZoomIndex);
  const [selectedZoomIndex, setSelectedZoomIndex] = useState<number | null>(null);
  const zoomIndex = selectedZoomIndex ?? fitZoomIndex;
  const zoom = zoomLevels[zoomIndex];

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    let animationFrame = 0;
    const updateFitZoom = () => {
      const shell = frame.querySelector<HTMLElement>("[data-roadmap-canvas]");
      const canvas = shell?.firstElementChild as HTMLElement | null;
      if (!shell || !canvas) return;

      const fit = Math.min(shell.clientWidth / canvas.offsetWidth, shell.clientHeight / canvas.offsetHeight, 1) * 0.98;
      const next = Math.max(0, zoomLevels.findLastIndex((level) => level <= fit));
      setFitZoomIndex(next);
    };
    const requestUpdate = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateFitZoom);
    };

    requestUpdate();
    const observer = new ResizeObserver(requestUpdate);
    observer.observe(frame);
    const shell = frame.querySelector<HTMLElement>("[data-roadmap-canvas]");
    if (shell) observer.observe(shell);
    const canvas = shell?.firstElementChild;
    if (canvas) observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [children]);

  return <div className="roadmap-zoom-frame" ref={frameRef} style={{ "--roadmap-zoom": zoom } as CSSProperties}>
    <div className="roadmap-zoom-controls" aria-label="Zoom del roadmap">
      <button aria-label="Reducir tamaño del roadmap" disabled={zoomIndex === 0} onClick={() => setSelectedZoomIndex(Math.max(0, zoomIndex - 1))} type="button">-</button>
      <span aria-live="polite">{Math.round(zoom * 100)}%</span>
      <button aria-label="Aumentar tamaño del roadmap" disabled={zoomIndex === zoomLevels.length - 1} onClick={() => setSelectedZoomIndex(Math.min(zoomLevels.length - 1, zoomIndex + 1))} type="button">+</button>
    </div>
    {children}
  </div>;
}
