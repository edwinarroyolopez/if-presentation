import { getPresentationContent } from "@/lib/content";
import { ItemGrid, NumberList, PresentationPageHero, Section } from "@/components/presentation/PresentationPrimitives";

export function ArchitectureReviewPage() {
  const { architecture } = getPresentationContent();
  return <><PresentationPageHero eyebrow="Parte 1 · Arquitectura" title="Revisión de arquitectura InflightOS" lead={architecture.summary} /><Section title="5 fortalezas" description="No se presentan como lista plana: cada fortaleza conecta con un efecto operativo."><ItemGrid items={architecture.strengths} columns={3} /></Section><Section title="Matriz de 5 riesgos" description="Riesgos priorizados por impacto en entrega, operación e interoperabilidad."><div className="grid grid-2"><NumberList items={architecture.risks} /><div className="card"><h3>Principio de mitigación</h3><p>No escalar módulos sin contratos, ownership y métricas. El MVP debe probar valor antes de expandir capacidades periféricas.</p></div></div></Section><Section title="3 áreas diferidas" description="Diferir no significa descartar; significa proteger el MVP."><ItemGrid items={architecture.deferred} columns={3} /></Section><Section title="Pila de prioridades"><NumberList items={architecture.priorities} /></Section></>;
}
