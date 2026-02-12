import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageSquare, UserPlus, Star, User, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadVCard } from "@/lib/vcard";
import ProDetailSheet from "@/components/ProDetailSheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { mockPros, categories, categoryIcons, type Pro, type Category } from "@/data/pros";

const filters = ["All", ...categories];

/* ─── Add-Pro Modal ─── */

function AddProModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [category, setCategory] = useState("");

  return (
    <AnimatePresence>
      {open && (
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
            className="fixed bottom-0 left-0 right-0 z-[100] bg-card rounded-t-3xl max-h-[90vh] overflow-y-auto"
          >
            <div className="px-5 pt-5 pb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-h2 text-foreground">Add a Pro</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="business" className="text-body-small font-medium text-foreground mb-1.5 block">Business name *</Label>
                  <Input id="business" placeholder="e.g. ABC Plumbing" required className="bg-background" />
                </div>
                <div>
                  <Label htmlFor="contactName" className="text-body-small font-medium text-foreground mb-1.5 block">Contact name</Label>
                  <Input id="contactName" placeholder="e.g. John Smith" className="bg-background" />
                </div>
                <div>
                  <Label className="text-body-small font-medium text-foreground mb-1.5 block">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-card z-[110]">
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone" className="text-body-small font-medium text-foreground mb-1.5 block">Phone number</Label>
                  <Input id="phone" type="tel" placeholder="(215) 555-0000" className="bg-background" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-body-small font-medium text-foreground mb-1.5 block">Email</Label>
                  <Input id="email" type="email" placeholder="name@business.com" className="bg-background" />
                </div>
                <Button type="submit" className="w-full mt-2" size="lg">Save</Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Pro Card ─── */

function ProCard({ pro, onSelect }: { pro: Pro; onSelect: (pro: Pro) => void }) {
  return (
    <button onClick={() => onSelect(pro)} className="text-left card-primer flex flex-col gap-3 hover:bg-muted/50 transition-colors">
      <div>
        <h3 className="text-h3 text-foreground">{pro.business}</h3>
        <p className="text-body-small text-muted-foreground">{pro.contact}</p>
      </div>

      {/* Referral blurb or user badge */}
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

      {/* Quick action buttons */}
      <div className="flex gap-2 pt-1 border-t border-border/50">
        <a
          onClick={(e) => e.stopPropagation()}
          href={`tel:${pro.phone}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-foreground text-caption font-medium hover:bg-muted/80 transition-colors"
        >
          <Phone size={13} /> Call
        </a>
        <a
          onClick={(e) => e.stopPropagation()}
          href={`sms:${pro.phone}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-foreground text-caption font-medium hover:bg-muted/80 transition-colors"
        >
          <MessageSquare size={13} /> Text
        </a>
        <button
          onClick={(e) => {
            e.stopPropagation();
            downloadVCard({ name: pro.contact, business: pro.business, phone: pro.phone, email: pro.email });
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-foreground text-caption font-medium hover:bg-muted/80 transition-colors"
        >
          <UserPlus size={13} /> Add Contact
        </button>
      </div>
    </button>
  );
}

/* ─── Page ─── */

const ProsPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [addOpen, setAddOpen] = useState(false);
  const [selectedPro, setSelectedPro] = useState<Pro | null>(null);

  const filtered = activeFilter === "All"
    ? mockPros
    : mockPros.filter((p) => p.category === activeFilter);

  const grouped = categories
    .map((cat) => ({ cat, pros: filtered.filter((p) => p.category === cat) }))
    .filter((g) => g.pros.length > 0);

  return (
    <div className="flex flex-col min-h-screen px-4 pt-14 pb-32">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h1 text-foreground">Your Pros</h1>
        <Button variant="ghost" size="sm" className="text-primary font-semibold" onClick={() => setAddOpen(true)}>
          <Plus size={16} className="mr-1" /> Add Pro
        </Button>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto -mx-4 px-4 scrollbar-hide">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "chip"}
            size="chip"
            onClick={() => setActiveFilter(filter)}
            className="flex-shrink-0"
          >
            {filter}
          </Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-body text-muted-foreground mb-1">
            {activeFilter === "All"
              ? "No pros yet. Your agent may add some, or you can add your own."
              : `No ${activeFilter} pros yet`}
          </p>
          <button onClick={() => setAddOpen(true)} className="text-primary font-medium text-body-small mt-2">
            + Add {activeFilter === "All" ? "Pro" : "one"}
          </button>
        </div>
      ) : activeFilter !== "All" ? (
        <div className="flex flex-col gap-3">
          {filtered.map((pro) => (
            <ProCard key={pro.id} pro={pro} onSelect={setSelectedPro} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {grouped.map(({ cat, pros }) => {
            const Icon = categoryIcons[cat];
            return (
              <section key={cat}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={18} className="text-secondary" />
                  <h2 className="text-h3 text-foreground">{cat}</h2>
                </div>
                <div className="flex flex-col gap-3">
                  {pros.map((pro) => (
                    <ProCard key={pro.id} pro={pro} onSelect={setSelectedPro} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <AddProModal open={addOpen} onClose={() => setAddOpen(false)} />
      <ProDetailSheet pro={selectedPro} open={!!selectedPro} onClose={() => setSelectedPro(null)} />
    </div>
  );
};

export default ProsPage;
