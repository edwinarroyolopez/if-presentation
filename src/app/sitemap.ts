import type { MetadataRoute } from "next";
import { getNavigationItems } from "@/lib/content";
import { getRoadmapProjects } from "@/lib/roadmaps/roadmap-registry";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const date = new Date("2026-06-25");
  const routes = getNavigationItems().map((item) => item.route);
  const roadmapRoutes = getRoadmapProjects().map((project) => `/roadmap/${project.slug}/`);
  return [...new Set([...routes, ...roadmapRoutes])].map((route) => ({ url: `https://if-presentation.netlify.app${route}`, lastModified: date }));
}
