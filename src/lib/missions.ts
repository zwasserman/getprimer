/** Mission and tier display metadata for the task system */
import { getMonth } from "date-fns";

export function getCurrentSeason(): "fall" | "spring" {
  const month = getMonth(new Date());
  // Oct(9)-Feb(1) = fall/winter, Mar(2)-Sep(8) = spring/summer
  if (month >= 2 && month <= 8) return "spring";
  return "fall";
}

export function getSeasonLabel(season: "fall" | "spring"): string {
  return season === "fall" ? "Fall / Winter" : "Spring / Summer";
}

export const MISSION_META: Record<string, { label: string; icon: string; hook: string }> = {
  know_your_home: { label: "Know Your Home", icon: "🏠", hook: "Learn where the important stuff is" },
  seasonal_prep: { label: "Seasonal Prep", icon: "🍂", hook: "Get ready for what's coming" },
  build_your_file: { label: "Build Your File", icon: "📁", hook: "Get your important docs together" },
  find_your_people: { label: "Find Your People", icon: "👥", hook: "Know who to call before you need them" },
};

export const MISSION_ORDER = [
  "know_your_home",
  "seasonal_prep",
  "build_your_file",
  "find_your_people",
];

export const TIER_META: Record<string, { label: string; displayName: string; description: string }> = {
  T1: { label: "T1", displayName: "First Week", description: "Essential orientation tasks" },
  T2: { label: "T2", displayName: "First Month", description: "Important setup tasks" },
  T3: { label: "T3", displayName: "First Year", description: "Ongoing and seasonal maintenance" },
  T4: { label: "T4", displayName: "Reference", description: "Info to know, surface contextually" },
};

export const TIER_ORDER: ("T1" | "T2" | "T3" | "T4")[] = ["T1", "T2", "T3", "T4"];

export function getMissionLabel(mission: string | null): string {
  if (!mission) return "";
  return MISSION_META[mission]?.label || mission;
}

export function getMissionIcon(mission: string | null): string {
  if (!mission) return "";
  return MISSION_META[mission]?.icon || "";
}

/** Shorten long mission names for tight spaces */
export function getMissionShortLabel(mission: string | null): string {
  return getMissionLabel(mission);
}
