import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, CheckCircle, ChevronRight, Circle } from "lucide-react";
import StatusBadge, { type Status } from "@/components/StatusBadge";
import TaskChatModal, { type TaskForModal } from "@/components/TaskChatModal";
import ProCategorySheet from "@/components/ProCategorySheet";
import { mockPros, categories, categoryIcons, type Category } from "@/data/pros";
import { useHomeTasks } from "@/hooks/useHomeTasks";

const recentActivity = [
  { title: "Replaced HVAC filter", time: "2 days ago" },
  { title: "Tested smoke detectors", time: "5 days ago" },
  { title: "Checked water pressure", time: "1 week ago" },
];

const activeCategories = categories.filter((cat) =>
  mockPros.some((p) => p.category === cat)
);

function getStatusColor(status: string): string {
  if (status === "overdue") return "bg-destructive";
  if (status === "due") return "bg-warning";
  if (status === "completed") return "bg-success";
  return "bg-muted-foreground/30";
}

const HubPage = () => {
  const navigate = useNavigate();
  const { tasks, loading, completeTask } = useHomeTasks();
  const [selectedTask, setSelectedTask] = useState<TaskForModal | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const priorityTasks = useMemo(
    () => tasks.filter((t) => t.status === "overdue" || t.status === "due" || t.status === "upcoming").slice(0, 4),
    [tasks]
  );

  const hasAgentRec = (cat: Category) =>
    mockPros.some((p) => p.category === cat && p.referral.type === "agent");

  const sheetPros = selectedCategory
    ? mockPros.filter((p) => p.category === selectedCategory)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col min-h-screen px-4 pt-14 pb-32"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-h2 text-foreground">Welcome back, Zach</h1>
          <p className="text-body-small text-muted-foreground mt-1">1234 Main St, Yardley PA</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User size={20} className="text-primary" />
        </div>
      </div>

      {/* Priority Tasks — stacked timeline */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 text-foreground">Priority tasks</h2>
          <button
            onClick={() => navigate("/tasks")}
            className="flex items-center gap-1 text-caption font-medium text-primary"
          >
            See all tasks
            <ChevronRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground text-body-small">Loading...</div>
        ) : priorityTasks.length === 0 ? (
          <div className="card-primer text-center py-6">
            <p className="text-body-small text-muted-foreground">You're all caught up 🎉</p>
          </div>
        ) : (
          <div className="relative flex flex-col">
            {/* Dashed timeline connector */}
            <div
              className="absolute left-[11px] top-4 bottom-4 w-px border-l-2 border-dashed border-border"
              aria-hidden
            />

            {priorityTasks.map((task) => (
              <div key={task.id} className="relative flex gap-4 items-start">
                {/* Status dot — tappable */}
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    completeTask(task.id);
                  }}
                  className="relative z-10 mt-5 flex-shrink-0"
                  aria-label={task.status === "completed" ? "Mark incomplete" : "Mark complete"}
                >
                  <div className={`w-[22px] h-[22px] rounded-full ${getStatusColor(task.status)} flex items-center justify-center`}>
                    {task.status === "completed" ? (
                      <CheckCircle size={14} className="text-primary-foreground" />
                    ) : (
                      <Circle size={10} className="text-primary-foreground fill-current" />
                    )}
                  </div>
                </motion.button>

                {/* Card */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTask(task as unknown as TaskForModal)}
                  className="card-primer flex-1 mb-3 text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-body-small font-semibold text-foreground">{task.title}</p>
                      <p className="text-caption text-muted-foreground mt-1">
                        {task.category}
                        {task.difficulty && ` · ${task.difficulty}`}
                      </p>
                    </div>
                    <StatusBadge status={task.status as Status} dueDate={task.nextDueAt || undefined} />
                  </div>
                </motion.button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Your Pros */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 text-foreground">Your Pros</h2>
          <button
            onClick={() => navigate("/pros")}
            className="text-caption font-medium text-secondary"
          >
            See all →
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide">
          {activeCategories.map((cat) => {
            const Icon = categoryIcons[cat];
            const showDot = hasAgentRec(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0"
              >
                <div className="relative w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center">
                  <Icon size={24} className="text-foreground" />
                  {showDot && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-secondary" />
                  )}
                </div>
                <span className="text-caption text-foreground">{cat}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mb-8">
        <h2 className="text-h3 text-foreground mb-4">Recent Activity</h2>
        <div className="flex flex-col gap-3">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle size={18} className="text-success flex-shrink-0" />
              <p className="text-body-small text-foreground flex-1">{item.title}</p>
              <p className="text-caption text-muted-foreground">{item.time}</p>
            </div>
          ))}
        </div>
      </section>

      <TaskChatModal
        task={selectedTask}
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />

      <ProCategorySheet
        category={selectedCategory}
        pros={sheetPros}
        open={!!selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />
    </motion.div>
  );
};

export { HubPage };
export default HubPage;
