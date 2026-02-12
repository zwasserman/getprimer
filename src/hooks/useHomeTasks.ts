import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { differenceInDays, parseISO, getMonth } from "date-fns";

export type TaskTemplate = Tables<"task_templates">;
export type HomeTask = Tables<"home_tasks">;
export type HomeProfile = Tables<"home_profiles">;

export interface SurfacedTask extends TaskTemplate {
  homeTaskId: string;
  status: "completed" | "overdue" | "due" | "upcoming";
  urgency: "red" | "yellow" | "green";
  nextDueAt: Date | null;
  isVisible: boolean;
  tier: "T1" | "T2" | "T3" | "T4";
}

/**
 * Maps month (0-11) to current season.
 */
function getCurrentSeason(): string {
  const month = getMonth(new Date());
  if (month >= 2 && month <= 4) return "Spring";
  if (month >= 5 && month <= 7) return "Summer";
  if (month >= 8 && month <= 10) return "Fall";
  return "Winter";
}

/**
 * Checks if a task is in-season based on its season field.
 * Tasks with no season or "All" are always in-season.
 * Tasks with "Spring + Fall" match either season.
 */
function isInSeason(task: TaskTemplate): boolean {
  if (!task.season) return true;
  const current = getCurrentSeason();
  const seasons = task.season.split(/\s*\+\s*/).map((s) => s.trim());
  return seasons.some((s) => s.toLowerCase() === current.toLowerCase() || s.toLowerCase() === "all");
}

/**
 * Calculates which tier should be visible based on completion of earlier tiers.
 */
function getVisibleTiers(
  tasks: (TaskTemplate & { completed: boolean })[],
): Set<"T1" | "T2" | "T3" | "T4"> {
  const visibleTiers = new Set<"T1" | "T2" | "T3" | "T4">(["T1"]);

  const t1Tasks = tasks.filter((t) => t.tier === "T1");
  const t1Complete = t1Tasks.length > 0 && t1Tasks.every((t) => t.completed);

  if (t1Complete) {
    visibleTiers.add("T2");

    const t2Tasks = tasks.filter((t) => t.tier === "T2");
    const t2Complete = t2Tasks.length > 0 && t2Tasks.every((t) => t.completed);

    if (t2Complete) {
      visibleTiers.add("T3");
      visibleTiers.add("T4");
    }
  }

  return visibleTiers;
}

/**
 * Determines if a task should be skipped based on home profile features.
 */
function shouldSkipTask(task: TaskTemplate, profile: HomeProfile): boolean {
  if (!task.skip_conditions || task.skip_conditions.length === 0) {
    return false;
  }

  for (const condition of task.skip_conditions) {
    const profileKey = condition
      .replace("no_", "has_")
      .replace(/_/g, "_") as keyof HomeProfile;

    if (condition.startsWith("no_")) {
      if (profile[profileKey] === false) {
        return true;
      }
    }
  }

  return false;
}

function calculateStatus(nextDueAt: Date | null, isCompleted: boolean): "completed" | "overdue" | "due" | "upcoming" {
  if (isCompleted) return "completed";
  if (!nextDueAt) return "upcoming";

  const daysUntilDue = differenceInDays(nextDueAt, new Date());
  if (daysUntilDue < 0) return "overdue";
  if (daysUntilDue <= 30) return "due";
  return "upcoming";
}

function calculateUrgency(
  status: "completed" | "overdue" | "due" | "upcoming",
  nextDueAt: Date | null,
): "red" | "yellow" | "green" {
  if (status === "completed") return "green";
  if (status === "overdue") return "red";

  if (status === "due" && nextDueAt) {
    const daysUntilDue = differenceInDays(nextDueAt, new Date());
    if (daysUntilDue < 7) return "red";
    if (daysUntilDue < 14) return "yellow";
  }

  return "green";
}

export const useHomeTasks = (options?: { allTiers?: boolean }) => {
  const [tasks, setTasks] = useState<SurfacedTask[]>([]);
  const [profile, setProfile] = useState<HomeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);

      const { data: profileData, error: profileError } = await supabase
        .from("home_profiles")
        .select("*")
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profileData) {
        setError("No home profile found");
        setTasks([]);
        return;
      }

      setProfile(profileData);

      const { data: templates, error: templateError } = await supabase
        .from("task_templates")
        .select("*")
        .order("tier")
        .order("sort_order");

      if (templateError) throw templateError;

      const { data: homeTasks, error: homeTaskError } = await supabase
        .from("home_tasks")
        .select("*");

      if (homeTaskError) throw homeTaskError;

      const homeTaskMap = new Map(homeTasks?.map((ht) => [ht.template_id, ht]) || []);

      const tasksWithCompletion = (templates || []).map((t) => ({
        ...t,
        completed: (homeTaskMap.get(t.id)?.status === "completed") || false,
      }));

      const visibleTiers = getVisibleTiers(tasksWithCompletion);
      const showAllTiers = options?.allTiers ?? false;

      const surfacedTasks = (templates || [])
        .map((template) => {
          const homeTask = homeTaskMap.get(template.id);
          const isCompleted = (homeTask?.status === "completed") || false;
          const nextDueAt = homeTask?.next_due_at ? parseISO(homeTask.next_due_at) : null;

          const status = calculateStatus(nextDueAt, isCompleted);
          const urgency = calculateUrgency(status, nextDueAt);
          const isSkipped = shouldSkipTask(template, profileData);
          const isSeasonal = template.task_type === "seasonal";
          const seasonMatch = isSeasonal ? isInSeason(template) : true;
          const isVisible = showAllTiers
            ? !isSkipped
            : visibleTiers.has(template.tier as "T1" | "T2" | "T3" | "T4") &&
              !isSkipped &&
              seasonMatch;

          return {
            ...template,
            homeTaskId: homeTask?.id || "",
            status,
            urgency,
            nextDueAt,
            isVisible,
            tier: template.tier as "T1" | "T2" | "T3" | "T4",
          } as SurfacedTask;
        })
        .filter((task) => task.isVisible);

      setTasks(surfacedTasks);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [options?.allTiers]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const completeTask = useCallback(async (templateId: string) => {
    try {
      // Check if a home_task row already exists
      const { data: existing } = await supabase
        .from("home_tasks")
        .select("id, status")
        .eq("template_id", templateId)
        .maybeSingle();

      const now = new Date().toISOString();

      if (existing) {
        const newStatus = existing.status === "completed" ? "not_started" : "completed";
        await supabase
          .from("home_tasks")
          .update({
            status: newStatus,
            completed_at: newStatus === "completed" ? now : null,
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("home_tasks").insert({
          template_id: templateId,
          status: "completed",
          completed_at: now,
        });
      }

      await fetchTasks();
    } catch (err) {
      console.error("Failed to toggle task completion:", err);
    }
  }, [fetchTasks]);

  return { tasks, profile, loading, error, refetch: fetchTasks, completeTask };
};
