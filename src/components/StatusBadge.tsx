import { cn } from "@/lib/utils";

type Status = "due" | "overdue" | "completed" | "upcoming" | "new";

const statusConfig: Record<Status, { label: string; bgClass: string; textClass: string }> = {
  due: { label: "Due", bgClass: "bg-status-due-bg", textClass: "text-status-due-text" },
  overdue: { label: "Overdue", bgClass: "bg-status-overdue-bg", textClass: "text-status-overdue-text" },
  completed: { label: "Done", bgClass: "bg-status-completed-bg", textClass: "text-status-completed-text" },
  upcoming: { label: "Upcoming", bgClass: "bg-status-upcoming-bg", textClass: "text-status-upcoming-text" },
  new: { label: "New", bgClass: "bg-status-new-bg", textClass: "text-status-new-text" },
};

const StatusBadge = ({ status, className }: { status: Status; className?: string }) => {
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium", config.bgClass, config.textClass, className)}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
export type { Status };
