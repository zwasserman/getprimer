import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Circle, CheckCircle2, AlertCircle, Loader2, Settings2, BookOpen, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge, { type Status } from "@/components/StatusBadge";
import TaskChatModal, { type TaskForModal } from "@/components/TaskChatModal";
import HomeProfileEditor from "@/components/HomeProfileEditor";
import { useHomeTasks, type SurfacedTask } from "@/hooks/useHomeTasks";

const tierMeta: Record<string, { label: string; sublabel: string; icon?: typeof BookOpen }> = {
  T1: { label: "Essential Setup", sublabel: "First things to do in your new home" },
  T2: { label: "Core Maintenance", sublabel: "Build your recurring rhythm" },
  T3: { label: "Ongoing Care", sublabel: "Seasonal and recurring upkeep" },
  T4: { label: "Reference", sublabel: "Good to know", icon: BookOpen },
};

type FilterKey = "status" | "category" | "difficulty" | "type";

interface FilterOption {
  key: FilterKey;
  label: string;
  values: string[];
}

const TasksPage = () => {
  const { tasks, profile, loading, error, refetch } = useHomeTasks({ allTiers: true });
  const [selectedTask, setSelectedTask] = useState<TaskForModal | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<FilterKey, string | null>>({
    status: null,
    category: null,
    difficulty: null,
    type: null,
  });
  const [expandedFilter, setExpandedFilter] = useState<FilterKey | null>(null);

  // Derive available filter options from tasks
  const filterOptions = useMemo<FilterOption[]>(() => {
    const cats = [...new Set(tasks.map((t) => t.category))].sort();
    const diffs = [...new Set(tasks.map((t) => t.difficulty).filter(Boolean))] as string[];
    const types = [...new Set(tasks.map((t) => t.task_type))].sort();
    return [
      { key: "status" as FilterKey, label: "Status", values: ["Overdue", "Due", "Upcoming", "Completed"] },
      { key: "category" as FilterKey, label: "Category", values: cats },
      { key: "difficulty" as FilterKey, label: "Difficulty", values: diffs },
      { key: "type" as FilterKey, label: "Type", values: types },
    ];
  }, [tasks]);

  const hasActiveFilters = Object.values(activeFilters).some((v) => v !== null);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (activeFilters.status) {
        if (task.status !== activeFilters.status.toLowerCase()) return false;
      }
      if (activeFilters.category) {
        if (task.category !== activeFilters.category) return false;
      }
      if (activeFilters.difficulty) {
        if (task.difficulty !== activeFilters.difficulty) return false;
      }
      if (activeFilters.type) {
        if (task.task_type !== activeFilters.type) return false;
      }
      return true;
    });
  }, [tasks, activeFilters]);

  const tasksByTier = useMemo(() => {
    const grouped: Record<string, SurfacedTask[]> = { T1: [], T2: [], T3: [], T4: [] };
    filteredTasks.forEach((task) => {
      grouped[task.tier].push(task);
    });
    return grouped;
  }, [filteredTasks]);

  const t1Total = tasks.filter((t) => t.tier === "T1").length;
  const t1Done = tasks.filter((t) => t.tier === "T1" && t.status === "completed").length;

  const toggleFilter = (key: FilterKey, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
    setExpandedFilter(null);
  };

  const clearFilters = () => {
    setActiveFilters({ status: null, category: null, difficulty: null, type: null });
    setExpandedFilter(null);
  };

  const openTask = (task: SurfacedTask) => {
    setSelectedTask(task as unknown as TaskForModal);
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
        <AlertCircle size={32} className="text-destructive mb-4" />
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

      {/* T1 Progress */}
      {t1Total > 0 && t1Done < t1Total && (
        <div className="card-primer mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-body-small font-medium text-foreground">Getting Started</p>
            <span className="text-caption text-muted-foreground">{t1Done}/{t1Total}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-border/50 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${(t1Done / t1Total) * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Filter Chips */}
      <div className="flex gap-2 mb-1 overflow-x-auto scrollbar-hide">
        {filterOptions.map((fo) => {
          const isActive = activeFilters[fo.key] !== null;
          return (
            <Button
              key={fo.key}
              variant={isActive ? "default" : "chip"}
              size="chip"
              onClick={() => setExpandedFilter(expandedFilter === fo.key ? null : fo.key)}
              className="flex-shrink-0"
            >
              {isActive ? `${fo.label}: ${activeFilters[fo.key]}` : fo.label}
            </Button>
          );
        })}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex-shrink-0 flex items-center gap-1 text-caption text-muted-foreground hover:text-foreground px-2"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Expanded filter values */}
      {expandedFilter && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex gap-2 flex-wrap py-2 mb-2"
        >
          {filterOptions
            .find((fo) => fo.key === expandedFilter)
            ?.values.map((val) => {
              const isSelected = activeFilters[expandedFilter] === val;
              return (
                <button
                  key={val}
                  onClick={() => toggleFilter(expandedFilter, val)}
                  className={`px-3 py-1.5 rounded-full text-caption font-medium transition-colors capitalize ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {val}
                </button>
              );
            })}
        </motion.div>
      )}

      {/* Task count */}
      <p className="text-caption text-muted-foreground mb-4 mt-2">
        {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
        {hasActiveFilters && ` (filtered from ${tasks.length})`}
      </p>

      {/* Tier Sections */}
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground">
            {hasActiveFilters ? "No tasks match your filters" : "No tasks available"}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-primary text-body-small mt-2">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {(["T1", "T2", "T3", "T4"] as const).map((tier) => {
            const tierTasks = tasksByTier[tier];
            if (tierTasks.length === 0) return null;

            const meta = tierMeta[tier];
            const isInfoTier = tier === "T4";

            return (
              <section key={tier}>
                <div className="flex items-center gap-2 mb-1">
                  {meta.icon && <meta.icon size={14} className="text-muted-foreground" />}
                  <h2 className="text-caption uppercase tracking-wider text-muted-foreground">{meta.label}</h2>
                  <span className="text-caption text-muted-foreground/40">({tierTasks.length})</span>
                </div>
                <p className="text-caption text-muted-foreground/60 mb-3">{meta.sublabel}</p>

                <div className="flex flex-col">
                  {tierTasks.map((task) => {
                    const isCompleted = task.status === "completed";

                    return (
                      <motion.button
                        key={task.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openTask(task)}
                        className="flex items-center gap-3 py-3.5 px-1 text-left border-b border-border/30 last:border-0"
                      >
                        {isInfoTier ? (
                          <BookOpen size={18} className="text-muted-foreground flex-shrink-0" />
                        ) : isCompleted ? (
                          <CheckCircle2 size={22} className="text-success flex-shrink-0" />
                        ) : (
                          <Circle size={22} className="text-muted-foreground/40 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-body-small font-medium ${
                              isCompleted ? "text-muted-foreground line-through" : "text-foreground"
                            }`}
                          >
                            {task.title}
                          </p>
                          <p className="text-caption text-muted-foreground mt-0.5 capitalize">
                            {task.category}
                            {task.difficulty && ` · ${task.difficulty}`}
                            {task.task_type === "seasonal" && task.season && ` · ${task.season}`}
                          </p>
                        </div>
                        {!isInfoTier && (
                          <StatusBadge status={task.status as Status} dueDate={task.nextDueAt || undefined} />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <TaskChatModal
        task={selectedTask}
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />

      <HomeProfileEditor
        profile={profile}
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onSaved={refetch}
      />
    </div>
  );
};

export default TasksPage;
