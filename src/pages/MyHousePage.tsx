import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Plus } from "lucide-react";
import { DOCUMENT_CATEGORIES, mockDocuments, type MockDocument, type DocumentCategory } from "@/data/mockDocuments";
import DocumentViewer from "@/components/DocumentViewer";
import AddDocumentSheet from "@/components/AddDocumentSheet";

const MyHousePage = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<MockDocument[]>(mockDocuments);
  const [viewingDoc, setViewingDoc] = useState<MockDocument | null>(null);
  const [addDocOpen, setAddDocOpen] = useState(false);
  const [addDocCategory, setAddDocCategory] = useState<DocumentCategory | null>(null);

  const systemsTracked = 14;

  const handleDeleteDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAddDoc = (doc: MockDocument) => {
    setDocuments((prev) => [...prev, doc]);
  };

  const openQuickAdd = (category: DocumentCategory) => {
    setAddDocCategory(category);
    setAddDocOpen(true);
  };

  const openGeneralAdd = () => {
    setAddDocCategory(null);
    setAddDocOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col min-h-screen px-4 pt-14 pb-32 lg:pt-8 lg:pb-8 lg:px-8"
    >
      {/* Page title */}
      <h1 className="text-h2 text-foreground mb-5">My House</h1>

      {/* Home Profile Card */}
      <button
        onClick={() => navigate("/my-house/profile")}
        className="card-primer w-full text-left mb-6 active:scale-[0.98] transition-all"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-lg">🏠</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-h3 text-foreground">1234 Elm Street</h2>
            <p className="text-body-small text-muted-foreground">Yardley, PA 19067</p>
            <p className="text-caption text-muted-foreground mt-2">
              Built 1972 • 2,400 sqft • Colonial
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
          <p className="text-body-small text-foreground font-medium">{systemsTracked} systems tracked</p>
          <ChevronRight size={18} className="text-muted-foreground" />
        </div>
      </button>

      {/* Documents Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h2 text-foreground">Documents</h2>
          <button
            onClick={openGeneralAdd}
            className="flex items-center gap-1 text-body-small font-medium text-primary"
          >
            <Plus size={16} />
            Add Document
          </button>
        </div>

        <div className="space-y-4">
          {DOCUMENT_CATEGORIES.map((cat) => {
            const catDocs = documents.filter((d) => d.category === cat.name);
            const hasDocuments = catDocs.length > 0;

            return (
              <div key={cat.name} className="card-primer">
                {/* Category header */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{cat.icon}</span>
                  <h3 className="text-body-small font-semibold text-foreground">{cat.name}</h3>
                </div>

                {hasDocuments ? (
                  <>
                    <div className="space-y-2">
                      {catDocs.map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => setViewingDoc(doc)}
                          className="w-full text-left bg-background rounded-xl p-3 border border-border/40 active:scale-[0.98] transition-all"
                        >
                          <p className="text-body-small font-medium text-foreground">{doc.fileName}</p>
                          <p className="text-caption text-muted-foreground mt-1 line-clamp-2">
                            {doc.aiSummary.slice(0, 120)}...
                          </p>
                          <p className="text-caption text-muted-foreground mt-1.5">{doc.uploadDate}</p>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => openQuickAdd(cat.name)}
                      className="flex items-center gap-1 mt-3 text-caption font-medium text-primary mx-auto"
                    >
                      <Plus size={14} />
                      Quick Add
                    </button>
                  </>
                ) : (
                  <div className="text-center py-3">
                    <p className="text-caption text-muted-foreground mb-1">No document yet</p>
                    <p className="text-caption text-muted-foreground mb-3">{cat.emptyPrompt}</p>
                    <button
                      onClick={() => openQuickAdd(cat.name)}
                      className="flex items-center gap-1 text-caption font-medium text-primary mx-auto"
                    >
                      <Plus size={14} />
                      Add
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Document Viewer */}
      <DocumentViewer
        document={viewingDoc}
        open={!!viewingDoc}
        onClose={() => setViewingDoc(null)}
        onDelete={handleDeleteDoc}
      />

      {/* Add Document Sheet */}
      <AddDocumentSheet
        open={addDocOpen}
        preselectedCategory={addDocCategory}
        onClose={() => {
          setAddDocOpen(false);
          setAddDocCategory(null);
        }}
        onAdded={handleAddDoc}
      />
    </motion.div>
  );
};

export default MyHousePage;
