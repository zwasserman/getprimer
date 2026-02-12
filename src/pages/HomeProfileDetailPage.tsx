import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, X, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockHomeSystems } from "@/data/mockDocuments";

const mockProfile = {
  address: "1234 Elm Street",
  cityStateZip: "Yardley, PA 19067",
  yearBuilt: 1972,
  sqft: "2,400",
  propertyType: "Colonial",
  stories: 2,
  lotSize: "0.45 acres",
};

const HomeProfileDetailPage = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(mockProfile);
  const [systems, setSystems] = useState(mockHomeSystems.map((g) => ({ ...g, systems: [...g.systems] })));

  const removeSystem = (groupIdx: number, sysIdx: number) => {
    setSystems((prev) =>
      prev.map((g, gi) =>
        gi === groupIdx ? { ...g, systems: g.systems.filter((_, si) => si !== sysIdx) } : g
      )
    );
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="flex flex-col min-h-screen bg-background"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-3 border-b border-border/50">
        <button onClick={() => navigate("/my-house")} className="text-muted-foreground hover:text-foreground p-1">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-h3 text-foreground">Home Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 pb-32 space-y-6">
        {/* Address */}
        <section>
          <p className="text-caption text-muted-foreground mb-1">Address</p>
          <p className="text-h3 text-foreground">{profile.address}</p>
          <p className="text-body-small text-muted-foreground">{profile.cityStateZip}</p>
        </section>

        {/* Property Details */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-h3 text-foreground">Property Details</h2>
            <button
              onClick={() => setEditing(!editing)}
              className="text-caption font-medium text-primary"
            >
              {editing ? "Done" : "Edit"}
            </button>
          </div>
          <div className="card-primer space-y-3">
            {[
              { label: "Year Built", key: "yearBuilt" as const, value: String(profile.yearBuilt) },
              { label: "Square Footage", key: "sqft" as const, value: `${profile.sqft} sqft` },
              { label: "Property Type", key: "propertyType" as const, value: profile.propertyType },
              { label: "Stories", key: "stories" as const, value: String(profile.stories) },
              { label: "Lot Size", key: "lotSize" as const, value: profile.lotSize },
            ].map((field) => (
              <div key={field.label} className="flex items-center justify-between py-1">
                <span className="text-body-small text-muted-foreground">{field.label}</span>
                {editing ? (
                  <input
                    className="text-body-small text-foreground text-right bg-background border border-border rounded-lg px-2 py-1 w-32 focus:outline-none focus:ring-2 focus:ring-ring"
                    defaultValue={field.value}
                  />
                ) : (
                  <span className="text-body-small font-medium text-foreground">{field.value}</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Home Systems */}
        <section>
          <h2 className="text-h3 text-foreground mb-1">Home Systems</h2>
          <p className="text-caption text-muted-foreground mb-4">
            These were set up based on your home's profile. Edit anytime if anything's off.
          </p>

          <div className="space-y-5">
            {systems.map((group, gi) => (
              <div key={group.group}>
                <p className="text-caption font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {group.group}
                </p>
                <div className="card-primer space-y-0">
                  {group.systems.map((sys, si) => (
                    <div
                      key={sys}
                      className="flex items-center justify-between py-3 border-b border-border/30 last:border-0"
                    >
                      <span className="text-body-small text-foreground">{sys}</span>
                      <button
                        onClick={() => removeSystem(gi, si)}
                        className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button className="flex items-center gap-1.5 pt-3 text-caption font-medium text-primary">
                    <Plus size={14} />
                    Add system
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default HomeProfileDetailPage;
