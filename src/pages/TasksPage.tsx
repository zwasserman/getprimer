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
import { TIER_META, TIER_ORDER, getMissionIcon, getMissionLabel, MISSION_META, MISSION_ORDER } from "@/lib/missions";

const STATUS_OPTIONS = [
  { key: "all", label: "All" },
  { key: "due", label: "Due" },
  { key: "overdue", label: "Overdue" },
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
];

const TYPE_OPTIONS = [
  { key: "all", label: "All" },
  { key: "one_time", label: "One-time" },
  { key: "recurring", label: "Recurring" },
  { key: "seasonal", label: "Seasonal" },
  { key: "info", label: "Learn" },
];

type FilterDropdown = "mission" | "category" | "status" | "type" | null;

const TasksPage = () => {
  const { tasks, profile, loading, error, refetch, completeTask } = useHomeTasks({ allTiers: true });
  const [selectedTask, setSelectedTask] = useState<TaskForModal | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [collapsedTiers, setCollapsedTiers] = useState<Set<string>>(new Set(["T3", "T4"]));

  // Filter state
  const [missionFilter, setMissionFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [openDropdown, setOpenDropdown] = useState<FilterDropdown>(null);

  // Derive unique categories from tasks
  const categoryOptions = useMemo(() => {
    const cats = Array.from(new Set(tasks.map((t) => t.category))).sort();
    return [{ key: "all", label: "All" }, ...cats.map((c) => ({ key: c, label: c }))];
  }, [tasks]);

  // Mission options
  const missionOptions = useMemo(() => [
    { key: "all", label: "All" },
    ...MISSION_ORDER.map((m) => ({ key: m, label: `${MISSION_META[m].icon} ${MISSION_META[m].label}` })),
  ], []);

  // Auto-expand T2 when any T1 task is complete
  const t1DoneCount = useMemo(() => tasks.filter((t) => t.tier === "T1" && t.status === "completed").length, [tasks]);
  const t2Engaged = useMemo(() => tasks.some((t) => t.tier === "T2" && t.status === "completed"), [tasks]);

  const effectiveCollapsed = useMemo(() => {
    const s = new Set(collapsedTiers);
    if (t1DoneCount > 0) s.delete("T2");
    if (!t2Engaged) s.add("T3");
    return s;
  }, [collapsedTiers, t1DoneCount, t2Engaged]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (missionFilter !== "all" && task.mission !== missionFilter) return false;
      if (categoryFilter !== "all" && task.category !== categoryFilter) return false;
      if (statusFilter !== "all" && task.status !== statusFilter) return false;
      if (typeFilter !== "all" && task.task_type !== typeFilter) return false;
      return true;
    });
  }, [tasks, missionFilter, categoryFilter, statusFilter, typeFilter]);

  const tasksByTier = useMemo(() => {
    const grouped: Record<string, SurfacedTask[]> = { T1: [], T2: [], T3: [], T4: [] };
    filteredTasks.forEach((task) => grouped[task.tier]?.push(task));
    return grouped;
  }, [filteredTasks]);

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

  const hasActiveFilters = missionFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all" || typeFilter !== "all";

  const clearFilters = () => {
    setMissionFilter("all");
    setCategoryFilter("all");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  const getFilterLabel = (dimension: FilterDropdown, value: string): string => {
    if (dimension === "mission") {
      if (value === "all") return "Mission";
      return MISSION_META[value]?.icon + " " + (MISSION_META[value]?.label || value);
    }
    if (dimension === "category") return value === "all" ? "Category" : value;
    if (dimension === "status") return value === "all" ? "Status" : STATUS_OPTIONS.find((o) => o.key === value)?.label || value;
    if (dimension === "type") return value === "all" ? "Type" : TYPE_OPTIONS.find((o) => o.key === value)?.label || value;
    return "";
  };

  const toggleDropdown = (d: FilterDropdown) => setOpenDropdown((prev) => (prev === d ? null : d));

  const filterPills: { dimension: FilterDropdown; value: string; options: { key: string; label: string }[]; setter: (v: string) => void }[] = [
    { dimension: "mission", value: missionFilter, options: missionOptions, setter: setMissionFilter },
    { dimension: "category", value: categoryFilter, options: categoryOptions, setter: setCategoryFilter },
    { dimension: "status", value: statusFilter, options: STATUS_OPTIONS, setter: setStatusFilter },
    { dimension: "type", value: typeFilter, options: TYPE_OPTIONS, setter: setTypeFilter },
  ];

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen px-4 pt-14 pb-32 items-center justify-center lg:pt-8 lg:pb-8 lg:px-8">
        <Loader2 size={32} className="animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen px-4 pt-14 pb-32 items-center justify-center lg:pt-8 lg:pb-8 lg:px-8">
        <p className="text-muted-foreground text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-4 pt-14 pb-32 lg:pt-8 lg:pb-8 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-h1 text-foreground">Tasks</h1>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-caption font-medium text-primary">
              Clear
            </button>
          )}
          <button
            onClick={() => setProfileOpen(true)}
            className="w-9 h-9 rounded-full bg-card border border-border/50 shadow-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Home settings"
          >
            <Settings2 size={18} />
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide -mx-4 px-4">
        {filterPills.map((fp) => {
          const isActive = fp.value !== "all";
          const isOpen = openDropdown === fp.dimension;
          return (
            <div key={fp.dimension} className="relative flex-shrink-0">
              <Button
                variant={isActive ? "default" : "chip"}
                size="chip"
                onClick={() => toggleDropdown(fp.dimension)}
                className="flex items-center gap-1"
              >
                {getFilterLabel(fp.dimension, fp.value)}
                <ChevronDown size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </Button>
              {isOpen && (
                <div className="absolute top-full left-0 mt-1 z-50 bg-card border border-border rounded-xl shadow-lg py-1 min-w-[160px] max-h-[240px] overflow-y-auto">
                  {fp.options.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        fp.setter(opt.key);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3 py-2 text-body-small transition-colors ${
                        fp.value === opt.key
                          ? "text-primary font-semibold bg-primary/5"
                          : "text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Close dropdown on background tap */}
      {openDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
      )}

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
