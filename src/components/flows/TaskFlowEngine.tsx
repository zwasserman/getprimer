import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

/* ── Shared Types ──────────────────────────────────── */

export interface StepMessage {
  text: string;
  type: "system" | "tip";
}

export interface Chip {
  label: string;
  next: string;
  value?: string;
}

export interface FlowStep {
  messages: StepMessage[];
  chips?: Chip[];
  autoAdvance?: string;
  customCard?: string; // key for rendering a custom embedded card
}

export interface FlowDefinition {
  steps: Record<string, FlowStep>;
  initialStep: string;
  title: string;
}

interface ChatMessage {
  id: string;
  type: "system" | "tip" | "user";
  content: string;
}

/* ── Component ─────────────────────────────────────── */

interface TaskFlowEngineProps {
  flow: FlowDefinition;
  onClose: () => void;
  onComplete: () => void;
  onChipTap?: (chip: Chip, state: Record<string, string>) => Record<string, string>;
  applyTemplate?: (text: string, state: Record<string, string>) => string;
  renderCustomCard?: (key: string, state: Record<string, string>) => React.ReactNode;
}

const TaskFlowEngine = ({
  flow,
  onClose,
  onComplete,
  onChipTap,
  applyTemplate: customApplyTemplate,
  renderCustomCard,
}: TaskFlowEngineProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentChips, setCurrentChips] = useState<Chip[] | null>(null);
  const [animating, setAnimating] = useState(false);
  const [flowState, setFlowState] = useState<Record<string, string>>({});
  const [customCardKey, setCustomCardKey] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentChips, customCardKey, scrollToBottom]);

  const applyTemplate = useCallback(
    (text: string, state: Record<string, string>) => {
      if (customApplyTemplate) return customApplyTemplate(text, state);
      return text.replace(/\{(\w+)\}/g, (_, key) => state[key] || `{${key}}`);
    },
    [customApplyTemplate]
  );

  const showStep = useCallback(
    (stepId: string, state: Record<string, string>) => {
      const step = flow.steps[stepId];
      if (!step) return;

      setAnimating(true);
      setCurrentChips(null);
      setCustomCardKey(null);

      const stepMessages: ChatMessage[] = step.messages.map((m, i) => ({
        id: `${stepId}-${i}-${Date.now()}`,
        type: m.type,
        content: applyTemplate(m.text, state),
      }));

      stepMessages.forEach((msg, i) => {
        setTimeout(() => {
          setMessages((prev) => [...prev, msg]);
        }, 400 + i * 450);
      });

      const totalDelay = 400 + stepMessages.length * 450 + 200;
      setTimeout(() => {
        if (step.customCard) {
          setCustomCardKey(step.customCard);
        }
        if (step.chips) {
          setCurrentChips(step.chips);
        }
        if (step.autoAdvance) {
          setTimeout(() => showStep(step.autoAdvance!, state), 800);
        } else {
          setAnimating(false);
        }
        if (stepId === "complete") {
          setIsComplete(true);
          setTimeout(() => onComplete(), 2000);
        }
      }, totalDelay);
    },
    [flow.steps, applyTemplate, onComplete]
  );

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      showStep(flow.initialStep, flowState);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChipTap = useCallback(
    (chip: Chip) => {
      if (animating) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        type: "user",
        content: chip.label,
      };
      setMessages((prev) => [...prev, userMsg]);
      setCurrentChips(null);
      setCustomCardKey(null);

      let newState = { ...flowState };
      if (onChipTap) {
        newState = onChipTap(chip, newState);
      }
      if (chip.value) {
        newState[chip.next] = chip.value;
      }
      setFlowState(newState);

      setTimeout(() => showStep(chip.next, newState), 300);
    },
    [animating, flowState, showStep, onChipTap]
  );

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
      <div className="flex items-center gap-3 px-4 pt-5 pb-3 border-b border-border/30">
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-body-small font-medium text-foreground truncate">{flow.title}</h1>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
        <div className="flex flex-col gap-3 max-w-[600px] mx-auto">
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {msg.type === "system" && (
                  <div className="max-w-[88%]">
                    <p className="text-body text-foreground leading-relaxed">{msg.content}</p>
                  </div>
                )}
                {msg.type === "tip" && (
                  <div className="max-w-[88%]">
                    <p className="text-body-small text-muted-foreground leading-relaxed">💡 {msg.content}</p>
                  </div>
                )}
                {msg.type === "user" && (
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2.5 max-w-[80%]">
                      <p className="text-body-small">{msg.content}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Custom Card */}
          {customCardKey && renderCustomCard && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {renderCustomCard(customCardKey, flowState)}
            </motion.div>
          )}

          {/* Action Chips */}
          {currentChips && !animating && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-wrap gap-2 pt-1"
            >
              {currentChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleChipTap(chip)}
                  className="h-10 px-4 rounded-full border border-border bg-card text-body-small font-medium text-foreground hover:bg-muted active:scale-[0.97] transition-all shadow-card"
                >
                  {chip.label}
                </button>
              ))}
            </motion.div>
          )}

          {/* Typing indicator */}
          {animating && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 py-2">
              <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskFlowEngine;
