import { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Circle, CheckCircle2, BookOpen, MoreVertical, Loader2, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge, { type Status } from "@/components/StatusBadge";
import TaskChatModal, { type TaskForModal } from "@/components/TaskChatModal";
import { useHomeTasks, type SurfacedTask } from "@/hooks/useHomeTasks";
import { MISSION_META, getCurrentSeason, getSeasonLabel } from "@/lib/missions";
import { toast } from "sonner";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

const TYPE_LABELS: Record<string, { label: string; className: string }> = {
  one_time: { label: "One-Time", className: "bg-muted text-foreground" },
  recurring: { label: "Recurring", className: "bg-muted text-foreground" },
  seasonal: { label: "Seasonal", className: "bg-muted text-foreground" },
  info: { label: "Learn", className: "bg-status-learn-bg text-status-learn-text" },
  guided_process: { label: "Guided", className: "bg-muted text-foreground" },
  ongoing: { label: "Ongoing", className: "bg-muted text-foreground" },
};

function getFrequencyLabel(task: SurfacedTask): string {
  if (task.task_type === "info") return "Learn";
  if (task.task_type === "one_time") return "One-Time";
  if (task.task_type === "seasonal") return "Seasonal";
  if (task.task_type === "guided_process") return "Guided";
  if (task.task_type === "ongoing") return "Ongoing";
  if (task.frequency_days) {
    if (task.frequency_days <= 30) return "Monthly";
    if (task.frequency_days <= 90) return "Every 3 months";
    if (task.frequency_days <= 180) return "Every 6 months";
    return "Yearly";
  }
  return task.task_type === "recurring" ? "Recurring" : "One-Time";
}

const MissionDetailPage = () => {
  const { missionId } = useParams<{ missionId: string }>();
  const navigate = useNavigate();
  const { tasks, loading, completeTask, refetch } = useHomeTasks({ allTiers: true });
  const [selectedTask, setSelectedTask] = useState<TaskForModal | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const meta = missionId ? MISSION_META[missionId] : null;
  const isSeasonalPrep = missionId === "seasonal_prep";
  const currentSeason = getCurrentSeason();

  const missionTasks = useMemo(() => {
    if (!missionId) return [];
    return tasks
      .filter((t) => t.mission === missionId)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [tasks, missionId]);

  // For seasonal_prep, split by season
  const fallTasks = useMemo(() => missionTasks.filter((t) => t.season === "fall"), [missionTasks]);
  const springTasks = useMemo(() => missionTasks.filter((t) => t.season === "spring"), [missionTasks]);

  const incompleteTasks = useMemo(() => missionTasks.filter((t) => t.status !== "completed"), [missionTasks]);
  const completedTasks = useMemo(() => missionTasks.filter((t) => t.status === "completed"), [missionTasks]);
  const doneCount = completedTasks.length;
  const totalCount = missionTasks.length;

  const nextTask = incompleteTasks[0] || null;

  const handleComplete = useCallback(async (task: SurfacedTask) => {
    setMenuOpenId(null);
    await completeTask(task.id);
    toast("Task completed", {
      action: { label: "Undo", onClick: () => completeTask(task.id) },
      duration: 5000,
    });
  }, [completeTask]);

  const handleUncomplete = useCallback(async (task: SurfacedTask) => {
    setMenuOpenId(null);
    await completeTask(task.id);
  }, [completeTask]);

  const openTask = (task: SurfacedTask) => {
    setMenuOpenId(null);
    setSelectedTask(task as unknown as TaskForModal);
  };

  const getBadgeStatus = (task: SurfacedTask): Status => {
    if (task.task_type === "info") return "learn";
    if (task.status === "completed") return "completed";
    if (task.status === "overdue") return "overdue";
    if (task.status === "due") return "due";
    return "upcoming";
  };

  const renderTaskRow = (task: SurfacedTask, isCompleted: boolean) => {
    const isInfo = task.task_type === "info";
    const typeInfo = TYPE_LABELS[task.task_type] || TYPE_LABELS.one_time;

    return (
      <motion.div
        key={task.id}
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="flex items-center gap-3 min-h-[68px] border-b border-border/30 last:border-0 py-2"
      >
        {isInfo ? (
          <BookOpen size={20} className={`flex-shrink-0 ${isCompleted ? "text-muted-foreground/40" : "text-secondary"}`} />
        ) : (
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              if (isCompleted) handleUncomplete(task);
              else handleComplete(task);
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

        <button onClick={() => openTask(task)} className="flex-1 min-w-0 text-left">
          <p className={`text-body font-medium ${isCompleted ? "text-muted-foreground line-through" : "text-foreground"}`}>
            {task.title}
          </p>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-caption font-medium mt-0.5 ${typeInfo.className}`}>
            {getFrequencyLabel(task)}
          </span>
          {!isCompleted && (
            <p className="text-body-small text-muted-foreground mt-0.5">
              {task.difficulty || "Easy"} · {task.est_time || "15 min"}
            </p>
          )}
        </button>

        <div className="relative flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpenId(menuOpenId === task.id ? null : task.id);
            }}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <MoreVertical size={18} />
          </button>
          {menuOpenId === task.id && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-lg py-1 min-w-[160px]">
              {isCompleted ? (
                <button onClick={() => handleUncomplete(task)} className="w-full text-left px-3 py-2 text-body-small text-foreground hover:bg-muted/50">
                  Mark as not done
                </button>
              ) : (
                <button onClick={() => handleComplete(task)} className="w-full text-left px-3 py-2 text-body-small text-foreground hover:bg-muted/50">
                  Mark as complete
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  const renderTaskList = (taskList: SurfacedTask[]) => {
    const incomplete = taskList.filter((t) => t.status !== "completed");
    const completed = taskList.filter((t) => t.status === "completed");
    return (
      <>
        <AnimatePresence>
          {incomplete.map((task) => renderTaskRow(task, false))}
        </AnimatePresence>
        {completed.length > 0 && (
          <div className="mt-4">
            <p className="text-caption uppercase tracking-[1px] text-muted-foreground mb-2">Completed</p>
            <AnimatePresence>
              {completed.map((task) => renderTaskRow(task, true))}
            </AnimatePresence>
          </div>
        )}
      </>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-4 pt-14 pb-32 lg:pt-8 lg:pb-8">
        <Loader2 size={32} className="animate-spin text-primary mb-4" />
      </div>
    );
  }

  if (!meta) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-4 pt-14 pb-32 lg:pt-8 lg:pb-8">
        <p className="text-muted-foreground">Mission not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen px-4 pt-14 pb-32 lg:pt-8 lg:pb-8 lg:px-8">
      {menuOpenId && <div className="fixed inset-0 z-40" onClick={() => setMenuOpenId(null)} />}

      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate("/tasks")} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={22} />
        </button>
      </div>

      <div className="mb-6">
        <h1 className="text-h1 text-foreground flex items-center gap-2">
          <span>{meta.icon}</span> {meta.label}
        </h1>
        <p className="text-body-small text-muted-foreground mt-1">
          {doneCount}/{totalCount} completed
        </p>
      </div>

      {nextTask && (
        <Button onClick={() => openTask(nextTask)} className="w-full h-12 rounded-full text-body font-semibold mb-6">
          Continue with this mission
        </Button>
      )}

      {/* Seasonal Prep: split by season with collapsible sections */}
      {isSeasonalPrep ? (
        <div className="flex flex-col gap-6">
          {/* Current season first, expanded */}
          {[currentSeason, currentSeason === "fall" ? "spring" : "fall"].map((season, idx) => {
            const seasonTasks = season === "fall" ? fallTasks : springTasks;
            const isCurrent = idx === 0;
            const seasonDone = seasonTasks.filter(t => t.status === "completed").length;
            return (
              <Collapsible key={season} defaultOpen={isCurrent}>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-2 group">
                  <div className="flex items-center gap-2">
                    <h2 className="text-h3 font-semibold text-foreground">
                      {getSeasonLabel(season as "fall" | "spring")} Prep
                    </h2>
                    <span className="text-caption text-muted-foreground">
                      {seasonDone}/{seasonTasks.length}
                    </span>
                    {isCurrent && (
                      <span className="text-caption font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <ChevronDown size={18} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  {renderTaskList(seasonTasks)}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      ) : (
        <>
          <AnimatePresence>
            {incompleteTasks.map((task) => renderTaskRow(task, false))}
          </AnimatePresence>
          {completedTasks.length > 0 && (
            <div className="mt-6">
              <p className="text-caption uppercase tracking-[1px] text-muted-foreground mb-2">Completed</p>
              <AnimatePresence>
                {completedTasks.map((task) => renderTaskRow(task, true))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      <TaskChatModal
        task={selectedTask}
        open={!!selectedTask}
        onClose={() => {
          setSelectedTask(null);
          refetch();
        }}
      />
    </div>
  );
};

export default MissionDetailPage;
