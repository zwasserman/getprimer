import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Flame, Droplets, Shield, Home as HomeIcon, CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";

const HubWelcome = ({ onStart }: { onStart: () => void }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col min-h-screen px-4 pt-14 pb-32"
    >
      <div className="flex justify-end mb-8">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User size={20} className="text-primary" />
        </div>
      </div>

      <h1 className="text-display text-foreground mb-12">
        Welcome to your{"\n"}new home, Zach 👋
      </h1>

      <div className="card-primer flex flex-col items-center text-center p-8 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
          <HomeIcon size={28} className="text-primary" />
        </div>
        <h2 className="text-h2 text-foreground">Ready to get started?</h2>
        <p className="text-body text-muted-foreground">
          Let's tackle your first maintenance task together.
        </p>
        <Button size="lg" className="w-full mt-2" onClick={onStart}>
          Start Your First Task
        </Button>
      </div>
    </motion.div>
  );
};

const comingUpTasks = [
  { id: 1, title: "Replace HVAC Filter", icon: Flame, category: "HVAC", due: "Due Tue", status: "due" as const },
  { id: 2, title: "Test Smoke Detectors", icon: Shield, category: "Safety", due: "Due Fri", status: "due" as const },
  { id: 3, title: "Check Water Heater", icon: Droplets, category: "Plumbing", due: "Due Next Week", status: "upcoming" as const },
];

const recentActivity = [
  { title: "Replaced HVAC filter", time: "2 days ago" },
  { title: "Tested smoke detectors", time: "5 days ago" },
  { title: "Checked water pressure", time: "1 week ago" },
];

const HubActive = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col min-h-screen px-4 pt-14 pb-32"
    >
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-h1 text-foreground">Your Home</h1>
          <p className="text-body-small text-muted-foreground mt-1">1234 Main St, Yardley PA</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User size={20} className="text-primary" />
        </div>
      </div>

      {/* Coming Up */}
      <section className="mb-8">
        <h2 className="text-h3 text-foreground mb-4">Coming Up</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {comingUpTasks.map((task) => {
            const Icon = task.icon;
            return (
              <motion.button
                key={task.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/tasks/${task.id}`)}
                className="card-primer flex-shrink-0 w-[180px] h-[140px] flex flex-col justify-between text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Icon size={18} className="text-secondary" />
                  </div>
                  <StatusBadge status={task.status} />
                </div>
                <div>
                  <p className="text-body-small font-semibold text-foreground">{task.title}</p>
                  <p className="text-caption text-muted-foreground mt-1">{task.due}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

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

      {/* Progress */}
      <section>
        <h2 className="text-h3 text-foreground mb-4">Your Progress</h2>
        <div className="card-primer">
          <div className="flex items-center justify-between mb-3">
            <p className="text-body-small font-medium text-foreground">8 of 12 tasks</p>
            <p className="text-caption text-muted-foreground">67%</p>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "67%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const HubPage = () => {
  const [showActive, setShowActive] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Demo toggle */}
      <button
        onClick={() => setShowActive(!showActive)}
        className="fixed top-4 left-4 z-50 px-3 py-1.5 rounded-full bg-card text-caption text-muted-foreground shadow-card"
      >
        {showActive ? "Welcome view" : "Active view"}
      </button>
      <AnimatePresence mode="wait">
        {showActive ? (
          <HubActive key="active" />
        ) : (
          <HubWelcome key="welcome" onStart={() => navigate("/chat")} />
        )}
      </AnimatePresence>
    </div>
  );
};

// Export toggle so we can switch from elsewhere for demo
export { HubPage };
export default HubPage;
