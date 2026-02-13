import { motion } from "framer-motion";
import { ArrowLeft, Clock, DollarSign, Flame, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskDetailViewProps {
  title: string;
  category: string;
  difficulty: string;
  estTime: string;
  estCost?: string;
  whyItMatters: string;
  whatYoullLearn: string[];
  onBack: () => void;
  onWalkthrough: () => void;
  onAlreadyDone: () => void;
}

const TaskDetailView = ({
  title,
  category,
  difficulty,
  estTime,
  estCost = "Free",
  whyItMatters,
  whatYoullLearn,
  onBack,
  onWalkthrough,
  onAlreadyDone,
}: TaskDetailViewProps) => {
  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col"
      style={{ overscrollBehavior: "contain" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-3">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <ArrowLeft size={22} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-32">
        <div className="max-w-[600px] mx-auto">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-h1 text-foreground mb-4"
          >
            {title}
          </motion.h1>

          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap items-center gap-2 mb-5"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-caption font-medium">
              <Flame size={12} />
              {category}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-status-completed-bg text-status-completed-text text-caption font-medium">
              {difficulty}
            </span>
          </motion.div>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4 text-body-small text-muted-foreground mb-8"
          >
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {estTime}
            </span>
            <span className="flex items-center gap-1.5">
              <DollarSign size={14} />
              {estCost}
            </span>
          </motion.div>

          {/* Why It Matters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-8"
          >
            <h2 className="text-h3 text-foreground mb-2">Why It Matters</h2>
            <p className="text-body text-muted-foreground leading-relaxed">
              {whyItMatters}
            </p>
          </motion.div>

          {/* What You'll Learn */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-h3 text-foreground mb-3">What You'll Learn</h2>
            <ul className="space-y-2.5">
              {whatYoullLearn.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-success flex-shrink-0 mt-0.5" />
                  <span className="text-body text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>

      {/* CTAs — pinned to bottom */}
      <div className="px-5 pb-6 pt-3 bg-background border-t border-border/30">
        <div className="max-w-[600px] mx-auto space-y-3">
          <Button
            onClick={onWalkthrough}
            className="w-full h-12 rounded-full text-body font-semibold"
          >
            Walk Me Through It
          </Button>
          <Button
            onClick={onAlreadyDone}
            variant="outline"
            className="w-full h-12 rounded-full text-body font-medium"
          >
            I've Already Done This
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskDetailView;
