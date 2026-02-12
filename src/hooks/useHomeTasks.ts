import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { differenceInDays, parseISO } from "date-fns";

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
 * Calculates which tier should be visible based on completion of earlier tiers.
 * Progressive logic: T2 shows only if all T1 are complete, T3 if all T1+T2 are complete, etc.
 */
function getVisibleTiers(
  tasks: (TaskTemplate & { completed: boolean })[],
): Set<"T1" | "T2" | "T3" | "T4"> {
  const visibleTiers = new Set<"T1" | "T2" | "T3" | "T4">(["T1"]); // T1 always visible

  // Check if T1 is complete
  const t1Tasks = tasks.filter((t) => t.tier === "T1");
  const t1Complete = t1Tasks.length > 0 && t1Tasks.every((t) => t.completed);

  if (t1Complete) {
    visibleTiers.add("T2");

    // Check if T2 is complete
    const t2Tasks = tasks.filter((t) => t.tier === "T2");
    const t2Complete = t2Tasks.length > 0 && t2Tasks.every((t) => t.completed);

    if (t2Complete) {
      visibleTiers.add("T3");

      // T4 is always visible (info tasks)
      visibleTiers.add("T4");
    }
  }

  return visibleTiers;
}

/**
 * Determines if a task should be skipped based on home profile features.
 * skip_conditions is an array of feature toggles to hide the task (e.g., ["no_basement", "no_gas"])
 */
function shouldSkipTask(task: TaskTemplate, profile: HomeProfile): boolean {
  if (!task.skip_conditions || task.skip_conditions.length === 0) {
    return false;
  }

  for (const condition of task.skip_conditions) {
    // Map condition keys to profile booleans
    const profileKey = condition
      .replace("no_", "has_")
      .replace(/_/g, "_") as keyof HomeProfile;

    // If the condition negates a feature (no_basement), hide if feature is false
    if (condition.startsWith("no_")) {
      if (profile[profileKey] === false) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Calculates task status based on next_due_at date.
 */
function calculateStatus(nextDueAt: Date | null, isCompleted: boolean): "completed" | "overdue" | "due" | "upcoming" {
  if (isCompleted) return "completed";
  if (!nextDueAt) return "upcoming";

  const daysUntilDue = differenceInDays(nextDueAt, new Date());

  if (daysUntilDue < 0) return "overdue";
  if (daysUntilDue <= 30) return "due";
  return "upcoming";
}

/**
 * Calculates urgency level (red, yellow, green) based on status and days until due.
 */
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

export const useHomeTasks = () => {
  const [tasks, setTasks] = useState<SurfacedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);

        // Fetch home profile
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

        // Fetch task templates
        const { data: templates, error: templateError } = await supabase
          .from("task_templates")
          .select("*")
          .order("tier")
          .order("sort_order");

        if (templateError) throw templateError;

        // Fetch home tasks
        const { data: homeTasks, error: homeTaskError } = await supabase
          .from("home_tasks")
          .select("*");

        if (homeTaskError) throw homeTaskError;

        // Create a map of template_id -> home_task for quick lookup
        const homeTaskMap = new Map(homeTasks?.map((ht) => [ht.template_id, ht]) || []);

        // Calculate which tiers are visible
        const tasksWithCompletion = (templates || []).map((t) => ({
          ...t,
          completed: (homeTaskMap.get(t.id)?.status === "completed") || false,
        }));

        const visibleTiers = getVisibleTiers(tasksWithCompletion);

        // Combine and filter tasks
        const surfacedTasks = (templates || [])
          .map((template) => {
            const homeTask = homeTaskMap.get(template.id);
            const isCompleted = (homeTask?.status === "completed") || false;
            const nextDueAt = homeTask?.next_due_at ? parseISO(homeTask.next_due_at) : null;

            const status = calculateStatus(nextDueAt, isCompleted);
            const urgency = calculateUrgency(status, nextDueAt);
            const isSkipped = shouldSkipTask(template, profileData);
            const isVisible = visibleTiers.has(template.tier as "T1" | "T2" | "T3" | "T4") && !isSkipped;

            return {
              ...template,
              homeTaskId: (homeTask?.id) || "",
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
    };

    fetchTasks();
  }, []);

  return { tasks, loading, error };
};
