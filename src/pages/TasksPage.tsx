import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Loader2, ChevronRight, CheckCircle2, Calendar } from
"lucide-react";
import StatusBadge, { type Status } from "@/components/StatusBadge";
import TaskChatModal, { type TaskForModal } from "@/components/TaskChatModal";
import { useHomeTasks, type SurfacedTask } from "@/hooks/useHomeTasks";
import { MISSION_META, MISSION_ORDER } from "@/lib/missions";

const TasksPage = () => {
  const { tasks, loading, error, refetch } = useHomeTasks({ allTiers: true });
  const [selectedTask, setSelectedTask] = useState<TaskForModal | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [autoOpenMission, setAutoOpenMission] = useState<string | null>(null);

  // Handle navigation from Hub with mission parameter
  useEffect(() => {
    const state = location.state as {openMission?: string;} | null;
    if (state?.openMission) {
      setAutoOpenMission(state.openMission);
      navigate(state.openMission, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // --- Timely Tasks: overdue or due recurring/seasonal tasks ---
  const timelyTasks = useMemo(() => {
    return tasks.filter(
      (t) => t.status === "overdue" || t.status === "due"
    );
  }, [tasks]);

  // --- Mission summaries ---
  const missionSummaries = useMemo(() => {
    const byMission: Record<string, {done: number;total: number;}> = {};
    for (const t of tasks) {
      if (!t.mission) continue;
      if (!byMission[t.mission]) byMission[t.mission] = { done: 0, total: 0 };
      byMission[t.mission].total++;
      if (t.status === "completed") byMission[t.mission].done++;
    }

    const incomplete: string[] = [];
    const complete: string[] = [];
    for (const m of MISSION_ORDER) {
      const s = byMission[m];
      if (!s || s.total === 0) continue;
      if (s.done >= s.total) complete.push(m);else
      incomplete.push(m);
    }
    return { byMission, order: [...incomplete, ...complete] };
  }, [tasks]);

  // --- Recurring tasks that have been completed at least once and are on a schedule ---
  const recurringTasks = useMemo(() => {
    return tasks.
    filter(
      (t) =>
      (t.task_type === "recurring" || t.task_type === "seasonal") &&
      t.homeTaskId // has a home_task record (engaged)
    ).
    sort((a, b) => {
      // Due/overdue first
      const urgencyOrder = { overdue: 0, due: 1, upcoming: 2, completed: 3 };
      const aO = urgencyOrder[a.status] ?? 2;
      const bO = urgencyOrder[b.status] ?? 2;
      if (aO !== bO) return aO - bO;
      // Then by next due date
      if (a.nextDueAt && b.nextDueAt) return a.nextDueAt.getTime() - b.nextDueAt.getTime();
      return 0;
    });
  }, [tasks]);

  const openTask = (task: SurfacedTask) => setSelectedTask(task as unknown as TaskForModal);

  const getBadgeStatus = (task: SurfacedTask): Status => {
    if (task.task_type === "info") return "learn";
    if (task.status === "completed") return "completed";
    if (task.status === "overdue") return "overdue";
    if (task.status === "due") return "due";
    return "upcoming";
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen px-4 pt-14 pb-32 items-center justify-center lg:pt-8 lg:pb-8 lg:px-8">
        <Loader2 size={32} className="animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>);

  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen px-4 pt-14 pb-32 items-center justify-center lg:pt-8 lg:pb-8 lg:px-8">
        <p className="text-muted-foreground text-center">{error}</p>
      </div>);

  }

  return (
    <div className="flex flex-col min-h-screen px-4 pt-14 pb-32 lg:pt-8 lg:pb-8 lg:px-8">
      {/* Header */}
      <h1 className="text-h1 text-foreground mb-6">Tasks</h1>

      {/* Section 1: Timely Tasks (conditional) */}
      {timelyTasks.length > 0 &&
      <section className="mb-8">
          <h2 className="text-caption uppercase tracking-[1px] text-muted-foreground mb-3">
            Timely
          </h2>
          <div className="flex flex-col gap-2">
            {timelyTasks.map((task) => {
            const missionIcon = task.mission ? MISSION_META[task.mission]?.icon : "";
            return (
              <motion.button
                key={task.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => openTask(task)}
                className="card-primer flex items-center gap-3 w-full text-left">

                  <span className="text-lg flex-shrink-0">{missionIcon}</span>
                  <p className="text-body font-semibold text-foreground flex-1 min-w-0 truncate">
                    {task.title}
                  </p>
                  <StatusBadge status={getBadgeStatus(task)} dueDate={task.nextDueAt || undefined} />
                </motion.button>);

          })}
          </div>
        </section>
      }

      {/* Section 2: Missions */}
      <section className="mb-8">
        <h2 className="text-caption uppercase tracking-[1px] text-muted-foreground mb-3">
          Missions
        </h2>
        <div className="flex flex-col gap-3">
          {missionSummaries.order.map((missionId) => {
            const meta = MISSION_META[missionId];
            if (!meta) return null;
            const summary = missionSummaries.byMission[missionId];
            const isComplete = summary && summary.done >= summary.total;

            return (
              <motion.button
                key={missionId}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/tasks/mission/${missionId}`)}
                className={`card-primer flex items-center gap-3 w-full text-left ${isComplete ? "opacity-60" : ""}`}>

                <span className="text-2xl flex-shrink-0">
                  {isComplete ? <CheckCircle2 size={24} className="text-success" /> : meta.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-h3 ${isComplete ? "text-muted-foreground" : "text-foreground"}`}>
                    {meta.label}
                  </p>
                  <p className="text-body-small text-muted-foreground truncate text-xs">
                    {meta.hook}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-body-small text-muted-foreground">
                    {summary?.done || 0}/{summary?.total || 0}
                  </span>
                  <ChevronRight size={18} className="text-muted-foreground" />
                </div>
              </motion.button>);

          })}
        </div>
      </section>

      {/* Section 3: Recurring Tasks (conditional) */}
      {recurringTasks.length > 0 &&
      <section className="mb-8">
          <h2 className="text-caption uppercase tracking-[1px] text-muted-foreground mb-3">
            Recurring Tasks
          </h2>
          <div className="flex flex-col gap-1">
            {recurringTasks.map((task) => {
            const missionIcon = task.mission ? MISSION_META[task.mission]?.icon : "";
            return (
              <motion.button
                key={task.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => openTask(task)}
                className="flex items-center gap-3 w-full text-left py-3 border-b border-border/30 last:border-0">

                  <Calendar size={16} className="text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-body font-medium text-foreground truncate">
                      {task.title}
                    </p>
                    <p className="text-body-small text-muted-foreground">
                      {task.frequency || task.task_type === "seasonal" ? "Seasonal" : "Recurring"}
                      {task.nextDueAt && ` · Next: ${task.nextDueAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm">{missionIcon}</span>
                    {(task.status === "due" || task.status === "overdue") &&
                  <StatusBadge status={getBadgeStatus(task)} dueDate={task.nextDueAt || undefined} />
                  }
                  </div>
                </motion.button>);

          })}
          </div>
        </section>
      }

      <TaskChatModal
        task={selectedTask}
        open={!!selectedTask}
        onClose={() => {
          setSelectedTask(null);
          refetch();
        }} />

    </div>);

};

export default TasksPage;