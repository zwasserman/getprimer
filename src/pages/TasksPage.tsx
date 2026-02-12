import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Circle, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge, { type Status } from "@/components/StatusBadge";
import TaskChatModal, { type TaskForModal } from "@/components/TaskChatModal";
import { useHomeTasks, type SurfacedTask } from "@/hooks/useHomeTasks";
import { format } from "date-fns";

const filters = ["All", "Overdue", "Upcoming", "Recently Completed"];

const TasksPage = () => {
  const { tasks, loading, error } = useHomeTasks();
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedTask, setSelectedTask] = useState<TaskForModal | null>(null);

  const filteredTasks = useMemo(() => {
    if (activeFilter === "All") {
      return tasks;
    }

    return tasks.filter((task) => {
      if (activeFilter === "Overdue") return task.status === "overdue";
      if (activeFilter === "Upcoming") return task.status === "upcoming" || task.status === "due";
      if (activeFilter === "Recently Completed") return task.status === "completed";
      return true;
    });
  }, [tasks, activeFilter]);

  const tasksByTier = useMemo(() => {
    const grouped: Record<string, SurfacedTask[]> = {
      T1: [],
      T2: [],
      T3: [],
      T4: [],
    };

    filteredTasks.forEach((task) => {
      grouped[task.tier].push(task);
    });

    return grouped;
  }, [filteredTasks]);

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

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col min-h-screen px-4 pt-14 pb-32 items-center justify-center">
        <p className="text-muted-foreground">No tasks available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-4 pt-14 pb-32">
      <h1 className="text-h1 text-foreground mb-6">Tasks</h1>

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
      <div className="flex flex-col gap-8">
        {["T1", "T2", "T3", "T4"].map((tier) => {
          const tierTasks = tasksByTier[tier as keyof typeof tasksByTier];

          if (tierTasks.length === 0) return null;

          const tierLabel = {
            T1: "Essential Setup",
            T2: "Core Maintenance",
            T3: "Ongoing Care",
            T4: "Reference Knowledge",
          }[tier] || tier;

          return (
            <div key={tier}>
              <h2 className="text-subheading text-foreground mb-3">{tierLabel}</h2>
              <div className="flex flex-col gap-1">
                {tierTasks.map((task) => {
                  const isCompleted = task.status === "completed";

                  return (
                    <motion.button
                      key={task.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openTask(task)}
                      className="flex items-center gap-3 py-4 px-1 text-left border-b border-border/50 last:border-0"
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={22} className="text-success flex-shrink-0" />
                      ) : (
                        <Circle size={22} className="text-muted-foreground flex-shrink-0" />
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
                          {task.category} · {task.difficulty || "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <StatusBadge status={task.status as Status} dueDate={task.nextDueAt || new Date()} />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <TaskChatModal
        task={selectedTask}
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
};

export default TasksPage;
