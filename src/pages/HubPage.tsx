import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, CheckCircle2, ChevronRight, Circle, MessageCircle, BookOpen } from "lucide-react";
import StatusBadge, { type Status } from "@/components/StatusBadge";
import TaskChatModal, { type TaskForModal } from "@/components/TaskChatModal";
import ProCategorySheet from "@/components/ProCategorySheet";
import { mockPros, categories, categoryIcons, type Category } from "@/data/pros";
import { useHomeTasks, type SurfacedTask } from "@/hooks/useHomeTasks";
import { TIER_META, TIER_ORDER, getMissionIcon, getMissionShortLabel, MISSION_ORDER } from "@/lib/missions";

const HOME_TASK_LIMIT = 4;

const activeCategories = categories.filter((cat) =>
  mockPros.some((p) => p.category === cat)
);

const HubPage = () => {
  const navigate = useNavigate();
  const { tasks, loading, completeTask } = useHomeTasks();
  const [selectedTask, setSelectedTask] = useState<TaskForModal | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const hasAgentRec = (cat: Category) =>
    mockPros.some((p) => p.category === cat && p.referral.type === "agent");

  const sheetPros = selectedCategory
    ? mockPros.filter((p) => p.category === selectedCategory)
    : [];

  // Stats
  const t1All = useMemo(() => tasks.filter((t) => t.tier === "T1"), [tasks]);
  const t1Done = useMemo(() => t1All.filter((t) => t.status === "completed").length, [t1All]);
  const t1Total = t1All.length;
  const t1AllDone = t1Total > 0 && t1Done === t1Total;

  // Incomplete tasks sorted by mission order
  const incompleteTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status !== "completed")
      .sort((a, b) => {
        const mA = MISSION_ORDER.indexOf(a.mission || "");
        const mB = MISSION_ORDER.indexOf(b.mission || "");
        return mA - mB || (a.sort_order || 0) - (b.sort_order || 0);
      });
  }, [tasks]);

  const tasksByTier = useMemo(() => {
    const grouped: Record<string, SurfacedTask[]> = {};
    for (const tier of TIER_ORDER) {
      grouped[tier] = incompleteTasks.filter((t) => t.tier === tier);
    }
    return grouped;
  }, [incompleteTasks]);

  // Recent completed tasks
  const recentCompleted = useMemo(() => {
    return tasks
      .filter((t) => t.status === "completed")
      .slice(0, 3);
  }, [tasks]);

  const totalIncomplete = incompleteTasks.length;

  const openTask = (task: SurfacedTask) => setSelectedTask(task as unknown as TaskForModal);

  const getBadgeStatus = (task: SurfacedTask): Status => {
    if (task.task_type === "info") return "learn";
    if (task.status === "overdue") return "overdue";
    if (task.status === "due") return "due";
    return "upcoming";
  };

  // Progress line
  const progressLine = t1AllDone
    ? "First week essentials — all done ✓"
    : t1Total > 0
      ? `${t1Done} of ${t1Total} first-week tasks done${t1Done > 0 ? " ✓" : ""}`
      : null;

  // Welcome vs active header
  const isNewUser = t1Done === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col min-h-screen px-4 pt-14 pb-32"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          {isNewUser ? (
            <>
              <h1 className="text-h2 text-foreground">Welcome to your</h1>
              <h1 className="text-h2 text-foreground">new home, Zach 👋</h1>
            </>
          ) : (
            <>
              <h1 className="text-h2 text-foreground">Your Home</h1>
              <p className="text-body-small text-muted-foreground mt-1">1234 Main St, Yardley PA</p>
            </>
          )}
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User size={20} className="text-primary" />
        </div>
      </div>

      {/* Context line */}
      {isNewUser ? (
        <p className="text-body-small text-muted-foreground mb-6">
          You have {totalIncomplete} things to check on.{"\n"}Let's start with the essentials.
        </p>
      ) : (
        progressLine && (
          <p className="text-body-small text-muted-foreground mb-6">{progressLine}</p>
        )
      )}

      {/* Ask Primer */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))}
        className="w-full mb-6 flex items-center gap-3 rounded-2xl bg-card border border-border px-4 py-3.5 shadow-card text-left transition-all active:scale-[0.98]"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <MessageCircle size={20} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-body-small font-semibold text-foreground">Ask Primer</p>
          <p className="text-caption text-muted-foreground">Your home maintenance assistant</p>
        </div>
        <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
      </button>

      {/* Priority Tasks — timeline cards */}
      <section className="mb-6">
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
        ) : incompleteTasks.length === 0 ? (
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

            {incompleteTasks.slice(0, HOME_TASK_LIMIT).map((task) => {
              const isInfo = task.task_type === "info";

              return (
                <div key={task.id} className="relative flex gap-4 items-start">
                  {/* Status dot */}
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isInfo) completeTask(task.id);
                    }}
                    className="relative z-10 mt-5 flex-shrink-0"
                    aria-label="Mark complete"
                  >
                    <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center ${
                      task.status === "overdue" ? "bg-destructive" :
                      task.status === "due" ? "bg-warning" :
                      "bg-muted-foreground/30"
                    }`}>
                      <Circle size={10} className="text-primary-foreground fill-current" />
                    </div>
                  </motion.button>

                  {/* Card */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openTask(task)}
                    className="card-primer flex-1 mb-3 text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-body-small font-semibold text-foreground">{task.title}</p>
                        <p className="text-caption text-muted-foreground mt-1">
                          {getMissionIcon(task.mission)} {getMissionShortLabel(task.mission)} • {task.category}
                          {task.difficulty && ` • ${task.difficulty}`}
                        </p>
                      </div>
                      <StatusBadge status={getBadgeStatus(task)} dueDate={task.nextDueAt || undefined} />
                    </div>
                  </motion.button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent Activity */}
      {recentCompleted.length > 0 && (
        <section className="mt-8">
          <h2 className="text-h3 text-foreground mb-4">Recent Activity</h2>
          <div className="card-primer">
            <div className="flex flex-col gap-3">
              {recentCompleted.map((task) => (
                <div key={task.id} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-success flex-shrink-0" />
                  <p className="text-body-small text-foreground flex-1 truncate">{task.title}</p>
                  <p className="text-caption text-muted-foreground">Done</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Your Pros */}
      <section className="mt-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 text-foreground">Your Pros</h2>
          <button onClick={() => navigate("/pros")} className="text-caption font-medium text-secondary">
            See all →
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide">
          {activeCategories.map((cat) => {
            const Icon = categoryIcons[cat];
            const showDot = hasAgentRec(cat);
            return (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div className="relative w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center">
                  <Icon size={24} className="text-foreground" />
                  {showDot && <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-secondary" />}
                </div>
                <span className="text-caption text-foreground">{cat}</span>
              </button>
            );
          })}
        </div>
      </section>

      <TaskChatModal task={selectedTask} open={!!selectedTask} onClose={() => setSelectedTask(null)} />
      <ProCategorySheet category={selectedCategory} pros={sheetPros} open={!!selectedCategory} onClose={() => setSelectedCategory(null)} />
    </motion.div>
  );
};

export { HubPage };
export default HubPage;
