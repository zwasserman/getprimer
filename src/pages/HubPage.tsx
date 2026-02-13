import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, ChevronRight, AlertCircle, Sparkles } from "lucide-react";
import TaskChatModal, { type TaskForModal } from "@/components/TaskChatModal";
import ProCategorySheet from "@/components/ProCategorySheet";
import { mockPros, categories, categoryIcons, type Category } from "@/data/pros";
import { useHomeTasks, type SurfacedTask } from "@/hooks/useHomeTasks";
import { MISSION_META, MISSION_ORDER, getMissionIcon } from "@/lib/missions";
import type { SurfacedTask as Task } from "@/hooks/useHomeTasks";

const HOME_TASK_LIMIT = 4;

const activeCategories = categories.filter((cat) =>
  mockPros.some((p) => p.category === cat)
);

const HubPage = () => {
  const navigate = useNavigate();
  const { tasks, loading } = useHomeTasks({ allTiers: true });
  const [selectedTask, setSelectedTask] = useState<TaskForModal | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const hasAgentRec = (cat: Category) =>
    mockPros.some((p) => p.category === cat && p.referral.type === "agent");

  const sheetPros = selectedCategory
    ? mockPros.filter((p) => p.category === selectedCategory)
    : [];

  // Timely tasks (overdue/due)
  const timelyTasks = useMemo(() => {
    return tasks.filter((t) => t.status === "overdue" || t.status === "due");
  }, [tasks]);

  // Mission progress and organization
  const missionProgress = useMemo(() => {
    const progress: Record<string, { completed: number; total: number; isComplete: boolean }> = {};
    
    MISSION_ORDER.forEach((mission) => {
      const missionTasks = tasks.filter((t) => t.mission === mission);
      const completedCount = missionTasks.filter((t) => t.status === "completed").length;
      progress[mission] = {
        completed: completedCount,
        total: missionTasks.length,
        isComplete: missionTasks.length > 0 && completedCount === missionTasks.length,
      };
    });
    
    return progress;
  }, [tasks]);

  // Sorted missions: incomplete first, then completed
  const sortedMissions = useMemo(() => {
    return MISSION_ORDER.slice().sort((a, b) => {
      const aComplete = missionProgress[a].isComplete;
      const bComplete = missionProgress[b].isComplete;
      if (aComplete !== bComplete) return aComplete ? 1 : -1;
      return MISSION_ORDER.indexOf(a) - MISSION_ORDER.indexOf(b);
    });
  }, [missionProgress]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col min-h-screen px-4 pt-14 pb-32 lg:pt-8 lg:pb-8 lg:px-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-h2 text-foreground">Welcome back, Zach</h1>
          <p className="text-body-small text-muted-foreground mt-1">1234 Main St, Yardley PA</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User size={20} className="text-primary" />
        </div>
      </div>

      {/* Ask Primer */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))}
        className="w-full mb-6 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 px-4 py-3.5 text-left transition-all active:scale-[0.98]"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
          <Sparkles size={20} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-body-small font-semibold text-foreground">Ask Primer</p>
          <p className="text-caption text-muted-foreground">AI-powered home assistant</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-primary/10 text-caption font-medium text-primary flex-shrink-0">
          Chat
        </div>
      </button>

      {/* Timely Tasks Callout */}
      {timelyTasks.length > 0 && (
        <button
          onClick={() => navigate("/tasks")}
          className="w-full mb-6 flex items-center gap-3 rounded-2xl bg-warning/10 border border-warning/20 px-4 py-3 transition-all active:scale-[0.98]"
        >
          <AlertCircle size={20} className="text-warning flex-shrink-0" />
          <p className="text-body-small font-semibold text-foreground flex-1">
            {timelyTasks.length} {timelyTasks.length === 1 ? "task" : "tasks"} need attention
          </p>
          <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
        </button>
      )}

      {/* Goals Header */}
      <div className="mb-6">
        <h2 className="text-h3 font-semibold text-foreground mb-1">Time to Get Primed</h2>
        <p className="text-body-small text-muted-foreground">Jump into a goal below</p>
      </div>

      {/* Missions */}
      {loading ? (
        <div className="py-8 text-center text-muted-foreground text-body-small">Loading...</div>
      ) : (
        <section className="mb-8">
          <div className="flex flex-col gap-3">
            {sortedMissions.map((mission) => {
              const meta = MISSION_META[mission];
              const progress = missionProgress[mission];
              const isComplete = progress.isComplete;
              
              return (
                <motion.button
                  key={mission}
                  onClick={() => navigate("/tasks", { state: { openMission: mission } })}
                  className={`card-primer flex items-center gap-3 text-left transition-all active:scale-[0.98] ${
                    isComplete ? "opacity-60" : ""
                  }`}
                >
                  <span className="text-2xl flex-shrink-0">
                    {isComplete ? "✓" : meta.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-body-small font-semibold ${isComplete ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {meta.label}
                    </p>
                    <p className={`text-caption ${isComplete ? "text-muted-foreground/60" : "text-muted-foreground"}`}>
                      {meta.hook}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className={`text-caption font-medium ${isComplete ? "text-muted-foreground/60" : "text-muted-foreground"}`}>
                      {progress.completed}/{progress.total}
                    </p>
                    <ChevronRight size={18} className={isComplete ? "text-muted-foreground/40" : "text-muted-foreground"} />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </section>
      )}

      {/* Your Pros */}
      <section className="mt-2 mb-8">
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
