import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, MessageSquare, Star, User, Plus, UserPlus } from "lucide-react";
import type { Pro, Category } from "@/data/pros";

interface ProCategorySheetProps {
  category: Category | null;
  pros: Pro[];
  open: boolean;
  onClose: () => void;
}

const ProCategorySheet = ({ category, pros, open, onClose }: ProCategorySheetProps) => {
  return (
    <AnimatePresence>
      {open && category && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/30 z-[90]"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[100] bg-card rounded-t-3xl"
            style={{ maxHeight: "70vh" }}
          >
            <div className="flex flex-col h-full max-h-[70vh]">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>
              <div className="flex items-center justify-between px-5 pb-3">
                <h2 className="text-h2 text-foreground">{category}</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>
              <div className="overflow-y-auto px-5 pb-5 flex-1">
                <div className="flex flex-col gap-3">
                  {pros.map((pro) => (
                    <div key={pro.id} className="card-primer flex flex-col gap-3">
                      <div>
                        <h3 className="text-h3 text-foreground">{pro.business}</h3>
                        <p className="text-body-small text-muted-foreground">{pro.contact}</p>
                      </div>
                      <div className="flex items-start gap-1.5">
                        {pro.referral.type === "agent" ? (
                          <>
                            <Star size={13} className="text-secondary flex-shrink-0 mt-0.5" />
                            <div className="flex flex-col">
                              <span className="text-caption text-secondary font-medium">Recommended by {pro.referral.name}</span>
                              <span className="text-caption text-muted-foreground italic">"{pro.referral.blurb}"</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <User size={13} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                            <span className="text-caption text-muted-foreground">Added by you</span>
                          </>
                        )}
                      </div>
                      <div className="flex gap-2 pt-1 border-t border-border/50">
                        <a href={`tel:${pro.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-foreground text-caption font-medium hover:bg-muted/80 transition-colors">
                          <Phone size={13} /> Call
                        </a>
                        <a href={`sms:${pro.phone}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-foreground text-caption font-medium hover:bg-muted/80 transition-colors">
                          <MessageSquare size={13} /> Text
                        </a>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-foreground text-caption font-medium hover:bg-muted/80 transition-colors">
                          <UserPlus size={13} /> Add Contact
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="flex items-center gap-1 text-primary font-medium text-body-small mt-4 mx-auto">
                  <Plus size={15} />
                  Add {category} Pro
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProCategorySheet;
