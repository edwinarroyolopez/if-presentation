export type RoadmapDensity = "comfortable" | "dense";
export type RoadmapVariant = "portfolio" | "project";

export type RoadmapLayoutItem = {
  id: string;
};

export type RoadmapPoint = {
  id: string;
  x: number;
  y: number;
  row: number;
  indexInRow: number;
  direction: 1 | -1;
};

export type RoadmapRect = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  w: number;
  h: number;
};

export type RoadmapCardPlacement = {
  id: string;
  x: number;
  y: number;
  side: -1 | 0 | 1;
  box: RoadmapRect;
};

export type RoadmapLayout = {
  width: number;
  height: number;
  rows: number;
  perRow: number;
  points: RoadmapPoint[];
  cards: RoadmapCardPlacement[];
  path: string;
};

const CARD_W = 246;
const CARD_H = 124;

export function computeRoadmapLayout({ items, width, density, variant }: { items: RoadmapLayoutItem[]; width: number; density: RoadmapDensity; variant: RoadmapVariant }): RoadmapLayout {
  const safeWidth = Number.isFinite(width) ? Math.max(320, width) : 960;
  const mobile = safeWidth < 340;
  const count = items.length;
  const minWidth = mobile ? safeWidth : density === "dense" ? 940 : 1080;
  const canvasWidth = Math.max(safeWidth, minWidth);
  const sidePad = mobile ? 92 : canvasWidth < 1100 ? 150 : 182;
  const usable = Math.max(1, canvasWidth - sidePad * 2);
  const slot = density === "dense" ? 270 : 330;
  const maxPerRow = mobile ? 1 : variant === "project" ? 4 : density === "dense" ? 4 : 4;
  const minPerRow = count <= 1 ? 1 : mobile ? 1 : 2;
  const perRow = Math.max(minPerRow, Math.min(maxPerRow, Math.floor(usable / slot) + 1));
  const rows = Math.max(1, Math.ceil(Math.max(count, 1) / perRow));
  const topPad = mobile ? 190 : density === "dense" ? 185 : 230;
  const rowPitch = mobile ? 330 : density === "dense" ? 340 : 430;
  const bottomPad = mobile ? 205 : density === "dense" ? 205 : 245;
  const height = Math.max(360, topPad + (rows - 1) * rowPitch + bottomPad);
  const points: RoadmapPoint[] = [];

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / perRow);
    const indexInRow = i % perRow;
    const itemsInRow = Math.min(perRow, count - row * perRow);
    const direction = row % 2 === 0 ? 1 : -1;
    const divisor = Math.max(itemsInRow - 1, 1);
    const localProgress = itemsInRow === 1 ? 0.5 : indexInRow / divisor;
    const naturalX = sidePad + usable * localProgress;
    const x = mobile ? canvasWidth / 2 + Math.sin(row * Math.PI) * 0 : direction === 1 ? naturalX : canvasWidth - naturalX;
    const wave = mobile ? 0 : Math.sin(localProgress * Math.PI * 2 - Math.PI / 2) * (density === "dense" ? 22 : 32);
    const y = topPad + row * rowPitch + wave;
    points.push({ id: items[i].id, x, y, row, indexInRow, direction });
  }

  const placed: RoadmapRect[] = [];
  const stationBoxes = points.map((point) => rectFromCenter(point.x, point.y, 144, 144));
  const cards = points.map((point) => {
    const card = chooseBestCardPosition(point, { width: canvasWidth, height, density, mobile }, placed, stationBoxes);
    placed.push(card.box);
    return { ...card, id: point.id };
  });

  return { width: canvasWidth, height, rows, perRow, points, cards, path: buildCatmullRomPath(points) };
}

export function buildCatmullRomPath(points: RoadmapPoint[]) {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const p = points[0];
    return `M ${format(p.x - 76)} ${format(p.y)} C ${format(p.x - 38)} ${format(p.y - 26)}, ${format(p.x + 38)} ${format(p.y + 26)}, ${format(p.x + 76)} ${format(p.y)}`;
  }
  let d = `M ${format(points[0].x)} ${format(points[0].y)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const tension = 0.72;
    const cp1x = p1.x + ((p2.x - p0.x) / 6) * tension;
    const cp1y = p1.y + ((p2.y - p0.y) / 6) * tension;
    const cp2x = p2.x - ((p3.x - p1.x) / 6) * tension;
    const cp2y = p2.y - ((p3.y - p1.y) / 6) * tension;
    d += ` C ${format(cp1x)} ${format(cp1y)}, ${format(cp2x)} ${format(cp2y)}, ${format(p2.x)} ${format(p2.y)}`;
  }
  return d;
}

export function getCandidateCardPositions(point: RoadmapPoint, options: { density: RoadmapDensity; mobile: boolean }) {
  if (options.mobile) {
    const side = point.row % 2 === 0 ? 1 : -1;
    return [
      { x: point.x + side * 104, y: point.y + 142, side: 1 as const, rank: 0 },
      { x: point.x - side * 104, y: point.y + 142, side: 1 as const, rank: 1 },
      { x: point.x, y: point.y + 160, side: 1 as const, rank: 2 },
    ];
  }
  const preferredSide = (point.indexInRow + point.row) % 2 === 0 ? -1 : 1;
  const yDist = options.density === "dense" ? 158 : 178;
  const far = options.density === "dense" ? 224 : 244;
  const diagonal = options.density === "dense" ? 174 : 190;
  return [
    { x: point.x, y: point.y + preferredSide * yDist, side: preferredSide as -1 | 1, rank: 0 },
    { x: point.x, y: point.y - preferredSide * yDist, side: -preferredSide as -1 | 1, rank: 1 },
    { x: point.x + 18 * point.direction, y: point.y + preferredSide * far, side: preferredSide as -1 | 1, rank: 2 },
    { x: point.x - 18 * point.direction, y: point.y - preferredSide * far, side: -preferredSide as -1 | 1, rank: 3 },
    { x: point.x + diagonal * point.direction, y: point.y + preferredSide * yDist, side: preferredSide as -1 | 1, rank: 4 },
    { x: point.x - diagonal * point.direction, y: point.y - preferredSide * yDist, side: -preferredSide as -1 | 1, rank: 5 },
    { x: point.x + 214, y: point.y, side: 0 as const, rank: 6 },
    { x: point.x - 214, y: point.y, side: 0 as const, rank: 7 },
  ];
}

export function calculateOverlapArea(a: RoadmapRect, b: RoadmapRect, gap = 16) {
  const x = Math.max(0, Math.min(a.x2 + gap, b.x2) - Math.max(a.x1 - gap, b.x1));
  const y = Math.max(0, Math.min(a.y2 + gap, b.y2) - Math.max(a.y1 - gap, b.y1));
  return x * y;
}

export function calculateBoundaryPenalty(box: RoadmapRect, layout: { width: number; height: number }) {
  let penalty = 0;
  if (box.x1 < 18) penalty += (18 - box.x1) * 80;
  if (box.x2 > layout.width - 18) penalty += (box.x2 - (layout.width - 18)) * 80;
  if (box.y1 < 18) penalty += (18 - box.y1) * 80;
  if (box.y2 > layout.height - 18) penalty += (box.y2 - (layout.height - 18)) * 80;
  return penalty;
}

export function chooseBestCardPosition(point: RoadmapPoint, layout: { width: number; height: number; density: RoadmapDensity; mobile: boolean }, placed: RoadmapRect[], stationBoxes: RoadmapRect[]) {
  let best: (RoadmapCardPlacement & { score: number; overlap: number; stationOverlap: number }) | undefined;
  const candidates = getCandidateCardPositions(point, layout);
  for (const candidate of candidates) {
    const x = clamp(candidate.x, CARD_W / 2 + 22, layout.width - CARD_W / 2 - 22);
    const y = clamp(candidate.y, CARD_H / 2 + 22, layout.height - CARD_H / 2 - 22);
    const box = rectFromCenter(x, y);
    const overlap = placed.reduce((sum, other) => sum + calculateOverlapArea(box, other), 0);
    const stationOverlap = stationBoxes.reduce((sum, stationBox) => sum + calculateOverlapArea(box, stationBox, 14), 0);
    const score: number = overlap * 8 + stationOverlap * 26 + calculateBoundaryPenalty(box, layout) + Math.hypot(x - point.x, y - point.y) * 0.18 + candidate.rank * 12;
    const scored = { id: point.id, x, y, side: candidate.side, box, score, overlap, stationOverlap };
    if (!best || scored.score < best.score) best = scored;
  }
  if (!best) return { id: point.id, x: point.x, y: point.y, side: 1 as const, box: rectFromCenter(point.x, point.y) };
  for (let step = 0; step < 18 && (best.overlap > 0 || best.stationOverlap > 0); step++) {
    const direction = best.side === 0 ? (best.y >= point.y ? 1 : -1) : best.side;
    const y = clamp(best.y + direction * 14, CARD_H / 2 + 22, layout.height - CARD_H / 2 - 22);
    const box = rectFromCenter(best.x, y);
    const overlap = placed.reduce((sum, other) => sum + calculateOverlapArea(box, other), 0);
    const stationOverlap = stationBoxes.reduce((sum, stationBox) => sum + calculateOverlapArea(box, stationBox, 14), 0);
    const score: number = overlap * 8 + stationOverlap * 26 + calculateBoundaryPenalty(box, layout) + Math.hypot(best.x - point.x, y - point.y) * 0.18;
    if (score <= best.score) best = { ...best, y, box, overlap, stationOverlap, score };
  }
  if (best.overlap > 0 || best.stationOverlap > 0) {
    for (const candidate of candidates) {
      for (const xOffset of [-192, -132, -66, 0, 66, 132, 192]) {
        for (const yOffset of [-126, -84, -42, 0, 42, 84, 126]) {
          const x = clamp(candidate.x + xOffset, CARD_W / 2 + 22, layout.width - CARD_W / 2 - 22);
          const y = clamp(candidate.y + yOffset, CARD_H / 2 + 22, layout.height - CARD_H / 2 - 22);
          const box = rectFromCenter(x, y);
          const overlap = placed.reduce((sum, other) => sum + calculateOverlapArea(box, other), 0);
          const stationOverlap = stationBoxes.reduce((sum, stationBox) => sum + calculateOverlapArea(box, stationBox, 14), 0);
          const score: number = overlap * 12 + stationOverlap * 30 + calculateBoundaryPenalty(box, layout) + Math.hypot(x - point.x, y - point.y) * 0.2 + candidate.rank * 12;
          if (score < best.score) best = { id: point.id, x, y, side: candidate.side, box, score, overlap, stationOverlap };
        }
      }
    }
  }
  return { id: best.id, x: best.x, y: best.y, side: best.side, box: best.box };
}

export function buildConnectorPath(point: RoadmapPoint, card: RoadmapCardPlacement) {
  const target = connectorTarget(card, point);
  if (card.side === 0) {
    const dir = card.x > point.x ? 1 : -1;
    return `M ${format(point.x + dir * 48)} ${format(point.y)} C ${format(point.x + dir * 90)} ${format(point.y)}, ${format(target.x - dir * 90)} ${format(target.y)}, ${format(target.x)} ${format(target.y)}`;
  }
  return `M ${format(point.x)} ${format(point.y + card.side * 50)} C ${format(point.x)} ${format(point.y + card.side * 88)}, ${format(target.x)} ${format(target.y - card.side * 56)}, ${format(target.x)} ${format(target.y)}`;
}

function connectorTarget(card: RoadmapCardPlacement, point: RoadmapPoint) {
  if (card.side === 0) {
    const dir = card.x > point.x ? -1 : 1;
    return { x: card.x + dir * CARD_W / 2, y: card.y };
  }
  return { x: card.x, y: card.y - card.side * CARD_H / 2 };
}

function rectFromCenter(x: number, y: number, w = CARD_W, h = CARD_H): RoadmapRect {
  return { x1: x - w / 2, y1: y - h / 2, x2: x + w / 2, y2: y + h / 2, w, h };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function format(value: number) {
  return Number.isFinite(value) ? value.toFixed(1) : "0.0";
}
