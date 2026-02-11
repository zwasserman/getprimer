import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Send, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";

interface Message {
  id: number;
  type: "system" | "user" | "task-card";
  content: string;
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
}];


const actionChips = [
  { label: "I've done this ✓", id: "done" },
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
    { id: 0, type: "system", content: "**Step 1:** Find your HVAC unit — it's usually in a utility closet, basement, or attic. Look for a large metal box with ducts coming out of it." },
    { id: 0, type: "system", content: "**Step 2:** Locate the filter slot. It's typically on the side or bottom of the unit, behind a small cover or along a track." },
    { id: 0, type: "system", content: "**Step 3:** Slide the old filter out. Note the size printed on the frame (e.g., 16x25x1) and the arrow showing airflow direction." },
    { id: 0, type: "system", content: "**Step 4:** Slide in the new filter with the arrow pointing toward the unit. Close the cover." },
    { id: 0, type: "system", content: "That's it! The whole thing takes about 2 minutes. Let me know when you're done ✓" },
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

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
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

  const sendMessage = (text: string) => {
    if (!text.trim() || typing) return;
    setMessages((prev) => [...prev, { id: Date.now(), type: "user", content: text }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, type: "system", content: "Thanks for letting me know! I'll keep that in mind as we work through your home tasks together." },
      ]);
    }, 800);
  };

  const handleChip = (id: string) => {
    if (typing) return;
    const chip = actionChips.find((c) => c.id === id);
    if (!chip) return;
    setMessages((prev) => [...prev, { id: Date.now(), type: "user", content: chip.label }]);
    const responses = chipResponses[id];
    if (responses) addResponsesSequentially(responses);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="px-4 pt-14 pb-3">
        <h1 className="text-h1 text-foreground">Welcome Home,Zach! </h1>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-36">
        <div className="flex flex-col gap-4">
          {messages.map((msg, i) =>
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}>

              {msg.type === "system" &&
            <p className="text-body text-foreground max-w-[90%]">{msg.content}</p>
            }

              {msg.type === "user" &&
            <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]">
                    <p className="text-body-small">{msg.content}</p>
                  </div>
                </div>
            }

              {msg.type === "task-card" && msg.task &&
            <div className="flex flex-col gap-3">
                  <div className="card-primer">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Flame size={16} className="text-secondary" />
                      </div>
                      <StatusBadge status="new" />
                      <span className="text-caption text-muted-foreground ml-auto">{msg.task.difficulty}</span>
                    </div>
                    <h2 className="text-h2 text-foreground mb-2">{msg.task.title}</h2>
                    <p className="text-body-small text-muted-foreground">{msg.task.why}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {actionChips.map((chip) =>
                <Button
                  key={chip.id}
                  variant="chip"
                  size="chip"
                  onClick={() => handleChip(chip.id)}>

                        {chip.label}
                      </Button>
                )}
                  </div>
                </div>
            }
            </motion.div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="fixed bottom-24 left-0 right-0 px-4 pb-2">
        <div className="flex items-center gap-2 bg-card rounded-full shadow-elevated px-4 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask a question..."
            className="flex-1 bg-transparent outline-none text-body text-foreground placeholder:text-muted-foreground" />

          <button
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Voice input">

            <Mic size={20} />
          </button>
          <button
            onClick={() => sendMessage(input)}
            className="text-primary hover:text-primary/80 transition-colors p-1"
            aria-label="Send">

            <Send size={20} />
          </button>
        </div>
      </div>
    </div>);

};

export default ChatPage;