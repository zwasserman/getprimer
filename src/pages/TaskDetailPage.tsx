import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Flame, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import { useState } from "react";

const taskData = {
  title: "Replace HVAC Filter",
  category: "HVAC",
  difficulty: "Easy",
  status: "due" as const,
  due: "June 15",
  whyItMatters:
    "A clean HVAC filter improves your home's air quality and helps your heating and cooling system run more efficiently. Clogged filters make your system work harder, increasing energy bills and shortening its lifespan.",
  howToDoIt: [
    "Turn off your HVAC system",
    "Locate the filter slot — usually near the return air duct or the air handler unit",
    "Slide out the old filter and note its size (printed on the frame)",
    "Insert the new filter with the airflow arrow pointing toward the unit",
    "Turn the system back on",
  ],
  whatYouNeed: ["New HVAC filter (check size on current filter)", "Step stool if needed"],
};

const TaskDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [howExpanded, setHowExpanded] = useState(false);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    new Array(taskData.whatYouNeed.length).fill(false)
  );

  const toggleCheck = (i: number) => {
    setCheckedItems((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="min-h-screen pb-40"
    >
      {/* Header */}
      <div className="px-4 pt-14 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-muted-foreground mb-6"
        >
          <ArrowLeft size={20} />
          <span className="text-body-small">Back</span>
        </button>

        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-caption font-medium">
            <Flame size={14} />
            {taskData.category}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-caption font-medium">
            {taskData.difficulty}
          </span>
        </div>

        <h1 className="text-h1 text-foreground mb-3">{taskData.title}</h1>

        <div className="flex items-center gap-2">
          <StatusBadge status={taskData.status} />
          <span className="text-body-small text-muted-foreground">Due {taskData.due}</span>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-6">
        {/* Why It Matters */}
        <section>
          <h2 className="text-h3 text-foreground mb-2">Why It Matters</h2>
          <p className="text-body text-muted-foreground leading-relaxed">{taskData.whyItMatters}</p>
        </section>

        {/* How To Do It */}
        <section>
          <button
            onClick={() => setHowExpanded(!howExpanded)}
            className="flex items-center justify-between w-full"
          >
            <h2 className="text-h3 text-foreground">How to Do It</h2>
            <span className="text-caption text-primary">
              {howExpanded ? "Collapse" : "Expand"}
            </span>
          </button>
          {howExpanded && (
            <motion.ol
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 flex flex-col gap-3"
            >
              {taskData.howToDoIt.map((step, i) => (
                <li key={i} className="flex gap-3 text-body text-foreground">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-caption flex items-center justify-center font-semibold">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </motion.ol>
          )}
        </section>

        {/* What You'll Need */}
        <section>
          <h2 className="text-h3 text-foreground mb-3">What You'll Need</h2>
          <div className="flex flex-col gap-3">
            {taskData.whatYouNeed.map((item, i) => (
              <button
                key={i}
                onClick={() => toggleCheck(i)}
                className="flex items-center gap-3 text-left"
              >
                {checkedItems[i] ? (
                  <CheckCircle2 size={22} className="text-success flex-shrink-0" />
                ) : (
                  <Circle size={22} className="text-muted-foreground flex-shrink-0" />
                )}
                <span className={`text-body ${checkedItems[i] ? "text-muted-foreground line-through" : "text-foreground"}`}>
                  {item}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-24 left-0 right-0 px-4 flex flex-col gap-2">
        <Button size="lg" className="w-full">
          Walk Me Through It
        </Button>
        <Button variant="outline" size="lg" className="w-full">
          Mark Complete
        </Button>
      </div>
    </motion.div>
  );
};

export default TaskDetailPage;
