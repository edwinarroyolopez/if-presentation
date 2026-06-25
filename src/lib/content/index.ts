import navigation from "@/data/navigation.json";
import home from "@/data/home.json";
import architecture from "@/data/architecture-review.json";
import integration from "@/data/systems-integration.json";
import dataModeling from "@/data/data-modeling.json";
import aiStrategy from "@/data/ai-strategy.json";
import executiveScenario from "@/data/executive-scenario.json";
import type { NavigationItem, PresentationContent } from "@/types/presentation";
import { presentationSchema } from "./schema";

const parsed = presentationSchema.parse({ navigation, home, architecture, integration, dataModeling, aiStrategy, executiveScenario }) as PresentationContent;

export function getPresentationContent() {
  return parsed;
}

export function getNavigationItems() {
  return parsed.navigation.items;
}

export function getRouteProgress(pathname: string) {
  const normalized = normalizePath(pathname);
  const index = parsed.navigation.items.findIndex((item) => isRouteActive(item.route, normalized));
  const item = parsed.navigation.items[index] ?? parsed.navigation.items[0];
  const percent = item.part === 0 ? 0 : Math.round((item.part / 6) * 100);
  return { item, index, percent, previous: parsed.navigation.items[index - 1], next: parsed.navigation.items[index + 1] };
}

export function getPreviousNext(route: string): { previous?: NavigationItem; next?: NavigationItem } {
  const index = parsed.navigation.items.findIndex((item) => item.route === route);
  return { previous: parsed.navigation.items[index - 1], next: parsed.navigation.items[index + 1] };
}

export function normalizePath(pathname: string) {
  if (pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function isRouteActive(route: string, pathname: string) {
  const normalizedRoute = normalizePath(route);
  const normalizedPath = normalizePath(pathname);
  if (normalizedRoute === "/") return normalizedPath === "/";
  return normalizedPath === normalizedRoute || normalizedPath.startsWith(normalizedRoute);
}
