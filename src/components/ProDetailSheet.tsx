import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, MessageSquare, Mail, UserPlus, Share2, Trash2 } from "lucide-react";
import type { Pro } from "@/data/pros";
import { downloadVCard } from "@/lib/vcard";
import { toast } from "sonner";

interface ProDetailSheetProps {
  pro: Pro | null;
  open: boolean;
  onClose: () => void;
  onRemove?: (proId: number) => void;
}

const ProDetailSheet = ({ pro, open, onClose, onRemove }: ProDetailSheetProps) => {
  const [confirmRemove, setConfirmRemove] = useState(false);

  if (!pro) return null;

  const handleShare = async () => {
    const shareText = `${pro.business}\n${pro.contact}\n📞 ${pro.phone}\n✉️ ${pro.email}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: pro.business, text: shareText });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success("Pro info copied to clipboard");
    }
  };

  const handleRemove = () => {
    if (!confirmRemove) {
      setConfirmRemove(true);
      return;
    }
    onRemove?.(pro.id);
    setConfirmRemove(false);
    onClose();
    toast.success(`${pro.business} removed`);
  };

  const handleClose = () => {
    setConfirmRemove(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && pro && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/30 z-[90]"
            onClick={handleClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[100] bg-card rounded-t-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="px-5 pt-5 pb-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-h2 text-foreground">{pro.business}</h2>
                  <p className="text-body-small text-muted-foreground mt-1">{pro.contact}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={handleShare} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Share2 size={16} className="text-muted-foreground" />
                  </button>
                  <button onClick={handleClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <X size={18} className="text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-muted rounded-2xl p-4 mb-6">
                <h3 className="text-body font-semibold text-foreground mb-3">Contact Info</h3>
                <div className="flex flex-col gap-3">
                  <a href={`tel:${pro.phone}`} className="flex items-center gap-3 text-body-small text-foreground">
                    <Phone size={16} className="text-secondary flex-shrink-0" />
                    <span>{pro.phone}</span>
                  </a>
                  <a href={`mailto:${pro.email}`} className="flex items-center gap-3 text-body-small text-foreground">
                    <Mail size={16} className="text-secondary flex-shrink-0" />
                    <span className="break-all">{pro.email}</span>
                  </a>
                </div>
              </div>

              {/* Notes */}
              {pro.notes && (
                <div className="mb-6">
                  <h3 className="text-body font-semibold text-foreground mb-2">Notes</h3>
                  <p className="text-body-small text-muted-foreground">{pro.notes}</p>
                </div>
              )}

              {/* Referral Info */}
              <div className="mb-6">
                <h3 className="text-body font-semibold text-foreground mb-2">Referral</h3>
                {pro.referral.type === "agent" ? (
                  <div className="bg-secondary/10 rounded-2xl p-4 border border-secondary/20">
                    <p className="text-caption font-medium text-secondary mb-1">Recommended by {pro.referral.name}</p>
                    <p className="text-caption text-foreground italic">"{pro.referral.blurb}"</p>
                  </div>
                ) : (
                  <p className="text-caption text-muted-foreground">Added by you</p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 flex-wrap mb-4">
                <a
                  href={`tel:${pro.phone}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-body-small font-medium hover:bg-primary/90 transition-colors flex-1 justify-center"
                >
                  <Phone size={14} /> Call
                </a>
                <a
                  href={`sms:${pro.phone}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-body-small font-medium hover:bg-secondary/80 transition-colors flex-1 justify-center"
                >
                  <MessageSquare size={14} /> Text
                </a>
                <button
                  onClick={() => downloadVCard({ name: pro.contact, business: pro.business, phone: pro.phone, email: pro.email })}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted text-foreground text-body-small font-medium hover:bg-muted/80 transition-colors flex-1 justify-center"
                >
                  <UserPlus size={14} /> Add Contact
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={handleRemove}
                className={`flex items-center gap-1.5 justify-center w-full py-2.5 rounded-full text-body-small font-medium transition-colors ${
                  confirmRemove
                    ? "bg-destructive text-destructive-foreground"
                    : "text-destructive hover:bg-destructive/10"
                }`}
              >
                <Trash2 size={14} />
                {confirmRemove ? "Tap again to confirm" : "Remove Pro"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProDetailSheet;
