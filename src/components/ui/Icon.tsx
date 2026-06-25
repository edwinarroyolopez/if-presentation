import { Bot, BrainCircuit, Check, Database, GitBranch, Mail, Maximize, Menu, Play, Route, X } from "lucide-react";

export type IconName = "menu" | "close" | "play" | "road" | "arch" | "data" | "event" | "ai" | "brain" | "fullscreen" | "check";

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const IconComponent = icons[name];

  return <IconComponent aria-hidden="true" size={size} strokeWidth={2} />;
}

const icons = {
  menu: Menu,
  close: X,
  play: Play,
  road: Route,
  arch: GitBranch,
  data: Database,
  event: Mail,
  ai: Bot,
  brain: BrainCircuit,
  fullscreen: Maximize,
  check: Check,
} satisfies Record<IconName, typeof Menu>;
