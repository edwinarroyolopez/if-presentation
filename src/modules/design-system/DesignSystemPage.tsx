import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PresentationPageHero, Section } from "@/components/presentation/PresentationPrimitives";

export function DesignSystemPage() {
  return <><PresentationPageHero eyebrow="Control interno" title="Design system de presentación" lead="Ruta de control no incluida como una de las seis partes. Verifica tokens, superficies, botones, badges y ritmo visual." /><Section title="Primitivas"><div className="grid grid-3"><Card><h3>Botones</h3><p><Button variant="primary">Primario</Button> <Button>Secundario</Button></p></Card><Card><h3>Badges</h3><p style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><Badge tone="info">Info</Badge><Badge tone="success">OK</Badge><Badge tone="warning">Warn</Badge><Badge tone="danger">Risk</Badge></p></Card><Card><h3>Superficie</h3><p>Token set adaptado de `if-erp` y referencias HTML.</p></Card></div></Section></>;
}
