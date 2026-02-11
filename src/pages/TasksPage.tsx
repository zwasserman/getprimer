import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Droplets, Shield, Zap, Circle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge, { type Status } from "@/components/StatusBadge";
import TaskChatModal, { type TaskForModal } from "@/components/TaskChatModal";
import { differenceInDays, format } from "date-fns";

interface Task {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  status: Status;
  dueDate: Date;
  icon: typeof Flame;
}

function computeStatus(dueDate: Date, completed: boolean): Status {
  if (completed) return "completed";
  const days = differenceInDays(dueDate, new Date());
  if (days < 0) return "overdue";
  if (days <= 30) return "due";
  return "upcoming";
}

function formatDueLabel(dueDate: Date, status: Status): string {
  if (status === "overdue") return `Was ${format(dueDate, "MMM d")}`;
  if (status === "due") return `Due ${format(dueDate, "MMM d")}`;
  const days = differenceInDays(dueDate, new Date());
  return `${format(dueDate, "MMM d")} · ${days}d`;
}

const completedIds = new Set([6, 7, 8]);

const rawTasks = [
  { id: 1, title: "Replace HVAC Filter", category: "HVAC", difficulty: "Easy", dueDate: new Date("2026-02-05"), icon: Flame },
  { id: 2, title: "Test Smoke Detectors", category: "Safety", difficulty: "Easy", dueDate: new Date("2026-02-18"), icon: Shield },
  { id: 3, title: "Check Water Heater", category: "Plumbing", difficulty: "Moderate", dueDate: new Date("2026-02-25"), icon: Droplets },
  { id: 4, title: "Inspect Electrical Panel", category: "Electrical", difficulty: "Easy", dueDate: new Date("2026-04-15"), icon: Zap },
  { id: 5, title: "Clean Gutters", category: "Exterior", difficulty: "Moderate", dueDate: new Date("2026-05-10"), icon: Flame },
  { id: 6, title: "Test GFCIs", category: "Electrical", difficulty: "Easy", dueDate: new Date("2026-02-01"), icon: Zap },
  { id: 7, title: "Check Sump Pump", category: "Plumbing", difficulty: "Easy", dueDate: new Date("2026-01-28"), icon: Droplets },
  { id: 8, title: "Change Door Locks", category: "Safety", difficulty: "Easy", dueDate: new Date("2026-01-20"), icon: Shield },
];

const allTasks: Task[] = rawTasks.map((t) => ({
  ...t,
  status: computeStatus(t.dueDate, completedIds.has(t.id)),
}));

const filters = ["All", "Due", "Completed", "Upcoming"];

const TasksPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedTask, setSelectedTask] = useState<TaskForModal | null>(null);

  const priorityTasks = allTasks.filter((t) => t.status === "overdue" || t.status === "due");
  const filteredTasks = activeFilter === "All"
    ? allTasks
    : allTasks.filter((t) => {
        if (activeFilter === "Due") return t.status === "due" || t.status === "overdue";
        return t.status === activeFilter.toLowerCase();
      });

  const openTask = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <div className="flex flex-col min-h-screen px-4 pt-14 pb-32">
      <h1 className="text-h1 text-foreground mb-6">Tasks</h1>

      {/* Priority Carousel */}
      {priorityTasks.length > 0 && (
        <section className="mb-6">
          <h2 className="text-h3 text-foreground mb-3">Priority</h2>
          <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide">
            {priorityTasks.map((task) => {
              const Icon = task.icon;
              return (
                <motion.button
                  key={task.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openTask(task)}
                  className="card-primer flex-shrink-0 w-[190px] h-[140px] flex flex-col justify-between text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Icon size={18} className="text-secondary" />
                    </div>
                    <StatusBadge status={task.status} dueDate={task.dueDate} />
                  </div>
                  <div>
                    <p className="text-body-small font-semibold text-foreground">{task.title}</p>
                    <p className="text-caption text-muted-foreground mt-1">{formatDueLabel(task.dueDate, task.status)}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>
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

      {/* Task List */}
      <div className="flex flex-col gap-1">
        {filteredTasks.map((task) => {
          const Icon = task.icon;
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
                <p className={`text-body-small font-medium ${isCompleted ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {task.title}
                </p>
                <p className="text-caption text-muted-foreground mt-0.5">
                  {task.category} · {task.difficulty}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <StatusBadge status={task.status} dueDate={task.dueDate} />
              </div>
            </motion.button>
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
