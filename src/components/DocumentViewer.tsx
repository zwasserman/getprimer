import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, MessageCircle, Trash2, Send } from "lucide-react";
import type { MockDocument } from "@/data/mockDocuments";

interface DocumentViewerProps {
  document: MockDocument | null;
  open: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

const mockResponses: Record<string, string> = {
  default:
    "Based on your document, I'd recommend reviewing the key items flagged and addressing them in order of priority. Would you like me to create tasks for any of these?",
};

const DocumentViewer = ({ document: doc, open, onClose, onDelete }: DocumentViewerProps) => {
  const [question, setQuestion] = useState("");
  const [qa, setQa] = useState<{ q: string; a: string }[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleAsk = () => {
    if (!question.trim()) return;
    const q = question.trim();
    setQuestion("");
    const a =
      q.toLowerCase().includes("urgent")
        ? "Based on your inspection report, the most time-sensitive items are: the HVAC system is 15+ years old and should be evaluated by a technician before next winter, and the grading on the south side should be addressed before heavy rains to prevent water intrusion."
        : mockResponses.default;
    setQa((prev) => [...prev, { q, a }]);
  };

  const handleDelete = () => {
    if (doc) {
      onDelete(doc.id);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  if (!doc) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="fixed inset-0 z-[100] bg-background flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-border/50">
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
              <X size={22} />
            </button>
            <span className="text-body-small font-medium text-foreground">Document</span>
            <div className="w-8" />
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
            {/* Document header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText size={18} className="text-primary" />
                <h2 className="text-h3 text-foreground">{doc.fileName}</h2>
              </div>
              <p className="text-caption text-muted-foreground">{doc.category} • {doc.uploadDate}</p>
            </div>

            {/* AI Summary */}
            <div className="card-primer">
              <p className="text-caption font-semibold text-foreground mb-2">AI Summary</p>
              <p className="text-body-small text-muted-foreground leading-relaxed">{doc.aiSummary}</p>
            </div>

            {/* View Full Document */}
            <button className="w-full h-12 bg-primary text-primary-foreground rounded-full text-base font-semibold active:scale-[0.98] transition-all">
              View Full Document
            </button>

            {/* Ask about document */}
            <div className="card-primer">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle size={16} className="text-primary" />
                <p className="text-body-small font-semibold text-foreground">Ask about this document</p>
              </div>
              <p className="text-caption text-muted-foreground italic mb-3">
                "What are the most urgent items in my inspection?"
              </p>

              {/* Q&A */}
              {qa.map((item, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-end mb-2">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-3 py-2 max-w-[80%]">
                      <p className="text-body-small">{item.q}</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-card border border-border rounded-2xl rounded-tl-md px-3 py-2 max-w-[85%]">
                      <p className="text-body-small text-foreground">{item.a}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Input */}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                  placeholder="Ask a question..."
                  className="flex-1 h-11 rounded-full border border-border bg-background px-4 text-body-small text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={handleAsk}
                  disabled={!question.trim()}
                  className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 active:scale-95 transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>

            {/* Delete */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 text-destructive text-body-small font-medium"
            >
              <Trash2 size={16} />
              Delete Document
            </button>
          </div>

          {/* Delete confirmation */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[110] bg-foreground/40 flex items-end justify-center"
              >
                <motion.div
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  exit={{ y: 100 }}
                  className="w-full max-w-md bg-card rounded-t-3xl p-6 space-y-4"
                >
                  <h3 className="text-h3 text-foreground">Delete this document?</h3>
                  <p className="text-body-small text-muted-foreground">This can't be undone.</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 h-12 rounded-full border border-border text-foreground font-semibold active:scale-[0.98] transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 h-12 rounded-full bg-destructive text-destructive-foreground font-semibold active:scale-[0.98] transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DocumentViewer;
