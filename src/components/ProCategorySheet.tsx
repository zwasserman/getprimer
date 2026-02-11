import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Mail, Star, User, Plus } from "lucide-react";
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
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-3">
                <h2 className="text-h2 text-foreground">{category}</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="overflow-y-auto px-5 pb-5 flex-1">
                <div className="flex flex-col gap-3">
                  {pros.map((pro) => (
                    <div key={pro.id} className="card-primer flex flex-col gap-2.5">
                      <div>
                        <h3 className="text-h3 text-foreground">{pro.business}</h3>
                        <p className="text-body-small text-muted-foreground">{pro.contact}</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <a href={`tel:${pro.phone}`} className="flex items-center gap-2 text-body-small text-foreground">
                          <Phone size={14} className="text-muted-foreground flex-shrink-0" />
                          {pro.phone}
                        </a>
                        <a href={`mailto:${pro.email}`} className="flex items-center gap-2 text-body-small text-foreground truncate">
                          <Mail size={14} className="text-muted-foreground flex-shrink-0" />
                          {pro.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1 border-t border-border/50">
                        {pro.referral.type === "agent" ? (
                          <>
                            <Star size={13} className="text-secondary flex-shrink-0" />
                            <span className="text-caption text-secondary">Recommended by {pro.referral.name}</span>
                          </>
                        ) : (
                          <>
                            <User size={13} className="text-muted-foreground flex-shrink-0" />
                            <span className="text-caption text-muted-foreground">Added by you</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add pro link */}
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
