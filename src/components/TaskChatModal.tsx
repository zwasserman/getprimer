import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mic, Send, Flame, Droplets, Shield, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge, { type Status } from "@/components/StatusBadge";

const iconMap: Record<string, typeof Flame> = {
  HVAC: Flame,
  Plumbing: Droplets,
  Safety: Shield,
  Electrical: Zap,
  Exterior: Flame,
};

export interface TaskForModal {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  status: Status;
  dueDate: Date;
  why?: string;
}

interface Message {
  id: number;
  type: "system" | "user" | "task-card" | "walkthrough-step";
  content: string;
  stepIndex?: number;
  totalSteps?: number;
  task?: {
    title: string;
    category: string;
    difficulty: string;
    why: string;
  };
}

const actionChips = [
  { label: "I've done this", id: "done" },
  { label: "Walk me through it", id: "walkthrough" },
  { label: "Remind me later", id: "remind" },
  { label: "Skip for now", id: "skip" },
];

function getWalkthroughSteps(title: string): Message[] {
  return [
    { id: 0, type: "system", content: "Great choice! Let's do this step by step 👇" },
    { id: 0, type: "walkthrough-step", stepIndex: 1, totalSteps: 4, content: `Find the area related to your ${title.toLowerCase()} task. Look around the relevant part of your home.` },
    { id: 0, type: "walkthrough-step", stepIndex: 2, totalSteps: 4, content: "Gather any tools or supplies you might need before getting started." },
    { id: 0, type: "walkthrough-step", stepIndex: 3, totalSteps: 4, content: "Follow the standard procedure — take your time and do it right." },
    { id: 0, type: "walkthrough-step", stepIndex: 4, totalSteps: 4, content: "Clean up and make sure everything is back in order." },
    { id: 0, type: "system", content: "That's it! 🎉 Great job. Let me know when you're done ✓" },
  ];
}

interface TaskChatModalProps {
  task: TaskForModal | null;
  open: boolean;
  onClose: () => void;
}

const TaskChatModal = ({ task, open, onClose }: TaskChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [walkthroughQueue, setWalkthroughQueue] = useState<Message[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (task && open) {
      const why = task.why || `Keeping up with "${task.title}" helps maintain your home's value and safety.`;
      setMessages([
        { id: 1, type: "system", content: "Here's your task:" },
        {
          id: 2,
          type: "task-card",
          content: "",
          task: {
            title: task.title,
            category: task.category,
            difficulty: task.difficulty,
            why,
          },
        },
      ]);
      setInput("");
      setTyping(false);
      setWalkthroughQueue([]);
      setCompletedSteps(new Set());
    }
  }, [task, open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const addResponsesSequentially = (responses: Message[]) => {
    setTyping(true);
    responses.forEach((msg, i) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, { ...msg, id: Date.now() + i }]);
        if (i === responses.length - 1) setTyping(false);
      }, 600 + i * 700);
    });
  };

  const handleWalkthrough = () => {
    if (!task) return;
    const steps = getWalkthroughSteps(task.title);
    const intro = steps[0];
    const firstStep = steps[1];
    const remaining = steps.slice(2);
    setWalkthroughQueue(remaining);
    setCompletedSteps(new Set());
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { ...intro, id: Date.now() }]);
      setTimeout(() => {
        setMessages((prev) => [...prev, { ...firstStep, id: Date.now() + 1 }]);
        setTyping(false);
      }, 600);
    }, 400);
  };

  const handleStepDone = (stepIndex: number) => {
    setCompletedSteps((prev) => new Set([...prev, stepIndex]));
    if (walkthroughQueue.length > 0) {
      const next = walkthroughQueue[0];
      setWalkthroughQueue((prev) => prev.slice(1));
      setTyping(true);
      setTimeout(() => {
        setMessages((prev) => [...prev, { ...next, id: Date.now() }]);
        setTyping(false);
      }, 500);
    }
  };

  const handleChip = (id: string) => {
    if (typing) return;
    const chip = actionChips.find((c) => c.id === id);
    if (!chip) return;
    setMessages((prev) => [...prev, { id: Date.now(), type: "user", content: chip.label }]);

    if (id === "walkthrough") {
      handleWalkthrough();
    } else if (id === "done") {
      addResponsesSequentially([
        { id: 0, type: "system", content: "Nice work! 🎉 That's one more task checked off your list." },
      ]);
    } else if (id === "remind") {
      addResponsesSequentially([
        { id: 0, type: "system", content: "No problem! I'll remind you about this in 3 days. 📅" },
      ]);
    } else if (id === "skip") {
      addResponsesSequentially([
        { id: 0, type: "system", content: "Skipped for now — no worries, we'll come back to it later." },
      ]);
    }
  };

  const sendMessage = (text: string) => {
    if (!text.trim() || typing) return;
    setMessages((prev) => [...prev, { id: Date.now(), type: "user", content: text }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, type: "system", content: "Thanks for letting me know! I'll keep that in mind as we work through this task together." },
      ]);
    }, 800);
  };

  if (!task) return null;

  const Icon = iconMap[task.category] || Flame;

  return (
    <AnimatePresence>
      {open && (
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
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
              <ArrowLeft size={22} />
            </button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-secondary" />
              </div>
              <h1 className="text-h3 text-foreground truncate">{task.title}</h1>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-24">
            <div className="flex flex-col gap-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {msg.type === "system" && (
                    <div className="flex justify-start">
                      <div className="bg-card rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%] shadow-card border border-border/50">
                        <p className="text-body-small text-foreground">{msg.content}</p>
                      </div>
                    </div>
                  )}

                  {msg.type === "walkthrough-step" && msg.stepIndex != null && (
                    <div className="bg-card rounded-2xl p-4 max-w-[90%] border border-border/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-caption text-muted-foreground">Step {msg.stepIndex} of {msg.totalSteps}</span>
                      </div>
                      <p className="text-body text-foreground mb-3">{msg.content}</p>
                      {completedSteps.has(msg.stepIndex) ? (
                        <div className="flex items-center gap-1.5 text-success">
                          <CheckCircle2 size={16} />
                          <span className="text-body-small font-medium">Done!</span>
                        </div>
                      ) : (
                        <Button
                          variant="chip"
                          size="chip"
                          className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                          onClick={() => handleStepDone(msg.stepIndex!)}
                        >
                          Done with this step ✓
                        </Button>
                      )}
                    </div>
                  )}

                  {msg.type === "user" && (
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]">
                        <p className="text-body-small">{msg.content}</p>
                      </div>
                    </div>
                  )}

                  {msg.type === "task-card" && msg.task && (
                    <div className="flex flex-col gap-3">
                      <div className="card-primer">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                            <Icon size={16} className="text-secondary" />
                          </div>
                          <StatusBadge status={task.status} dueDate={task.dueDate} />
                          <span className="text-caption text-muted-foreground ml-auto">{msg.task.difficulty}</span>
                        </div>
                        <h2 className="text-h2 text-foreground mb-2">{msg.task.title}</h2>
                        <p className="text-body-small text-muted-foreground">{msg.task.why}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {actionChips.map((chip) => (
                          <Button key={chip.id} variant="chip" size="chip" onClick={() => handleChip(chip.id)}>
                            {chip.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Input - pinned to bottom */}
          <div className="px-4 pb-4 pt-2 bg-background">
            <div className="flex items-center gap-2 bg-card rounded-full shadow-elevated px-4 py-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask a question..."
                className="flex-1 bg-transparent outline-none text-body text-foreground placeholder:text-muted-foreground"
              />
              <button className="text-muted-foreground hover:text-foreground transition-colors p-1" aria-label="Voice input">
                <Mic size={20} />
              </button>
              <button onClick={() => sendMessage(input)} className="text-primary hover:text-primary/80 transition-colors p-1" aria-label="Send">
                <Send size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskChatModal;
