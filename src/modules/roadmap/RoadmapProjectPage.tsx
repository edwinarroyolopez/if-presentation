import { getRoadmapProjectNavigation } from "@/lib/roadmaps/roadmap-registry";
import type { RoadmapProject } from "@/types/roadmap";
import { RoadmapProjectSlide } from "./RoadmapProjectSlide";

export function RoadmapProjectPage({ project }: { project: RoadmapProject }) {
  const nav = getRoadmapProjectNavigation(project.slug);
  return <RoadmapProjectSlide index={nav.index} next={nav.next} previous={nav.previous} project={project} total={nav.total} />;
}
