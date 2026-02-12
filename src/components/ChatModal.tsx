import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mic, Send, Flame, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";

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

const initialMessages: Message[] = [
  {
    id: 1,
    type: "system",
    content: "Here's your first simple task:"
  },
  {
    id: 2,
    type: "task-card",
    content: "",
    task: {
      title: "Replace Your HVAC Filter",
      category: "HVAC",
      difficulty: "Easy",
      why: "A clean filter improves air quality and keeps your system running efficiently. Most filters should be replaced every 1-3 months."
    }
  }
];

const actionChips = [
  { label: "I've done this", id: "done" },
  { label: "Walk me through it", id: "walkthrough" },
  { label: "Remind me later", id: "remind" },
  { label: "Skip for now", id: "skip" },
];

const chipResponses: Record<string, Message[]> = {
  done: [
    { id: 0, type: "system", content: "Nice work! 🎉 Replacing your HVAC filter is one of the most impactful things you can do for your home." },
    { id: 0, type: "system", content: "I've marked that as complete. Here's your next task:" },
    {
      id: 0, type: "task-card", content: "",
      task: {
        title: "Test Your Smoke Detectors",
        category: "Safety",
        difficulty: "Easy",
        why: "Smoke detectors save lives — but only if they work. Press the test button on each one to make sure they're functioning properly.",
      },
    },
  ],
  walkthrough: [
    { id: 0, type: "system", content: "Great choice! Let's do this step by step 👇" },
    { id: 0, type: "walkthrough-step", stepIndex: 1, totalSteps: 4, content: "**Step 1:** Find your HVAC unit — it's usually in a utility closet, basement, or attic. Look for a large metal box with ducts coming out of it." },
    { id: 0, type: "walkthrough-step", stepIndex: 2, totalSteps: 4, content: "**Step 2:** Locate the filter slot. It's typically on the side or bottom of the unit, behind a small cover or along a track." },
    { id: 0, type: "walkthrough-step", stepIndex: 3, totalSteps: 4, content: "**Step 3:** Slide the old filter out. Note the size printed on the frame (e.g., 16x25x1) and the arrow showing airflow direction." },
    { id: 0, type: "walkthrough-step", stepIndex: 4, totalSteps: 4, content: "**Step 4:** Slide in the new filter with the arrow pointing toward the unit. Close the cover." },
    { id: 0, type: "system", content: "That's it! 🎉 The whole thing takes about 2 minutes. Let me know when you're done ✓" },
  ],
  remind: [
    { id: 0, type: "system", content: "No problem! I'll remind you about this in 3 days. 📅" },
    { id: 0, type: "system", content: "In the meantime, here's something even quicker:" },
    {
      id: 0, type: "task-card", content: "",
      task: {
        title: "Check Your Water Heater Temperature",
        category: "Plumbing",
        difficulty: "Easy",
        why: "Most water heaters are set too high from the factory. Setting it to 120°F saves energy and prevents scalding.",
      },
    },
  ],
  skip: [
    { id: 0, type: "system", content: "Skipped for now — no worries, we'll come back to it later." },
    { id: 0, type: "system", content: "Here's another task you might want to tackle:" },
    {
      id: 0, type: "task-card", content: "",
      task: {
        title: "Locate Your Main Water Shut-Off",
        category: "Plumbing",
        difficulty: "Easy",
        why: "In a plumbing emergency, you need to know where this is fast. It's usually near the water meter or where the main line enters your home.",
      },
    },
  ],
};

const walkthroughSteps = chipResponses.walkthrough;

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
}

const ChatModal = ({ open, onClose }: ChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [walkthroughQueue, setWalkthroughQueue] = useState<Message[]>([]);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

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
    const intro = walkthroughSteps[0];
    const firstStep = walkthroughSteps[1];
    const remaining = walkthroughSteps.slice(2);
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

  const streamAIResponse = async (conversationHistory: { role: string; content: string }[]) => {
    setStreaming(true);
    const assistantMsgId = Date.now() + 1;
    let assistantContent = "";

    // Add empty assistant message
    setMessages((prev) => [...prev, { id: assistantMsgId, type: "system", content: "" }]);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: conversationHistory }),
      });

      if (!resp.ok || !resp.body) {
        const errorData = await resp.json().catch(() => ({}));
        const errorMsg = errorData.error || "Sorry, I couldn't get a response right now. Try again in a moment.";
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? { ...m, content: errorMsg } : m))
        );
        setStreaming(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantMsgId ? { ...m, content: assistantContent } : m))
              );
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error("Stream error:", e);
      if (!assistantContent) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: "Sorry, something went wrong. Please try again." }
              : m
          )
        );
      }
    }

    setStreaming(false);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || typing || streaming) return;
    const userMsg: Message = { id: Date.now(), type: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Build conversation history from user/system messages for AI context
    const history = messages
      .filter((m) => m.type === "user" || m.type === "system")
      .map((m) => ({
        role: m.type === "user" ? "user" : "assistant",
        content: m.content,
      }));
    history.push({ role: "user", content: text });

    await streamAIResponse(history);
  };

  const handleChip = (id: string) => {
    if (typing || streaming) return;
    const chip = actionChips.find((c) => c.id === id);
    if (!chip) return;
    setMessages((prev) => [...prev, { id: Date.now(), type: "user", content: chip.label }]);
    if (id === "walkthrough") {
      handleWalkthrough();
    } else {
      const responses = chipResponses[id];
      if (responses) addResponsesSequentially(responses);
    }
  };

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
            <h1 className="text-h3 text-foreground">Welcome Home, Zach!</h1>
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
                        <p className="text-body-small text-foreground whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  )}

                  {msg.type === "walkthrough-step" && msg.stepIndex != null && (
                    <div className="bg-card rounded-2xl p-4 max-w-[90%] border border-border/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-caption text-muted-foreground">Step {msg.stepIndex} of {msg.totalSteps}</span>
                      </div>
                      <p className="text-body text-foreground mb-3">{msg.content.replace(/\*\*Step \d:\*\* /, '')}</p>
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
                            <Flame size={16} className="text-secondary" />
                          </div>
                          <StatusBadge status="due" />
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
              {streaming && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-caption">Thinking...</span>
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="px-4 pb-4 pt-2 bg-background">
            <div className="flex items-center gap-2 bg-card rounded-full shadow-elevated px-4 py-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask a question..."
                disabled={streaming}
                className="flex-1 bg-transparent outline-none text-body text-foreground placeholder:text-muted-foreground disabled:opacity-50"
              />
              <button className="text-muted-foreground hover:text-foreground transition-colors p-1" aria-label="Voice input">
                <Mic size={20} />
              </button>
              <button
                onClick={() => sendMessage(input)}
                disabled={streaming}
                className="text-primary hover:text-primary/80 transition-colors p-1 disabled:opacity-50"
                aria-label="Send"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;
