import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Circle, CheckCircle2, Loader2, Settings2, BookOpen, ChevronDown, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge, { type Status } from "@/components/StatusBadge";
import TaskChatModal, { type TaskForModal } from "@/components/TaskChatModal";
import HomeProfileEditor from "@/components/HomeProfileEditor";
import { useHomeTasks, type SurfacedTask } from "@/hooks/useHomeTasks";
import { TIER_META, TIER_ORDER, getMissionIcon, getMissionLabel } from "@/lib/missions";

type FilterKey = "all" | "due" | "completed" | "info";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "due", label: "Due" },
  { key: "completed", label: "Completed" },
  { key: "info", label: "Info" },
];

const TasksPage = () => {
  const { tasks, profile, loading, error, refetch, completeTask } = useHomeTasks({ allTiers: true });
  const [selectedTask, setSelectedTask] = useState<TaskForModal | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [collapsedTiers, setCollapsedTiers] = useState<Set<string>>(new Set(["T3", "T4"]));

  // Auto-expand T2 when any T1 task is complete
  const t1DoneCount = useMemo(() => tasks.filter((t) => t.tier === "T1" && t.status === "completed").length, [tasks]);
  const t2Engaged = useMemo(() => tasks.some((t) => t.tier === "T2" && t.status === "completed"), [tasks]);

  const effectiveCollapsed = useMemo(() => {
    const s = new Set(collapsedTiers);
    // T2: expanded if any T1 complete
    if (t1DoneCount > 0) s.delete("T2");
    // T3: collapsed until T2 engaged
    if (!t2Engaged) s.add("T3");
    return s;
  }, [collapsedTiers, t1DoneCount, t2Engaged]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (activeFilter === "due") return task.status === "due" || task.status === "overdue";
      if (activeFilter === "completed") return task.status === "completed";
      if (activeFilter === "info") return task.task_type === "info";
      return true;
    });
  }, [tasks, activeFilter]);

  const tasksByTier = useMemo(() => {
    const grouped: Record<string, SurfacedTask[]> = { T1: [], T2: [], T3: [], T4: [] };
    filteredTasks.forEach((task) => grouped[task.tier]?.push(task));
    return grouped;
  }, [filteredTasks]);

  // Per-tier progress from ALL tasks (not filtered)
  const tierProgress = useMemo(() => {
    const progress: Record<string, { done: number; total: number }> = {};
    for (const tier of TIER_ORDER) {
      const tierTasks = tasks.filter((t) => t.tier === tier);
      progress[tier] = {
        done: tierTasks.filter((t) => t.status === "completed").length,
        total: tierTasks.length,
      };
    }
    return progress;
  }, [tasks]);

  const toggleTier = (tier: string) => {
    setCollapsedTiers((prev) => {
      const next = new Set(prev);
      if (next.has(tier)) next.delete(tier);
      else next.add(tier);
      return next;
    });
  };

  const openTask = (task: SurfacedTask) => setSelectedTask(task as unknown as TaskForModal);

  const getBadgeStatus = (task: SurfacedTask): Status => {
    if (task.task_type === "info") return "learn";
    if (task.status === "completed") return "completed";
    if (task.status === "overdue") return "overdue";
    if (task.status === "due") return "due";
    return "upcoming";
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen px-4 pt-14 pb-32 items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen px-4 pt-14 pb-32 items-center justify-center">
        <p className="text-muted-foreground text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-4 pt-14 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-h1 text-foreground">Tasks</h1>
        <button
          onClick={() => setProfileOpen(true)}
          className="w-9 h-9 rounded-full bg-card border border-border/50 shadow-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Home settings"
        >
          <Settings2 size={18} />
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {FILTERS.map((f) => (
          <Button
            key={f.key}
            variant={activeFilter === f.key ? "default" : "chip"}
            size="chip"
            onClick={() => setActiveFilter(f.key)}
            className="flex-shrink-0"
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* Tier Sections */}
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground">No tasks match this filter</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {TIER_ORDER.map((tier) => {
            const tierTasks = tasksByTier[tier];
            if (tierTasks.length === 0) return null;

            const meta = TIER_META[tier];
            const progress = tierProgress[tier];
            const isCollapsed = effectiveCollapsed.has(tier);

            return (
              <section key={tier} className="mb-4">
                {/* Tier Header */}
                <button
                  onClick={() => toggleTier(tier)}
                  className="flex items-center justify-between w-full pt-2 pb-1"
                >
                  <span className="text-caption uppercase tracking-[1px] text-muted-foreground">
                    {meta.displayName}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-caption text-muted-foreground">
                      {progress.done}/{progress.total}
                    </span>
                    {isCollapsed ? (
                      <ChevronRight size={14} className="text-muted-foreground" />
                    ) : (
                      <ChevronDown size={14} className="text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Task Rows */}
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col">
                        {tierTasks.map((task) => {
                          const isCompleted = task.status === "completed";
                          const isInfo = task.task_type === "info";

                          return (
                            <div
                              key={task.id}
                              className="flex items-center gap-3 h-16 border-b border-border/30 last:border-0"
                            >
                              {/* Checkbox / Icon */}
                              {isInfo ? (
                                <BookOpen size={20} className="text-secondary flex-shrink-0" />
                              ) : (
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    completeTask(task.id);
                                  }}
                                  className="flex-shrink-0"
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 size={22} className="text-success" />
                                  ) : (
                                    <Circle size={22} className="text-muted-foreground/40" />
                                  )}
                                </motion.button>
                              )}

                              {/* Content */}
                              <motion.button
                                whileTap={{ scale: 0.98 }}
                                onClick={() => openTask(task)}
                                className="flex-1 min-w-0 text-left flex items-center gap-2"
                              >
                                <div className="flex-1 min-w-0">
                                  <p className={`text-body font-medium truncate ${isCompleted ? "text-muted-foreground line-through" : "text-foreground"}`}>
                                    {task.title}
                                  </p>
                                  <p className="text-body-small text-muted-foreground truncate mt-0.5">
                                    {getMissionIcon(task.mission)} {getMissionLabel(task.mission)} • {task.category}
                                  </p>
                                </div>
                                <StatusBadge status={getBadgeStatus(task)} dueDate={task.nextDueAt || undefined} />
                              </motion.button>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            );
          })}
        </div>
      )}

      <TaskChatModal task={selectedTask} open={!!selectedTask} onClose={() => setSelectedTask(null)} />
      <HomeProfileEditor profile={profile} open={profileOpen} onClose={() => setProfileOpen(false)} onSaved={refetch} />
    </div>
  );
};

export default TasksPage;
