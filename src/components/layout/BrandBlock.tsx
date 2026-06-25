export function BrandBlock({ subtitle = "Evaluación estratégica" }: { subtitle?: string }) {
  return <div className="brand-block"><div className="brand-row"><span aria-hidden="true" className="brand-mark">IO</span><span>Inflight<em>OS</em></span></div><div className="brand-subtitle">{subtitle}</div></div>;
}
