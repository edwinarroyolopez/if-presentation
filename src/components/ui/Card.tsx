import { cn } from "@/lib/design-system/utils";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <article className={cn("card", className)}>{children}</article>;
}

export function CardHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return <header style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12 }}><div><h3>{title}</h3>{description ? <p>{description}</p> : null}</div>{action}</header>;
}
