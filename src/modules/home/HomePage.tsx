import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getPresentationContent } from "@/lib/content";
import { ItemGrid, PresentationPageHero, Section } from "@/components/presentation/PresentationPrimitives";

export function HomePage() {
  const { home } = getPresentationContent();
  return <><PresentationPageHero eyebrow="Preámbulo · 0 de 6" title={home.title} lead={home.intro} meta={<div className="radar"><span className="sr-only">Indicador visual InflightOS</span><b>0/6</b></div>} /><div className="grid grid-2"><section className="card"><div className="kicker">Contexto de negocio</div><h2>Sistemas incluidos</h2><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{home.systems.map((system) => <Badge key={system} tone="info">{system}</Badge>)}</div></section><section className="card"><div className="kicker">Recomendación general</div><h2>Entregas iterativas, no big bang</h2><p>{home.recommendation}</p><p style={{ marginTop: 16 }}><ButtonLink href="/architecture-review/" variant="primary">Comenzar presentación</ButtonLink></p></section></div><Section title="Índice visual" description="Las seis partes se navegan linealmente o desde el menú."><ItemGrid items={home.parts} columns={3} /></Section></>;
}
