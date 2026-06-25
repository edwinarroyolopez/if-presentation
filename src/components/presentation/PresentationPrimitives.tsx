import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { ContentItem } from "@/types/presentation";

export function PresentationPageHero({ eyebrow, title, lead, meta }: { eyebrow: string; title: string; lead: string; meta?: React.ReactNode }) {
  return <section className="page-hero"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="lead">{lead}</p></div><div className="hero-panel">{meta ?? <div className="radar"><b>IO</b></div>}</div></section>;
}

export function ItemGrid({ items, columns = 3 }: { items: ContentItem[]; columns?: 2 | 3 | 4 }) {
  return <div className={`grid grid-${columns}`}>{items.map((item, index) => <Card key={item.id}><Badge tone={item.tone}>{String(index + 1).padStart(2, "0")}</Badge><h3 style={{ marginTop: 12 }}>{item.title}</h3><p>{item.description}</p></Card>)}</div>;
}

export function NumberList({ items }: { items: ContentItem[] }) {
  return <ol className="card-list">{items.map((item, index) => <li className="number-row" key={item.id}><span className="num">{index + 1}</span><div><h3>{item.title}</h3><p>{item.description}</p></div></li>)}</ol>;
}

export function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return <section className="section" style={{ marginTop: 18 }}><header style={{ marginBottom: 16 }}><div className="kicker">{title}</div>{description ? <p>{description}</p> : null}</header>{children}</section>;
}

export function PresentationSlide({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={className ? `presentation-slide ${className}` : "presentation-slide"} data-presentation-slide>{children}</section>;
}

export function PresentationSlideHeader({ actions, eyebrow, meta, title, thesis }: { actions?: React.ReactNode; eyebrow: string; meta?: React.ReactNode; title: string; thesis?: string }) {
  return <header className="presentation-slide-head"><div className="presentation-slide-title"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{thesis ? <p className="presentation-thesis">{thesis}</p> : null}</div><div className="presentation-slide-side">{meta ? <div className="presentation-slide-meta">{meta}</div> : null}{actions}</div></header>;
}

export function PresentationSlideBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className ? `presentation-slide-body ${className}` : "presentation-slide-body"}>{children}</div>;
}

export function PresentationSlideFooter({ children }: { children: React.ReactNode }) {
  return <footer className="presentation-slide-foot">{children}</footer>;
}

export function PresentationCallout({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "danger" | "success" }) {
  return <div className={`presentation-callout ${tone}`}>{children}</div>;
}

export function CompactList({ items, limit = 3 }: { items: string[]; limit?: number }) {
  return <ul className="compact-list">{items.slice(0, limit).map((item) => <li key={item}>{item}</li>)}</ul>;
}
