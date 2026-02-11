import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets, Flame, Zap, Wrench, TreePine, Home, Bug, Settings,
  Phone, Mail, Star, User, Plus, X, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

/* ─── Types ─── */

interface Pro {
  id: number;
  business: string;
  contact: string;
  category: Category;
  phone: string;
  email: string;
  referral: { type: "agent"; name: string } | { type: "user" };
}

type Category =
  | "Plumbing"
  | "HVAC"
  | "Electrical"
  | "Handyman"
  | "Landscaping"
  | "Roofing"
  | "Pest Control"
  | "Appliance Repair";

/* ─── Data ─── */

const categories: Category[] = [
  "Plumbing", "HVAC", "Electrical", "Handyman",
  "Landscaping", "Roofing", "Pest Control", "Appliance Repair",
];

const filters = ["All", ...categories];

const categoryIcons: Record<Category, typeof Flame> = {
  Plumbing: Droplets,
  HVAC: Flame,
  Electrical: Zap,
  Handyman: Wrench,
  Landscaping: TreePine,
  Roofing: Home,
  "Pest Control": Bug,
  "Appliance Repair": Settings,
};

const mockPros: Pro[] = [
  { id: 1, business: "Dave's Plumbing & Drain", contact: "Dave Kowalski", category: "Plumbing", phone: "(215) 555-0142", email: "dave@davesplumbing.com", referral: { type: "agent", name: "Mira Downs" } },
  { id: 2, business: "Bucks County Plumbing", contact: "Tom Reilly", category: "Plumbing", phone: "(215) 555-0283", email: "info@bucksplumbing.com", referral: { type: "user" } },
  { id: 3, business: "Comfort First Heating & Cooling", contact: "Maria Santos", category: "HVAC", phone: "(215) 555-0367", email: "service@comfortfirsthvac.com", referral: { type: "agent", name: "Mira Downs" } },
  { id: 4, business: "Bright Side Electric", contact: "James Park", category: "Electrical", phone: "(215) 555-0198", email: "james@brightsideelectric.com", referral: { type: "agent", name: "Mira Downs" } },
  { id: 5, business: "PowerPro Electrical Services", contact: "Mike Chen", category: "Electrical", phone: "(215) 555-0451", email: "mike@powerproelectric.com", referral: { type: "user" } },
  { id: 6, business: "Yardley Home Services", contact: "Rob Brennan", category: "Handyman", phone: "(215) 555-0529", email: "rob@yardleyhomeservices.com", referral: { type: "agent", name: "Mira Downs" } },
  { id: 7, business: "Green Valley Landscaping", contact: "Carlos Rivera", category: "Landscaping", phone: "(215) 555-0614", email: "carlos@greenvalleylandscape.com", referral: { type: "user" } },
];

/* ─── Add-Pro Modal ─── */

function AddProModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [category, setCategory] = useState("");

  if (!open) return null;

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
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-h2 text-foreground">Add a Pro</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>

              {/* Form */}
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

function ProCard({ pro }: { pro: Pro }) {
  return (
    <div className="card-primer flex flex-col gap-2.5">
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
  );
}

/* ─── Page ─── */

const ProsPage = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = activeFilter === "All"
    ? mockPros
    : mockPros.filter((p) => p.category === activeFilter);

  // Group by category for "All" view
  const grouped = categories
    .map((cat) => ({ cat, pros: filtered.filter((p) => p.category === cat) }))
    .filter((g) => g.pros.length > 0);

  return (
    <div className="flex flex-col min-h-screen px-4 pt-14 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h1 text-foreground">Your Pros</h1>
        <Button variant="ghost" size="sm" className="text-primary font-semibold" onClick={() => setAddOpen(true)}>
          <Plus size={16} className="mr-1" /> Add Pro
        </Button>
      </div>

      {/* Filter pills */}
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

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-body text-muted-foreground mb-1">
            {activeFilter === "All"
              ? "No pros yet. Your agent may add some, or you can add your own."
              : `No ${activeFilter} pros yet`}
          </p>
          <button
            onClick={() => setAddOpen(true)}
            className="text-primary font-medium text-body-small mt-2"
          >
            + Add {activeFilter === "All" ? "Pro" : "one"}
          </button>
        </div>
      ) : activeFilter !== "All" ? (
        /* Single category — flat list, no headlines */
        <div className="flex flex-col gap-3">
          {filtered.map((pro) => (
            <ProCard key={pro.id} pro={pro} />
          ))}
        </div>
      ) : (
        /* "All" — grouped by category */
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
                    <ProCard key={pro.id} pro={pro} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <AddProModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
};

export default ProsPage;
