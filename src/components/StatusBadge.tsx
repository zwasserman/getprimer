import { cn } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";

type Status = "overdue" | "due" | "upcoming" | "completed" | "new" | "learn";

interface StatusBadgeProps {
  status: Status;
  dueDate?: Date;
  tierLabel?: string;
  className?: string;
}

function getLabel(status: Status, dueDate?: Date, tierLabel?: string): string {
  if (status === "overdue") return "Overdue";
  if (status === "completed") return "Done";
  if (status === "new") return "New";
  if (status === "learn") return "Learn";

  if (tierLabel) return tierLabel;

  if (dueDate) {
    const days = differenceInDays(dueDate, new Date());
    if (days <= 30) return `Due soon · ${days}d`;
    return `Due · ${format(dueDate, "MMM")} · ${days}d`;
  }

  return status === "due" ? "Due soon" : "Due";
}

const styleMap: Record<Status, { bgClass: string; textClass: string }> = {
  overdue: { bgClass: "bg-status-overdue-bg", textClass: "text-status-overdue-text" },
  due: { bgClass: "bg-status-due-bg", textClass: "text-status-due-text" },
  upcoming: { bgClass: "bg-status-upcoming-bg", textClass: "text-status-upcoming-text" },
  completed: { bgClass: "bg-status-completed-bg", textClass: "text-status-completed-text" },
  new: { bgClass: "bg-status-new-bg", textClass: "text-status-new-text" },
  learn: { bgClass: "bg-status-learn-bg", textClass: "text-status-learn-text" },
};

const StatusBadge = ({ status, dueDate, tierLabel, className }: StatusBadgeProps) => {
  const style = styleMap[status];
  const label = getLabel(status, dueDate, tierLabel);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-caption font-medium",
        style.bgClass,
        style.textClass,
        className
      )}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
export type { Status };
