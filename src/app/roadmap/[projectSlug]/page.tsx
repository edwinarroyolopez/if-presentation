import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoadmapBySlug, getRoadmapStaticParams } from "@/lib/roadmaps/roadmap-registry";
import { RoadmapProjectPage } from "@/modules/roadmap/RoadmapProjectPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return getRoadmapStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ projectSlug: string }> }): Promise<Metadata> {
  const { projectSlug } = await params;
  const project = getRoadmapBySlug(projectSlug);
  if (!project) return {};
  return {
    title: `${project.title} · Roadmap InflightOS`,
    description: project.summary,
    alternates: { canonical: `/roadmap/${project.slug}/` },
  };
}

export default async function Page({ params }: { params: Promise<{ projectSlug: string }> }) {
  const { projectSlug } = await params;
  const project = getRoadmapBySlug(projectSlug);
  if (!project) notFound();
  return <RoadmapProjectPage project={project} />;
}
