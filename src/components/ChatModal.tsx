import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mic, Send, Plus, Sparkles, MessageSquare, X } from "lucide-react";
import { Loader2 } from "lucide-react";

interface Message {
  id: number;
  type: "system" | "user";
  content: string;
}

interface HistoricalChat {
  id: string;
  title: string;
  preview: string;
  date: string;
}

const mockHistory: HistoricalChat[] = [
  { id: "1", title: "HVAC Filter Help", preview: "How to replace my furnace filter", date: "Feb 8" },
  { id: "2", title: "Water Heater Settings", preview: "Adjusting temperature to 120°F", date: "Feb 5" },
  { id: "3", title: "Smoke Detector Check", preview: "Testing all detectors upstairs", date: "Jan 30" },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good evening";
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
}

const ChatModal = ({ open, onClose }: ChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setMessages([]);
      setShowHistory(false);
    }
  }, [open]);

  const streamAIResponse = async (conversationHistory: { role: string; content: string }[]) => {
    setStreaming(true);
    const assistantMsgId = Date.now() + 1;
    let assistantContent = "";

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
    if (!text.trim() || streaming) return;
    const userMsg: Message = { id: Date.now(), type: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const history = messages
      .filter((m) => m.type === "user" || m.type === "system")
      .map((m) => ({
        role: m.type === "user" ? "user" : "assistant",
        content: m.content,
      }));
    history.push({ role: "user", content: text });

    await streamAIResponse(history);
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
          <div className="flex items-center justify-between px-4 pt-5 pb-3">
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
              <ArrowLeft size={22} />
            </button>
            <span className="text-body-small font-medium text-foreground">Primer</span>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <MessageSquare size={20} />
            </button>
          </div>

          {/* History Drawer */}
          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-b border-border/50"
              >
                <div className="px-4 pb-3">
                  <p className="text-caption text-muted-foreground mb-2 font-medium">Recent Chats</p>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {mockHistory.map((chat) => (
                      <button
                        key={chat.id}
                        className="flex-shrink-0 bg-card rounded-xl border border-border/50 p-3 text-left w-44 hover:border-primary/30 transition-colors"
                      >
                        <p className="text-body-small font-medium text-foreground truncate">{chat.title}</p>
                        <p className="text-caption text-muted-foreground truncate mt-0.5">{chat.preview}</p>
                        <p className="text-caption text-muted-foreground/60 mt-1">{chat.date}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-24">
            {!hasMessages ? (
              /* Landing State */
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                >
                  <Sparkles size={36} className="text-primary mb-5" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="text-h1 text-foreground"
                >
                  {getGreeting()}!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  className="text-body text-muted-foreground mt-2"
                >
                  Ask me anything about your home.
                </motion.p>
              </div>
            ) : (
              /* Messages */
              <div className="flex flex-col gap-4 pt-2">
                {messages.map((msg, i) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    {msg.type === "system" && (
                      <div className="flex justify-start">
                        <div className="bg-card rounded-2xl rounded-bl-md px-4 py-3 max-w-[80%] shadow-card border border-border/50">
                          <p className="text-body-small text-foreground whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                    )}
                    {msg.type === "user" && (
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]">
                          <p className="text-body-small">{msg.content}</p>
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
            )}
          </div>

          {/* Input */}
          <div className="px-4 pb-4 pt-2 bg-background">
            <div className="flex items-center gap-2 bg-card rounded-full shadow-elevated px-4 py-2 border border-border/50">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask about your home..."
                disabled={streaming}
                className="flex-1 bg-transparent outline-none text-body text-foreground placeholder:text-muted-foreground disabled:opacity-50"
              />
              <button className="text-muted-foreground hover:text-foreground transition-colors p-1" aria-label="Voice input">
                <Mic size={20} />
              </button>
              <button
                onClick={() => sendMessage(input)}
                disabled={streaming}
                className="bg-primary text-primary-foreground rounded-full p-1.5 hover:bg-primary/90 transition-colors disabled:opacity-50"
                aria-label="Send"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;
