import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, CheckCircle2, ChevronRight, Circle, MessageCircle, BookOpen } from "lucide-react";
import StatusBadge, { type Status } from "@/components/StatusBadge";
import TaskChatModal, { type TaskForModal } from "@/components/TaskChatModal";
import { useHomeTasks, type SurfacedTask } from "@/hooks/useHomeTasks";
import { TIER_META, TIER_ORDER, getMissionIcon, getMissionShortLabel, MISSION_ORDER } from "@/lib/missions";

const TIER_LIMITS: Record<string, number> = { T1: 99, T2: 5, T3: 3, T4: 0 };

const HubPage = () => {
  const navigate = useNavigate();
  const { tasks, loading, completeTask } = useHomeTasks();
  const [selectedTask, setSelectedTask] = useState<TaskForModal | null>(null);

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

      {/* Task tiers */}
      {loading ? (
        <div className="py-8 text-center text-muted-foreground text-body-small">Loading...</div>
      ) : (
        <div className="flex flex-col gap-6">
          {TIER_ORDER.filter((tier) => tier !== "T4").map((tier) => {
            const tierTasks = tasksByTier[tier];
            if (tierTasks.length === 0) return null;

            const limit = TIER_LIMITS[tier];
            const displayed = tierTasks.slice(0, limit);
            const remaining = tierTasks.length - displayed.length;
            const meta = TIER_META[tier];

            return (
              <section key={tier}>
                {/* Tier Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-caption uppercase tracking-[1px] text-muted-foreground">
                    {meta.displayName}
                  </span>
                  <span className="text-caption text-muted-foreground">
                    {tierTasks.length} left
                  </span>
                </div>

                {/* Task Cards */}
                <div className="flex flex-col gap-3">
                  {displayed.map((task) => {
                    const isInfo = task.task_type === "info";

                    return (
                      <motion.button
                        key={task.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => openTask(task)}
                        className="card-primer text-left"
                      >
                        <div className="flex items-start gap-3">
                          {isInfo ? (
                            <BookOpen size={20} className="text-secondary flex-shrink-0 mt-0.5" />
                          ) : (
                            <motion.div
                              whileTap={{ scale: 0.85 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                completeTask(task.id);
                              }}
                              className="flex-shrink-0 mt-0.5"
                            >
                              <Circle size={22} className="text-muted-foreground/40" />
                            </motion.div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-body font-medium text-foreground truncate">{task.title}</p>
                              <StatusBadge status={getBadgeStatus(task)} dueDate={task.nextDueAt || undefined} />
                            </div>
                            <p className="text-body-small text-muted-foreground mt-0.5">
                              {getMissionIcon(task.mission)} {getMissionShortLabel(task.mission)} • {task.category}
                              {task.difficulty && ` • ${task.difficulty}`}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* View all link */}
                {remaining > 0 && (
                  <button
                    onClick={() => navigate("/tasks")}
                    className="text-body-small font-medium text-primary mt-3 text-left"
                  >
                    View all {tierTasks.length} {meta.displayName.toLowerCase()} tasks →
                  </button>
                )}
              </section>
            );
          })}
        </div>
      )}

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

      <TaskChatModal task={selectedTask} open={!!selectedTask} onClose={() => setSelectedTask(null)} />
    </motion.div>
  );
};

export { HubPage };
export default HubPage;
