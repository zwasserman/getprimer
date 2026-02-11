import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Flame, Droplets, Shield, Zap, CheckCircle, ChevronRight } from "lucide-react";
import StatusBadge, { type Status } from "@/components/StatusBadge";
import { differenceInDays, format } from "date-fns";

function computeStatus(dueDate: Date): Status {
  const days = differenceInDays(dueDate, new Date());
  if (days < 0) return "overdue";
  if (days <= 30) return "due";
  return "upcoming";
}

function formatDueLabel(dueDate: Date, status: Status): string {
  if (status === "overdue") return `Was ${format(dueDate, "MMM d")}`;
  if (status === "due") {
    const days = differenceInDays(dueDate, new Date());
    return `Due soon · ${days}d`;
  }
  const days = differenceInDays(dueDate, new Date());
  return `Due · ${format(dueDate, "MMM")} · ${days}d`;
}

const allTasks = [
  { id: 1, title: "Replace HVAC Filter", icon: Flame, category: "HVAC", dueDate: new Date("2026-02-05") },
  { id: 2, title: "Test Smoke Detectors", icon: Shield, category: "Safety", dueDate: new Date("2026-02-18") },
  { id: 3, title: "Check Water Heater", icon: Droplets, category: "Plumbing", dueDate: new Date("2026-02-25") },
  { id: 4, title: "Inspect Electrical Panel", icon: Zap, category: "Electrical", dueDate: new Date("2026-04-15") },
  { id: 5, title: "Clean Gutters", icon: Flame, category: "Exterior", dueDate: new Date("2026-05-10") },
].map((t) => ({ ...t, status: computeStatus(t.dueDate) }));

const priorityTasks = allTasks.filter((t) => t.status === "overdue" || t.status === "due");

const recentActivity = [
  { title: "Replaced HVAC filter", time: "2 days ago" },
  { title: "Tested smoke detectors", time: "5 days ago" },
  { title: "Checked water pressure", time: "1 week ago" },
];

const HubPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col min-h-screen px-4 pt-14 pb-32"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-h1 text-foreground">Anna and Zach's Home</h1>
          <p className="text-body-small text-muted-foreground mt-1">1234 Main St, Yardley PA</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User size={20} className="text-primary" />
        </div>
      </div>

      {/* Priority Tasks */}
      {priorityTasks.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h3 text-foreground">Priority</h2>
            <button
              onClick={() => navigate("/tasks")}
              className="flex items-center gap-1 text-caption font-medium text-primary"
            >
              See all tasks
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-2 scrollbar-hide">
            {priorityTasks.map((task) => {
              const Icon = task.icon;
              return (
                <motion.button
                  key={task.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/tasks/${task.id}`)}
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

    </motion.div>
  );
};

export { HubPage };
export default HubPage;
