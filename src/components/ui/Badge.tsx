import type { Tone } from "@/types/presentation";
import { cn } from "@/lib/design-system/utils";

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: Tone }) {
  return <span className={cn("badge", tone)}>{children}</span>;
}
