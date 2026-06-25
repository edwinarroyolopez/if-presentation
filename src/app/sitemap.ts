import type { MetadataRoute } from "next";
import { getNavigationItems } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return getNavigationItems().map((item) => ({ url: `https://if-presentation.netlify.app${item.route}`, lastModified: new Date("2026-06-25") }));
}
