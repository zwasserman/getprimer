import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Circle, CheckCircle2, AlertCircle, Loader2, Settings2, Lock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge, { type Status } from "@/components/StatusBadge";
import TaskChatModal, { type TaskForModal } from "@/components/TaskChatModal";
import HomeProfileEditor from "@/components/HomeProfileEditor";
import { useHomeTasks, type SurfacedTask } from "@/hooks/useHomeTasks";

const filters = ["All", "Overdue", "Upcoming", "Recently Completed"];

const tierMeta: Record<string, { label: string; sublabel: string; icon?: typeof Lock }> = {
  T1: { label: "Essential Setup", sublabel: "First things to do in your new home" },
  T2: { label: "Core Maintenance", sublabel: "Build your recurring rhythm" },
  T3: { label: "Ongoing Care", sublabel: "Seasonal and recurring upkeep" },
  T4: { label: "Reference", sublabel: "Good to know", icon: BookOpen },
};

const TasksPage = () => {
  const { tasks, profile, loading, error, refetch } = useHomeTasks();
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedTask, setSelectedTask] = useState<TaskForModal | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    if (activeFilter === "All") return tasks;
    return tasks.filter((task) => {
      if (activeFilter === "Overdue") return task.status === "overdue";
      if (activeFilter === "Upcoming") return task.status === "upcoming" || task.status === "due";
      if (activeFilter === "Recently Completed") return task.status === "completed";
      return true;
    });
  }, [tasks, activeFilter]);

  const tasksByTier = useMemo(() => {
    const grouped: Record<string, SurfacedTask[]> = { T1: [], T2: [], T3: [], T4: [] };
    filteredTasks.forEach((task) => {
      grouped[task.tier].push(task);
    });
    return grouped;
  }, [filteredTasks]);

  // Count completed T1 for progress
  const t1Total = tasks.filter((t) => t.tier === "T1").length;
  const t1Done = tasks.filter((t) => t.tier === "T1" && t.status === "completed").length;

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
      {/* Header with settings */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h1 text-foreground">Tasks</h1>
        <button
          onClick={() => setProfileOpen(true)}
          className="w-9 h-9 rounded-full bg-card border border-border/50 shadow-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Home settings"
        >
          <Settings2 size={18} />
        </button>
      </div>

      {/* T1 Progress Card */}
      {t1Total > 0 && t1Done < t1Total && (
        <div className="card-primer mb-5">
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

      {/* Filters */}
      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "chip"}
            size="chip"
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Tier Sections */}
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground">No tasks available</p>
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
                          <p className="text-caption text-muted-foreground mt-0.5">
                            {task.category}
                            {task.difficulty && ` · ${task.difficulty}`}
                            {task.season && ` · ${task.season}`}
                          </p>
                        </div>
                        {!isInfoTier && (
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <StatusBadge status={task.status as Status} dueDate={task.nextDueAt || undefined} />
                          </div>
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
