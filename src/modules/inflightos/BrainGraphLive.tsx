"use client";

import { useEffect, useRef } from "react";
import styles from "./InflightOSPage.module.css";

export type BrainGraphSnapshot = {
  projects: Array<{ id: string; color: string; nodes: number; links: number }>;
  nodes: Array<{ id: string; project: string; weight: number }>;
  links: Array<{ source: string; target: string; relation: string }>;
};

type Particle = BrainGraphSnapshot["nodes"][number] & {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tx: number;
  ty: number;
  radius: number;
  seed: number;
  color: string;
};

type InteractionState = {
  activeId: string | null;
  draggingId: string | null;
  offsetX: number;
  offsetY: number;
};

export function BrainGraphLive({ snapshot }: { snapshot: BrainGraphSnapshot }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const interactionRef = useRef<InteractionState>({ activeId: null, draggingId: null, offsetX: 0, offsetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particlesRef.current = createParticles(snapshot, width, height);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const pointerPosition = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };

    const setActiveParticle = (particle: Particle | null) => {
      interactionRef.current.activeId = particle?.id ?? null;
      canvas.style.cursor = particle ? "grab" : "default";
    };

    const handlePointerDown = (event: PointerEvent) => {
      const position = pointerPosition(event);
      const particle = findParticleAt(particlesRef.current, position.x, position.y);
      if (!particle) {
        return;
      }

      event.preventDefault();
      canvas.setPointerCapture(event.pointerId);
      interactionRef.current = {
        activeId: particle.id,
        draggingId: particle.id,
        offsetX: particle.x - position.x,
        offsetY: particle.y - position.y,
      };
      canvas.style.cursor = "grabbing";
    };

    const handlePointerMove = (event: PointerEvent) => {
      const position = pointerPosition(event);
      const interaction = interactionRef.current;

      if (interaction.draggingId) {
        const particle = particlesRef.current.find((candidate) => candidate.id === interaction.draggingId);
        if (!particle) {
          return;
        }

        particle.x = clamp(position.x + interaction.offsetX, 18, width - 18);
        particle.y = clamp(position.y + interaction.offsetY, 18, height - 18);
        particle.tx = particle.x;
        particle.ty = particle.y;
        particle.vx = 0;
        particle.vy = 0;
        interaction.activeId = particle.id;
        canvas.style.cursor = "grabbing";
        return;
      }

      setActiveParticle(findParticleAt(particlesRef.current, position.x, position.y));
    };

    const endDrag = (event: PointerEvent) => {
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }

      interactionRef.current.draggingId = null;
      const position = pointerPosition(event);
      setActiveParticle(findParticleAt(particlesRef.current, position.x, position.y));
    };

    const handlePointerLeave = () => {
      if (interactionRef.current.draggingId) {
        return;
      }

      interactionRef.current.activeId = null;
      canvas.style.cursor = "default";
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.addEventListener("pointerleave", handlePointerLeave);

    const draw = (time: number) => {
      const particles = particlesRef.current;
      const particlesById = new Map(particles.map((particle) => [particle.id, particle]));
      const activeId = interactionRef.current.draggingId ?? interactionRef.current.activeId;
      const relatedIds = activeId ? buildRelatedIds(snapshot, activeId) : new Set<string>();
      context.clearRect(0, 0, width, height);
      drawField(context, width, height, time);
      drawLinks(context, snapshot, particlesById, time, activeId);
      drawProjects(context, snapshot, width, height, time);
      drawParticles(context, particles, time, reducedMotion, activeId, relatedIds);
      drawGlow(context, width, height, time);

      animationFrame = window.requestAnimationFrame(draw);
    };

    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      observer.disconnect();
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [snapshot]);

  return (
    <div className={styles.liveGraphShell}>
      <canvas ref={canvasRef} className={styles.liveGraph} aria-label="Snapshot dinamico del grafo global de graphify-if" />
      <div className={styles.graphOverlay}>
        <span>if-global.graph.json</span>
        <strong>{snapshot.nodes.length.toLocaleString("es")} puntos renderizados</strong>
      </div>
      <div className={styles.projectRail} aria-label="Proyectos incluidos en el grafo global">
        {snapshot.projects.map((project) => (
          <span key={project.id} className={styles.projectChip}>
            <span style={{ background: project.color }} />
            {project.id}
          </span>
        ))}
      </div>
    </div>
  );
}

function createParticles(snapshot: BrainGraphSnapshot, width: number, height: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const orbit = Math.min(width, height) * 0.31;
  const projectIndex = new Map(snapshot.projects.map((project, index) => [project.id, index]));
  const projectColor = new Map(snapshot.projects.map((project) => [project.id, project.color]));
  const projectCounts = new Map<string, number>();

  return snapshot.nodes.map((node) => {
    const index = projectIndex.get(node.project) ?? 0;
    const total = Math.max(snapshot.projects.length, 1);
    const local = projectCounts.get(node.project) ?? 0;
    projectCounts.set(node.project, local + 1);
    const clusterAngle = -Math.PI / 2 + (index / total) * Math.PI * 2;
    const localAngle = hashToUnit(`${node.id}:angle`) * Math.PI * 2;
    const localRadius = (0.18 + hashToUnit(`${node.id}:radius`) * 0.82) * Math.min(130, orbit * 0.42);
    const tx = centerX + Math.cos(clusterAngle) * orbit + Math.cos(localAngle) * localRadius;
    const ty = centerY + Math.sin(clusterAngle) * orbit + Math.sin(localAngle) * localRadius;
    const seed = hashToUnit(node.id);

    return {
      ...node,
      x: centerX + (seed - 0.5) * width * 0.5,
      y: centerY + (hashToUnit(`${node.id}:y`) - 0.5) * height * 0.5,
      vx: 0,
      vy: 0,
      tx,
      ty,
      radius: Math.max(1.5, Math.min(5.4, 1.2 + Math.sqrt(node.weight) * 0.48)),
      seed,
      color: projectColor.get(node.project) ?? "#22d3ee",
    };
  });
}

function drawField(context: CanvasRenderingContext2D, width: number, height: number, time: number) {
  const gradient = context.createRadialGradient(width * 0.5, height * 0.48, 20, width * 0.5, height * 0.48, Math.max(width, height) * 0.68);
  gradient.addColorStop(0, "rgba(34, 211, 238, 0.16)");
  gradient.addColorStop(0.42, "rgba(56, 189, 248, 0.055)");
  gradient.addColorStop(1, "rgba(2, 8, 12, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.save();
  context.globalAlpha = 0.22;
  context.strokeStyle = "rgba(148, 163, 184, 0.16)";
  context.lineWidth = 1;
  const shift = (time * 0.012) % 32;
  for (let x = -32 + shift; x < width + 32; x += 32) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + height * 0.18, height);
    context.stroke();
  }
  context.restore();
}

function drawProjects(context: CanvasRenderingContext2D, snapshot: BrainGraphSnapshot, width: number, height: number, time: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const orbit = Math.min(width, height) * 0.31;
  context.save();
  context.lineWidth = 1.2;
  snapshot.projects.forEach((project, index) => {
    const angle = -Math.PI / 2 + (index / Math.max(snapshot.projects.length, 1)) * Math.PI * 2;
    const pulse = Math.sin(time * 0.0012 + index) * 8;
    const x = centerX + Math.cos(angle) * orbit;
    const y = centerY + Math.sin(angle) * orbit;
    context.beginPath();
    context.strokeStyle = withAlpha(project.color, 0.42);
    context.arc(x, y, 44 + pulse, 0, Math.PI * 2);
    context.stroke();
  });
  context.restore();
}

function drawLinks(context: CanvasRenderingContext2D, snapshot: BrainGraphSnapshot, particlesById: Map<string, Particle>, time: number, activeId: string | null) {
  context.save();
  for (const link of snapshot.links) {
    const source = particlesById.get(link.source);
    const target = particlesById.get(link.target);
    if (!source || !target) {
      continue;
    }
    const activeLink = Boolean(activeId && (source.id === activeId || target.id === activeId));
    const alpha = activeId ? (activeLink ? 0.86 : 0.035) : source.project === target.project ? 0.12 : 0.28;
    context.lineWidth = activeLink ? 2.2 : 0.75;
    context.strokeStyle = withAlpha(activeLink ? target.color : source.color, alpha + Math.sin(time * 0.002 + source.seed * 10) * 0.035);
    context.beginPath();
    context.moveTo(source.x, source.y);
    context.lineTo(target.x, target.y);
    context.stroke();

    if (activeLink) {
      const progress = (time * 0.0012 + source.seed) % 1;
      context.beginPath();
      context.fillStyle = withAlpha("#ffffff", 0.86);
      context.arc(source.x + (target.x - source.x) * progress, source.y + (target.y - source.y) * progress, 2.2, 0, Math.PI * 2);
      context.fill();
    }
  }
  context.restore();
}

function drawParticles(context: CanvasRenderingContext2D, particles: Particle[], time: number, reducedMotion: boolean, activeId: string | null, relatedIds: Set<string>) {
  context.save();
  for (const particle of particles) {
    const selected = particle.id === activeId;
    const related = relatedIds.has(particle.id);
    const dimmed = Boolean(activeId && !selected && !related);

    if (!reducedMotion && !selected) {
      const driftX = Math.sin(time * 0.001 + particle.seed * 12) * 18;
      const driftY = Math.cos(time * 0.0013 + particle.seed * 10) * 18;
      particle.vx += (particle.tx + driftX - particle.x) * 0.006;
      particle.vy += (particle.ty + driftY - particle.y) * 0.006;
      particle.vx *= 0.86;
      particle.vy *= 0.86;
      particle.x += particle.vx;
      particle.y += particle.vy;
    }

    const pulse = 0.82 + Math.sin(time * 0.003 + particle.seed * 9) * 0.18;
    const alpha = dimmed ? 0.24 : selected ? 1 : related ? 0.9 : 0.92;
    const haloScale = selected ? 6.2 : related ? 4.7 : 3.6;
    context.beginPath();
    context.fillStyle = withAlpha(particle.color, dimmed ? 0.035 : selected ? 0.3 : related ? 0.22 : 0.16);
    context.arc(particle.x, particle.y, particle.radius * haloScale * pulse, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.fillStyle = withAlpha(particle.color, alpha);
    context.arc(particle.x, particle.y, particle.radius * (selected ? 1.35 : related ? 1.15 : 1) * pulse, 0, Math.PI * 2);
    context.fill();

    if (selected) {
      context.beginPath();
      context.strokeStyle = "rgba(255, 255, 255, 0.88)";
      context.lineWidth = 1.6;
      context.arc(particle.x, particle.y, particle.radius * 2.2 + 5, 0, Math.PI * 2);
      context.stroke();
    }
  }
  context.restore();
}

function drawGlow(context: CanvasRenderingContext2D, width: number, height: number, time: number) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * (0.19 + Math.sin(time * 0.0009) * 0.015);
  context.save();
  context.strokeStyle = "rgba(34, 211, 238, 0.22)";
  context.lineWidth = 1.4;
  context.beginPath();
  context.arc(centerX, centerY, radius, time * 0.0004, Math.PI * 1.55 + time * 0.0004);
  context.stroke();
  context.restore();
}

function withAlpha(color: string, alpha: number) {
  const value = color.replace("#", "");
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${Math.max(0, Math.min(1, alpha))})`;
}

function findParticleAt(particles: Particle[], x: number, y: number) {
  for (let index = particles.length - 1; index >= 0; index -= 1) {
    const particle = particles[index];
    const hitRadius = Math.max(10, particle.radius * 4.2);
    const distance = Math.hypot(particle.x - x, particle.y - y);
    if (distance <= hitRadius) {
      return particle;
    }
  }
  return null;
}

function buildRelatedIds(snapshot: BrainGraphSnapshot, activeId: string) {
  const related = new Set<string>([activeId]);
  for (const link of snapshot.links) {
    if (link.source === activeId) {
      related.add(link.target);
    } else if (link.target === activeId) {
      related.add(link.source);
    }
  }
  return related;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function hashToUnit(value: string) {
  let result = 0;
  for (let index = 0; index < value.length; index += 1) {
    result = (result * 31 + value.charCodeAt(index)) >>> 0;
  }
  return (result % 10000) / 10000;
}
