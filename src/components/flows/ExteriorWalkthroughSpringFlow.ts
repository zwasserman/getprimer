import type { FlowDefinition } from "./TaskFlowEngine";

export const exteriorWalkthroughSpringFlow: FlowDefinition = {
  title: "Exterior Walkthrough (Spring)",
  initialStep: "opening",
  steps: {
    opening: {
      messages: [
        { type: "system", text: "Winter is tough on houses. Let's walk the outside and look for anything that winter knocked loose, shifted, or damaged." },
        { type: "system", text: "This is your post-winter damage check. Ready to head out?" },
      ],
      chips: [
        { label: "Let's go", next: "foundation" },
      ],
    },
    foundation: {
      messages: [
        { type: "system", text: "Start at the foundation. Freeze-thaw cycles can shift soil and create new low spots. Walk the perimeter and check:" },
        { type: "system", text: "🔍 Has soil settled or washed away from the foundation?\n🔍 Any new cracks in the foundation wall?\n🔍 Are window wells clear of debris?" },
      ],
      chips: [
        { label: "Looks good", next: "roof_check" },
        { label: "I see some issues", next: "foundation_issues" },
      ],
    },
    foundation_issues: {
      messages: [
        { type: "system", text: "Hairline cracks are normal as a house settles. But cracks wider than 1/4 inch or stair-step cracks in block foundations are worth having a pro look at." },
        { type: "tip", text: "For soil that's washed away, add topsoil to rebuild the slope away from the house before spring rains arrive." },
      ],
      chips: [
        { label: "Got it", next: "roof_check" },
      ],
    },
    roof_check: {
      messages: [
        { type: "system", text: "Look up at the roof from the ground. After winter storms, check for:" },
        { type: "system", text: "🏠 Missing or blown-off shingles\n🏠 Ice dam damage along the eaves\n🏠 Bent or displaced flashing\n🏠 Damaged gutters or downspouts" },
      ],
      chips: [
        { label: "Roof looks fine", next: "exterior_surfaces" },
        { label: "I see damage", next: "roof_damage" },
      ],
    },
    roof_damage: {
      messages: [
        { type: "system", text: "Take photos and get a roofer's opinion before the busy season. Many roofers offer free inspections. If it was storm damage, your homeowners insurance may cover repairs." },
        { type: "tip", text: "Your insurance policy has a $1,000 deductible — so it's worth filing a claim for larger repairs but not for a single missing shingle." },
      ],
      chips: [
        { label: "Good to know", next: "exterior_surfaces" },
      ],
    },
    exterior_surfaces: {
      messages: [
        { type: "system", text: "Finally, check the siding, trim, and paint. Look for:" },
        { type: "system", text: "🪵 New cracks or peeling paint\n🪵 Gaps in caulk around windows and doors\n🪵 Any soft spots in wood trim (poke with a screwdriver)" },
      ],
      chips: [
        { label: "All looks good", next: "celebration" },
        { label: "Found some things", next: "spring_fixes" },
      ],
    },
    spring_fixes: {
      messages: [
        { type: "system", text: "Spring is the perfect time for touch-ups before summer sun bakes everything. Caulking and paint are best done when temps are 50-85°F." },
      ],
      chips: [
        { label: "I'll tackle those", next: "celebration" },
      ],
    },
    celebration: {
      messages: [
        { type: "system", text: "Nice work! 🎉 You've completed your post-winter damage check. Your home survived another winter — now you know exactly what needs attention." },
        { type: "system", text: "I've saved this to your home profile. ✓" },
      ],
      chips: [
        { label: "What's next?", next: "complete" },
        { label: "Done for now", next: "complete" },
      ],
    },
    complete: {
      messages: [
        { type: "system", text: "Welcome to spring! 🌷" },
      ],
    },
  },
};

export const exteriorWalkthroughSpringDetail = {
  title: "Exterior Walkthrough (Spring)",
  category: "Exterior",
  difficulty: "Easy",
  estTime: "30 min",
  estCost: "Free",
  whyItMatters: "Post-winter damage check. Walk the perimeter and look for shifted soil, missing shingles, bent flashing, or anything winter knocked loose.",
  whatYoullLearn: [
    "How to spot winter damage to your foundation",
    "What to check on your roof after winter",
    "When to repair vs. call a pro for exterior issues",
  ],
};
