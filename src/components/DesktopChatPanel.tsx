import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, Send, Sparkles, Loader2, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  type: "system" | "user";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

interface DesktopChatPanelProps {
  visible: boolean;
}

const DesktopChatPanel = ({ visible }: DesktopChatPanelProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const createConversation = async (firstMessage: string): Promise<string> => {
    const title = firstMessage.slice(0, 60) || "New Chat";
    const { data } = await supabase.from("conversations").insert({ title }).select("id").single();
    return data!.id;
  };

  const saveMessage = async (convId: string, role: "user" | "assistant", content: string) => {
    await supabase.from("messages").insert({ conversation_id: convId, role, content });
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
        setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, content: "Sorry, something went wrong." } : m)));
      }
    }

    if (assistantContent) await saveMessage(convId, "assistant", assistantContent);
    setStreaming(false);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || streaming) return;
    setInput("");

    let convId = conversationId;
    if (!convId) {
      convId = await createConversation(text);
      setConversationId(convId);
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

  if (!visible) return null;

  // Collapsed state — floating bubble
  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-elevated flex items-center justify-center hover:bg-primary/90 transition-colors"
        aria-label="Open chat"
      >
        <MessageCircle size={22} />
      </button>
    );
  }

  return (
    <aside className="hidden lg:flex flex-col w-[360px] h-screen bg-background border-l border-border/50 flex-shrink-0 sticky top-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-border/30">
        <div className="flex items-center gap-2">
          <MessageCircle size={18} className="text-primary" />
          <span className="text-body-small font-semibold text-foreground">Chat</span>
        </div>
        <button
          onClick={() => setCollapsed(true)}
          className="text-muted-foreground hover:text-foreground p-1 transition-colors"
          aria-label="Close chat panel"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Sparkles size={28} className="text-primary mb-3" />
            <p className="text-body-small font-semibold text-foreground mb-1">Ask Primer</p>
            <p className="text-caption text-muted-foreground mb-4">Ask anything about your home</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["What's due this week?", "Help me winterize", "DIY vs. call a pro?"].map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="px-3 py-1.5 rounded-full border border-border bg-card text-caption font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.type === "system" && (
                  <div className="flex justify-start">
                    <div className="bg-card rounded-2xl rounded-bl-md px-3 py-2.5 max-w-[85%] shadow-card border border-border/50">
                      <p className="text-body-small text-foreground whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                )}
                {msg.type === "user" && (
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-3 py-2.5 max-w-[85%]">
                      <p className="text-body-small">{msg.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {streaming && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-caption">Thinking...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-border/30">
        <div className="flex items-center gap-2 bg-card rounded-full shadow-card px-3 py-2 border border-border/50">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask a question..."
            disabled={streaming}
            className="flex-1 bg-transparent outline-none text-body-small text-foreground placeholder:text-muted-foreground disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={streaming}
            className="bg-primary text-primary-foreground rounded-full p-1.5 hover:bg-primary/90 transition-colors disabled:opacity-50"
            aria-label="Send"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DesktopChatPanel;
