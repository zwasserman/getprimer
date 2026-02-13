import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ShoppingCart, ExternalLink } from "lucide-react";

/* ── Types ─────────────────────────────────────────── */

interface StepMessage {
  text: string;
  type: "system" | "tip";
}

interface Chip {
  label: string;
  next: string;
  value?: string;
}

interface FlowStep {
  messages: StepMessage[];
  chips?: Chip[];
  productCard?: boolean;
  autoAdvance?: string; // auto-advance to next step after messages
}

interface ChatMessage {
  id: string;
  type: "system" | "tip" | "user" | "product-card";
  content: string;
}

/* ── Flow definition ───────────────────────────────── */

const STEPS: Record<string, FlowStep> = {
  opening: {
    messages: [
      { type: "system", text: "Let's find your HVAC filter. This is one of the easiest and most important things you can do for your home — and once you know where it is, checking it takes about 5 minutes." },
      { type: "system", text: "Based on the info we could find about your home, it looks like you have a gas furnace. Does that sound right?" },
    ],
    chips: [
      { label: "That sounds right", next: "thermostats" },
      { label: "I'm not sure", next: "thermostats" },
      { label: "That's not right", next: "thermostats" },
    ],
  },
  thermostats: {
    messages: [
      { type: "system", text: "Great — that means you've got at least one filter. Let's go find it." },
      { type: "system", text: "Quick question — how many thermostats do you have? These are the controls on the wall where you set the temperature." },
    ],
    chips: [
      { label: "Just one", next: "find_unit" },
      { label: "Two", next: "find_unit" },
      { label: "Three or more", next: "find_unit" },
    ],
  },
  find_unit: {
    messages: [
      { type: "system", text: "One thermostat usually means one system and one main filter. Nice and simple." },
      { type: "system", text: "Head to your basement — that's the most common spot for a furnace. You're looking for a large metal box, about the size of a small fridge, with metal ducts coming out of it." },
      { type: "system", text: "Let me know when you find it." },
    ],
    chips: [
      { label: "Found it", next: "find_slot" },
      { label: "Can't find it", next: "find_slot" },
    ],
  },
  find_slot: {
    messages: [
      { type: "system", text: "Now look at the bottom or side of the unit. You're looking for a narrow slot — about 1 inch wide — where a flat rectangular filter slides in." },
      { type: "tip", text: "Some have a small door or cover over the slot." },
    ],
    chips: [
      { label: "Found the filter slot", next: "pull_out" },
      { label: "Can't find a slot", next: "pull_out" },
    ],
  },
  pull_out: {
    messages: [
      { type: "system", text: "Nice — that's your main filter location. Go ahead and slide the filter out. It should pull straight out." },
      { type: "tip", text: "If it's snug, wiggle it gently side to side as you pull." },
    ],
    chips: [
      { label: "Got it out", next: "get_size" },
      { label: "It's stuck", next: "get_size" },
    ],
  },
  get_size: {
    messages: [
      { type: "system", text: "Now look at the edge of the filter frame. You should see the size printed on it — three numbers like 20x25x1." },
      { type: "system", text: "What size does it say? Here are the most common ones:" },
    ],
    chips: [
      { label: "16x20x1", next: "save_size", value: "16x20x1" },
      { label: "16x25x1", next: "save_size", value: "16x25x1" },
      { label: "20x20x1", next: "save_size", value: "20x20x1" },
      { label: "20x25x1", next: "save_size", value: "20x25x1" },
      { label: "20x25x4", next: "save_size", value: "20x25x4" },
      { label: "Different size", next: "save_size", value: "custom" },
    ],
  },
  save_size: {
    messages: [
      { type: "system", text: "Got it — {size}. Want me to save that to your home profile? That way you won't have to look it up next time." },
    ],
    chips: [
      { label: "Yes, save it", next: "saved" },
      { label: "No thanks", next: "check_filter" },
    ],
  },
  saved: {
    messages: [
      { type: "system", text: "Saved ✓ — I'll remember your filter is a {size}." },
    ],
    autoAdvance: "check_filter",
  },
  check_filter: {
    messages: [
      { type: "system", text: "Since you've got it out — take a quick look. Hold it up to the light if you can." },
      { type: "system", text: "A clean filter looks mostly white or light gray — you can see through it. A dirty one looks gray or dark and blocks the light." },
      { type: "system", text: "How does yours look?" },
    ],
    chips: [
      { label: "Looks clean", next: "slide_back_clean", value: "clean" },
      { label: "Getting gray", next: "slide_back_gray", value: "gray" },
      { label: "Really dirty", next: "slide_back_dirty", value: "dirty" },
    ],
  },
  slide_back_clean: {
    messages: [
      { type: "system", text: "Looking good! Slide it back in and you're set for a while." },
      { type: "tip", text: "There's an arrow on the filter frame showing airflow direction. Make sure the arrow points toward the furnace when you slide it back in." },
    ],
    chips: [{ label: "Back in — done ✓", next: "celebration" }],
  },
  slide_back_gray: {
    messages: [
      { type: "system", text: "Starting to build up but OK for now. Slide it back in — we'll make sure you stay on top of it." },
      { type: "tip", text: "There's an arrow on the filter frame showing airflow direction. Make sure the arrow points toward the furnace when you slide it back in." },
    ],
    chips: [{ label: "Back in — done ✓", next: "celebration" }],
  },
  slide_back_dirty: {
    messages: [
      { type: "system", text: "That one needs replacing soon — it's not filtering much anymore. Slide it back in for now and let's get you a new one." },
      { type: "tip", text: "There's an arrow on the filter frame showing airflow direction. Make sure the arrow points toward the furnace when you slide it back in." },
    ],
    chips: [{ label: "Back in — done ✓", next: "celebration" }],
  },
  celebration: {
    messages: [
      { type: "system", text: "Nice work — you now know where your filter is, what size it is, and what to look for. That's one of those things most homeowners don't figure out until something goes wrong. ✓" },
      { type: "system", text: "I've saved your HVAC info to your home profile and I'm setting up a recurring filter check for you. How often do you want me to remind you?" },
      { type: "tip", text: "Most filters should be checked every 1-3 months. If you have pets or allergies, lean toward monthly." },
    ],
    chips: [
      { label: "Every month", next: "reminder_set", value: "1 month" },
      { label: "Every 2 months", next: "reminder_set", value: "2 months" },
      { label: "Every 3 months", next: "reminder_set", value: "3 months" },
    ],
  },
  reminder_set: {
    messages: [
      { type: "system", text: "All set — I'll check in every {frequency}. It'll be a quick check since you already know where everything is." },
      { type: "system", text: "Since your filter could use attention, want me to help you find a replacement? A multi-pack means you'll have one ready next time." },
    ],
    chips: [
      { label: "Sure, show me", next: "product" },
      { label: "I'm good for now", next: "complete" },
    ],
  },
  product: {
    messages: [],
    productCard: true,
    chips: [
      { label: "What's next?", next: "complete" },
      { label: "I'm done for now", next: "complete" },
    ],
  },
  complete: {
    messages: [
      { type: "system", text: "You're all set with this one. Great job taking care of your home! 🏠" },
    ],
  },
};

/* ── Product Card ──────────────────────────────────── */

const ProductCard = ({ size }: { size: string }) => (
  <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-card max-w-[90%]">
    <div className="flex items-center gap-2 mb-3">
      <ShoppingCart size={18} className="text-primary" />
      <span className="text-body font-semibold text-foreground">HVAC Air Filter</span>
    </div>
    <div className="space-y-1.5 mb-3">
      <p className="text-body-small text-foreground">Size: <span className="font-medium">{size}</span></p>
      <p className="text-body-small text-foreground">Recommended: <span className="font-medium">MERV 8-11</span></p>
      <p className="text-body-small text-foreground">Est. cost: <span className="font-medium">$10-25</span></p>
    </div>
    <p className="text-caption text-muted-foreground mb-4">
      💡 MERV 8 is fine for most homes. Go MERV 11 if you have pets or allergies.
    </p>
    <div className="flex gap-2">
      <a
        href={`https://www.amazon.com/s?k=hvac+filter+${size}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-card text-body-small font-medium text-foreground hover:bg-muted transition-colors"
      >
        Search Amazon <ExternalLink size={12} />
      </a>
      <a
        href={`https://www.homedepot.com/s/${size}%20air%20filter`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-card text-body-small font-medium text-foreground hover:bg-muted transition-colors"
      >
        Home Depot <ExternalLink size={12} />
      </a>
    </div>
  </div>
);

/* ── Main Component ────────────────────────────────── */

interface HVACFilterFlowProps {
  onClose: () => void;
  onComplete: () => void;
  taskTitle?: string;
}

const HVACFilterFlow = ({ onClose, onComplete, taskTitle }: HVACFilterFlowProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentChips, setCurrentChips] = useState<Chip[] | null>(null);
  const [animating, setAnimating] = useState(false);
  const [flowState, setFlowState] = useState({ size: "20x25x1", frequency: "3 months", condition: "" });
  const [showProductCard, setShowProductCard] = useState(false);
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
  }, [messages, currentChips, showProductCard, scrollToBottom]);

  const applyTemplate = useCallback((text: string, state: typeof flowState) => {
    return text
      .replace(/\{size\}/g, state.size === "custom" ? "your filter size" : state.size)
      .replace(/\{frequency\}/g, state.frequency);
  }, []);

  const showStep = useCallback((stepId: string, state: typeof flowState) => {
    const step = STEPS[stepId];
    if (!step) return;

    setAnimating(true);
    setCurrentChips(null);
    setShowProductCard(false);

    const stepMessages: ChatMessage[] = step.messages.map((m, i) => ({
      id: `${stepId}-${i}-${Date.now()}`,
      type: m.type,
      content: applyTemplate(m.text, state),
    }));

    // Stagger messages with delays
    stepMessages.forEach((msg, i) => {
      setTimeout(() => {
        setMessages(prev => [...prev, msg]);
      }, 400 + i * 450);
    });

    // After all messages, show chips or product card
    const totalDelay = 400 + stepMessages.length * 450 + 200;
    setTimeout(() => {
      if (step.productCard) {
        setShowProductCard(true);
      }
      if (step.chips) {
        setCurrentChips(step.chips);
      }
      if (step.autoAdvance) {
        // Auto-advance after a brief pause
        setTimeout(() => showStep(step.autoAdvance!, state), 800);
      } else {
        setAnimating(false);
      }
      if (stepId === "complete") {
        setIsComplete(true);
        // Auto-close after a delay and mark complete
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    }, totalDelay);
  }, [applyTemplate, onComplete]);

  // Start the flow
  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      showStep("opening", flowState);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChipTap = useCallback((chip: Chip) => {
    if (animating) return;

    // Add user bubble
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: chip.label,
    };
    setMessages(prev => [...prev, userMsg]);
    setCurrentChips(null);
    setShowProductCard(false);

    // Update flow state based on chip value
    let newState = { ...flowState };
    if (chip.next === "save_size" && chip.value) {
      newState = { ...newState, size: chip.value };
    }
    if (chip.next === "reminder_set" && chip.value) {
      newState = { ...newState, frequency: chip.value };
    }
    if (chip.value && ["clean", "gray", "dirty"].includes(chip.value)) {
      newState = { ...newState, condition: chip.value };
    }
    setFlowState(newState);

    // Show next step after brief delay
    setTimeout(() => showStep(chip.next, newState), 300);
  }, [animating, flowState, showStep]);

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
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-body-small font-medium text-foreground truncate">
          {taskTitle || "HVAC Filter Walkthrough"}
        </h1>
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
                    <p className="text-body-small text-muted-foreground leading-relaxed">
                      💡 {msg.content}
                    </p>
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

          {/* Product Card */}
          {showProductCard && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard size={flowState.size === "custom" ? "Your size" : flowState.size} />
            </motion.div>
          )}

          {/* After product card, show closing message */}
          {showProductCard && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="max-w-[88%]"
            >
              <p className="text-body text-foreground leading-relaxed">
                You're all set with this one. Want to tackle the next task?
              </p>
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-1 py-2"
            >
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

export default HVACFilterFlow;
