import type { FlowDefinition } from "./TaskFlowEngine";

export const checkDoorWindowSealsFlow: FlowDefinition = {
  title: "Check Door and Window Seals",
  initialStep: "opening",
  steps: {
    opening: {
      messages: [
        { type: "system", text: "Drafty doors and windows are the cheapest fix with the biggest impact on your heating bill. Let's check yours." },
        { type: "system", text: "We'll do a quick walk-through of your exterior doors first, then windows." },
      ],
      chips: [
        { label: "Let's start", next: "doors" },
      ],
    },
    doors: {
      messages: [
        { type: "system", text: "Go to your front door. Close it and look around the edges — can you see any daylight between the door and the frame?" },
        { type: "tip", text: "Another test: on a cold day, hold your hand near the edges and feel for drafts. Or hold a lit candle near the seams — if the flame flickers, air is getting through." },
      ],
      chips: [
        { label: "I see daylight / feel drafts", next: "door_fix" },
        { label: "Looks sealed", next: "other_doors" },
      ],
    },
    door_fix: {
      messages: [
        { type: "system", text: "That's common! The fix is usually new weather stripping — it's a foam or rubber strip that attaches to the door frame. Costs $5-15 at any hardware store." },
        { type: "system", text: "Also check the door sweep at the bottom. If you can see light under the door, replace the sweep ($8-15). It just screws into the bottom of the door." },
      ],
      chips: [
        { label: "I'll add that to my list", next: "other_doors" },
      ],
    },
    other_doors: {
      messages: [
        { type: "system", text: "Now check your back door, garage entry door, and any other exterior doors the same way. Side doors and garage entries are often the worst offenders." },
      ],
      chips: [
        { label: "Checked them all", next: "windows" },
      ],
    },
    windows: {
      messages: [
        { type: "system", text: "Now windows. Walk room by room and check each window:" },
        { type: "system", text: "1. Lock the window — the lock pulls the sash tight against the seal\n2. Feel for drafts around the edges\n3. Look at the caulk on the outside — any cracked or missing sections?" },
      ],
      chips: [
        { label: "Found some drafty ones", next: "window_fix" },
        { label: "All good", next: "celebration" },
      ],
    },
    window_fix: {
      messages: [
        { type: "system", text: "For drafty windows, you have a few options:" },
        { type: "system", text: "🪟 Re-caulk the exterior (tube of caulk is $5-8)\n🪟 Add rope caulk on the inside for a temporary seal\n🪟 Use window insulation film kits for the worst ones ($10-15 for a 3-pack)" },
        { type: "tip", text: "Window film kits are surprisingly effective and nearly invisible once installed. They use a hair dryer to shrink tight." },
      ],
      chips: [
        { label: "Good tips, thanks", next: "celebration" },
      ],
    },
    celebration: {
      messages: [
        { type: "system", text: "Nice work! 🎉 Sealing drafts is one of the highest-ROI home improvements — you'll feel the difference on your next heating bill." },
        { type: "system", text: "I've saved this to your home profile. ✓" },
      ],
      chips: [
        { label: "What's next?", next: "complete" },
        { label: "Done for now", next: "complete" },
      ],
    },
    complete: {
      messages: [
        { type: "system", text: "Stay draft-free! 🏠" },
      ],
    },
  },
};

export const checkDoorWindowSealsDetail = {
  title: "Check Door and Window Seals",
  category: "Exterior",
  difficulty: "Easy",
  estTime: "30 min",
  estCost: "$10 – $30",
  whyItMatters: "If you can see daylight around a closed door or feel a draft near a window, the weather stripping needs replacing. Cheapest way to cut your heating bill.",
  whatYoullLearn: [
    "How to test doors and windows for drafts",
    "How to replace weather stripping and door sweeps",
    "Quick-fix options for drafty windows",
  ],
};
