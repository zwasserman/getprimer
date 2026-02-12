import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Home, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import type { HomeProfile } from "@/hooks/useHomeTasks";

interface ProfileFeature {
  key: keyof HomeProfile;
  label: string;
  description: string;
}

const features: ProfileFeature[] = [
  { key: "has_basement", label: "Basement", description: "Sump pump, moisture checks" },
  { key: "has_garage", label: "Garage", description: "Door maintenance, weatherstripping" },
  { key: "has_fireplace", label: "Fireplace", description: "Chimney sweeping, inspections" },
  { key: "has_deck", label: "Deck / Patio", description: "Staining, structural checks" },
  { key: "has_lawn", label: "Lawn / Yard", description: "Mowing, aeration, fertilizing" },
  { key: "has_sprinkler_system", label: "Sprinkler System", description: "Winterization, head checks" },
  { key: "has_central_ac", label: "Central A/C", description: "Filter changes, coil cleaning" },
  { key: "has_gas", label: "Gas Appliances", description: "Leak checks, shut-off valve" },
  { key: "has_septic", label: "Septic System", description: "Pumping, inspection schedule" },
  { key: "has_ceiling_fans", label: "Ceiling Fans", description: "Seasonal direction switch" },
  { key: "has_furnace_humidifier", label: "Furnace Humidifier", description: "Filter and pad changes" },
  { key: "has_hoa", label: "HOA", description: "Rules, CC&Rs, compliance" },
];

interface HomeProfileEditorProps {
  profile: HomeProfile | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const HomeProfileEditor = ({ profile, open, onClose, onSaved }: HomeProfileEditorProps) => {
  const [values, setValues] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      const initial: Record<string, boolean> = {};
      features.forEach((f) => {
        initial[f.key] = profile[f.key] as boolean;
      });
      setValues(initial);
    }
  }, [profile]);

  const handleToggle = (key: string) => {
    setValues((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const update: Record<string, boolean> = {};
      features.forEach((f) => {
        update[f.key] = values[f.key] ?? true;
      });

      await supabase
        .from("home_profiles")
        .update(update)
        .eq("id", profile.id);

      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
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
          <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                <Home size={16} className="text-primary" />
              </div>
              <h1 className="text-h3 text-foreground">My Home</h1>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
              <X size={22} />
            </button>
          </div>

          {/* Feature List */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <p className="text-body-small text-muted-foreground mb-5">
              Toggle features your home has. Tasks that don't apply will be hidden automatically.
            </p>

            <div className="flex flex-col">
              {features.map((feature) => (
                <div
                  key={feature.key}
                  className="flex items-center justify-between py-3.5 border-b border-border/30 last:border-0"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-body-small font-medium text-foreground">{feature.label}</p>
                    <p className="text-caption text-muted-foreground mt-0.5">{feature.description}</p>
                  </div>
                  <Switch
                    checked={values[feature.key] ?? true}
                    onCheckedChange={() => handleToggle(feature.key)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="px-4 pb-8 pt-3 bg-background border-t border-border/50">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full h-12 bg-primary text-primary-foreground rounded-full text-base font-semibold active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HomeProfileEditor;
