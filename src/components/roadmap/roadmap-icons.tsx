import { BrainCircuit, Building2, ChartNoAxesCombined, Images, Plane, ReceiptText, ShieldCheck, UsersRound } from "lucide-react";
import type { RoadmapIconName } from "@/types/roadmap";

export const roadmapIconMap = {
  plane: Plane,
  building: Building2,
  images: Images,
  finance: ReceiptText,
  compliance: ShieldCheck,
  analytics: ChartNoAxesCombined,
  people: UsersRound,
  ai: BrainCircuit,
} satisfies Record<RoadmapIconName, typeof Plane>;

export function RoadmapIcon({ name, size = 24 }: { name: RoadmapIconName; size?: number }) {
  const Icon = roadmapIconMap[name];
  return <Icon aria-hidden="true" size={size} strokeWidth={2.2} />;
}
