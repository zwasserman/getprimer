import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2 } from "lucide-react";
import { DOCUMENT_CATEGORIES, type DocumentCategory, type MockDocument } from "@/data/mockDocuments";

interface AddDocumentSheetProps {
  open: boolean;
  preselectedCategory?: DocumentCategory | null;
  onClose: () => void;
  onAdded: (doc: MockDocument) => void;
}

const AddDocumentSheet = ({ open, preselectedCategory, onClose, onAdded }: AddDocumentSheetProps) => {
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | null>(preselectedCategory || null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = () => {
    if (!selectedCategory) return;
    setUploading(true);
    // Simulate upload + AI summary
    setTimeout(() => {
      const newDoc: MockDocument = {
        id: `doc-${Date.now()}`,
        title: "Uploaded Document",
        fileName: `Document_${new Date().toLocaleDateString().replace(/\//g, "-")}.pdf`,
        category: selectedCategory,
        uploadDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        aiSummary: "We've processed your document and identified the key information. This document has been categorized and is ready for your review.",
        fileType: "application/pdf",
      };
      setUploading(false);
      onAdded(newDoc);
      onClose();
      setSelectedCategory(preselectedCategory || null);
    }, 2000);
  };

  const step = preselectedCategory ? "upload" : selectedCategory ? "upload" : "category";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-foreground/40 flex items-end justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="w-full max-w-md bg-card rounded-t-3xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-3">
              <h2 className="text-h3 text-foreground">
                {step === "category" ? "Choose Category" : uploading ? "Uploading..." : "Upload Document"}
              </h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-8">
              {step === "category" && (
                <div className="space-y-1">
                  {DOCUMENT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(cat.name)}
                      className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl text-left hover:bg-muted/50 transition-colors"
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-body-small font-medium text-foreground">{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === "upload" && (
                <div className="flex flex-col items-center py-8 gap-4">
                  {uploading ? (
                    <>
                      <Loader2 size={40} className="text-primary animate-spin" />
                      <p className="text-body-small text-muted-foreground">Uploading & generating summary...</p>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Upload size={32} className="text-primary" />
                      </div>
                      <p className="text-body-small text-muted-foreground text-center">
                        Upload a PDF for <span className="font-medium text-foreground">{selectedCategory}</span>
                      </p>
                      <button
                        onClick={handleFileSelect}
                        className="h-12 px-8 bg-primary text-primary-foreground rounded-full text-base font-semibold active:scale-[0.98] transition-all"
                      >
                        Choose File
                      </button>
                      {!preselectedCategory && (
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className="text-caption text-primary font-medium"
                        >
                          ← Change category
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddDocumentSheet;
