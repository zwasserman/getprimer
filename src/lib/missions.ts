/** Mission and tier display metadata for the task system */

export const MISSION_META: Record<string, { label: string; icon: string; hook: string }> = {
  know_your_home: { label: "Know Your Home", icon: "🏠", hook: "Learn where the important stuff is" },
  keep_it_running: { label: "Keep It Running", icon: "⚙️", hook: "Small habits that prevent big problems" },
  protect_your_investment: { label: "Protect Your Investment", icon: "🛡️", hook: "Avoid expensive surprises" },
  build_your_file: { label: "Build Your File", icon: "📁", hook: "Keep your info where you can find it" },
  find_your_people: { label: "Find Your People", icon: "👥", hook: "Know who to call before you need them" },
};

export const MISSION_ORDER = [
  "know_your_home",
  "keep_it_running",
  "protect_your_investment",
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
  if (mission === "protect_your_investment") return "Protect";
  return getMissionLabel(mission);
}
