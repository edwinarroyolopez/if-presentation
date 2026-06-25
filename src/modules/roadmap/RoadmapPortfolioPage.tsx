import { getRoadmapCatalog, getRoadmapProjects } from "@/lib/roadmaps/roadmap-registry";
import { RoadmapPortfolioSlide } from "./RoadmapPortfolioSlide";

export function RoadmapPortfolioPage() {
  const catalog = getRoadmapCatalog();
  const projects = getRoadmapProjects();
  return <RoadmapPortfolioSlide catalog={catalog} projects={projects} />;
}
