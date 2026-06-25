import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return <section><div className="eyebrow">404</div><h1>Ruta no encontrada</h1><p className="lead">Esta presentación se publica como exportación estática; usa el índice para volver a una sección válida.</p><p style={{ marginTop: 20 }}><ButtonLink href="/" variant="primary">Volver al inicio</ButtonLink></p></section>;
}
