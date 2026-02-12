import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mic, Send, Sparkles, ChevronRight, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  type: "system" | "user";
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  updated_at: string;
}

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

type View = "landing" | "chat" | "history";

const ChatModal = ({ open, onClose }: ChatModalProps) => {
  const [view, setView] = useState<View>("landing");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [history, setHistory] = useState<Conversation[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Load history when modal opens
  useEffect(() => {
    if (open) {
      loadHistory();
      setView("landing");
      setMessages([]);
      setConversationId(null);
    }
  }, [open]);

  const loadHistory = async () => {
    const { data } = await supabase
      .from("conversations")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false })
      .limit(20);
    if (data) setHistory(data);
  };

  const createConversation = async (firstMessage: string): Promise<string> => {
    const title = firstMessage.slice(0, 60) || "New Chat";
    const { data } = await supabase
      .from("conversations")
      .insert({ title })
      .select("id")
      .single();
    return data!.id;
  };

  const saveMessage = async (convId: string, role: "user" | "assistant", content: string) => {
    await supabase.from("messages").insert({ conversation_id: convId, role, content });
  };

  const loadConversation = async (convId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("id, role, content")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });
    if (data) {
      setMessages(
        data.map((m) => ({
          id: m.id,
          type: m.role === "user" ? "user" : "system",
          content: m.content,
        }))
      );
    }
    setConversationId(convId);
    setView("chat");
  };

  const streamAIResponse = async (convId: string, conversationHistory: { role: string; content: string }[]) => {
    setStreaming(true);
    const tempId = `temp-${Date.now()}`;
    let assistantContent = "";

    setMessages((prev) => [...prev, { id: tempId, type: "system", content: "" }]);

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
        const errorMsg = errorData.error || "Sorry, I couldn't get a response right now.";
        setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, content: errorMsg } : m)));
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
              setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, content: assistantContent } : m)));
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
          prev.map((m) => (m.id === tempId ? { ...m, content: "Sorry, something went wrong." } : m))
        );
      }
    }

    if (assistantContent) {
      await saveMessage(convId, "assistant", assistantContent);
    }
    setStreaming(false);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || streaming) return;
    setInput("");

    let convId = conversationId;
    if (!convId) {
      convId = await createConversation(text);
      setConversationId(convId);
      setView("chat");
    }

    const userMsg: Message = { id: `user-${Date.now()}`, type: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    await saveMessage(convId, "user", text);

    const historyMsgs = messages
      .filter((m) => m.content)
      .map((m) => ({ role: m.type === "user" ? "user" : "assistant", content: m.content }));
    historyMsgs.push({ role: "user", content: text });

    await streamAIResponse(convId, historyMsgs);
  };

  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setView("landing");
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
            <button
              onClick={view === "history" ? () => setView("landing") : onClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
            >
              <ArrowLeft size={22} />
            </button>
            <span className="text-body-small font-medium text-foreground">
              {view === "history" ? "Chat History" : "Primer"}
            </span>
            {view === "chat" ? (
              <button onClick={startNewChat} className="text-muted-foreground hover:text-foreground transition-colors p-1">
                <Plus size={20} />
              </button>
            ) : (
              <div className="w-8" />
            )}
          </div>

          {/* Landing View */}
          {view === "landing" && (
            <div className="flex-1 flex flex-col px-4">
              {/* Centered greeting + input */}
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
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
                  className="text-body text-muted-foreground mt-2 mb-8"
                >
                  Ask me anything about your home.
                </motion.p>

                {/* Input centered under copy */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                  className="w-full max-w-sm"
                >
                  <div className="flex items-center gap-2 bg-card rounded-full shadow-elevated px-4 py-2.5 border border-border/50">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                      placeholder="Ask about your home..."
                      className="flex-1 bg-transparent outline-none text-body text-foreground placeholder:text-muted-foreground"
                    />
                    <button className="text-muted-foreground hover:text-foreground transition-colors p-1" aria-label="Voice input">
                      <Mic size={20} />
                    </button>
                    <button
                      onClick={() => sendMessage(input)}
                      className="bg-primary text-primary-foreground rounded-full p-1.5 hover:bg-primary/90 transition-colors"
                      aria-label="Send"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Historical chats list */}
              {history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="pb-6"
                >
                  <button
                    onClick={() => setView("history")}
                    className="flex items-center justify-between w-full mb-3"
                  >
                    <span className="text-caption font-medium text-muted-foreground uppercase tracking-wider">Recent Chats</span>
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </button>
                  <div className="flex flex-col divide-y divide-border/50">
                    {history.slice(0, 3).map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => loadConversation(chat.id)}
                        className="flex items-center justify-between py-3 text-left hover:bg-card/50 transition-colors -mx-2 px-2 rounded-lg"
                      >
                        <p className="text-body-small font-medium text-foreground truncate flex-1 mr-3">{chat.title}</p>
                        <span className="text-caption text-muted-foreground flex-shrink-0">{formatDate(chat.updated_at)}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* History View */}
          {view === "history" && (
            <div className="flex-1 overflow-y-auto px-4">
              <div className="flex flex-col divide-y divide-border/50">
                {history.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => loadConversation(chat.id)}
                    className="flex items-center justify-between py-4 text-left hover:bg-card/50 transition-colors -mx-2 px-2 rounded-lg"
                  >
                    <p className="text-body-small font-medium text-foreground truncate flex-1 mr-3">{chat.title}</p>
                    <span className="text-caption text-muted-foreground flex-shrink-0">{formatDate(chat.updated_at)}</span>
                  </button>
                ))}
                {history.length === 0 && (
                  <p className="text-body text-muted-foreground text-center py-12">No chats yet</p>
                )}
              </div>
            </div>
          )}

          {/* Chat View */}
          {view === "chat" && (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-24">
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
              </div>

              {/* Chat input */}
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
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;
