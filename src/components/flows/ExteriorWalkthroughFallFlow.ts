import type { FlowDefinition } from "./TaskFlowEngine";

export const exteriorWalkthroughFallFlow: FlowDefinition = {
  title: "Exterior Walkthrough (Fall)",
  initialStep: "opening",
  steps: {
    opening: {
      messages: [
        { type: "system", text: "Before winter sets in, let's do one lap around the outside of your house. We're looking for anything that could cause problems once snow, ice, and rain arrive." },
        { type: "system", text: "This takes about 30 minutes. Ready to head outside?" },
      ],
      chips: [
        { label: "Let's go", next: "foundation" },
      ],
    },
    foundation: {
      messages: [
        { type: "system", text: "Start at the foundation. Walk the perimeter and look at the ground near the base of the house." },
        { type: "system", text: "The soil should slope AWAY from the foundation — about 6 inches of drop over the first 10 feet. If soil has settled and now slopes toward the house, water will pool against your foundation." },
      ],
      chips: [
        { label: "Grading looks good", next: "roof_check" },
        { label: "I see some problem areas", next: "grading_fix" },
      ],
    },
    grading_fix: {
      messages: [
        { type: "system", text: "Note the spots where soil slopes toward the house. Before the ground freezes, add topsoil to build up those areas so water flows away." },
        { type: "tip", text: "A few bags of topsoil from the hardware store ($4-6 each) can fix most grading issues. Your inspection report flagged grading on the south side — check that spot specifically." },
      ],
      chips: [
        { label: "I'll fix that", next: "roof_check" },
      ],
    },
    roof_check: {
      messages: [
        { type: "system", text: "Now look up at the roof from the ground. You don't need to climb up — just scan from different angles." },
        { type: "system", text: "Look for:\n🏠 Missing or curled shingles\n🏠 Damaged flashing around the chimney or vents\n🏠 Any sagging sections" },
      ],
      chips: [
        { label: "Roof looks fine", next: "trim_siding" },
        { label: "I see some issues", next: "roof_issues" },
      ],
    },
    roof_issues: {
      messages: [
        { type: "system", text: "Good catch. A missing shingle or damaged flashing before winter can turn into a leak. If it's just 1-2 shingles, a handyman can fix it for $100-200. Larger issues may need a roofer." },
        { type: "tip", text: "Take a photo of what you see — it'll help when getting quotes." },
      ],
      chips: [
        { label: "Got it", next: "trim_siding" },
      ],
    },
    trim_siding: {
      messages: [
        { type: "system", text: "Now check the trim and siding around the house. Look for:" },
        { type: "system", text: "🪵 Peeling or cracked paint (water gets in and causes rot)\n🪵 Gaps between siding and trim\n🪵 Any soft or spongy wood (poke it — that's rot)" },
        { type: "tip", text: "Also look for any spots where tree branches are touching the house. They can scrape off paint and give critters a path to your roof." },
      ],
      chips: [
        { label: "All looks good", next: "celebration" },
        { label: "Found some areas to address", next: "note_issues" },
      ],
    },
    note_issues: {
      messages: [
        { type: "system", text: "Note the spots and take photos. Minor paint touch-ups and caulking should be done before winter if possible. Rotted wood may need a pro to evaluate." },
      ],
      chips: [
        { label: "Got it", next: "celebration" },
      ],
    },
    celebration: {
      messages: [
        { type: "system", text: "Great walkthrough! 🎉 You've now given your home's exterior a proper pre-winter check. Most homeowners never do this — and they pay for it in spring." },
        { type: "system", text: "I've saved this to your home profile. ✓" },
      ],
      chips: [
        { label: "What's next?", next: "complete" },
        { label: "Done for now", next: "complete" },
      ],
    },
    complete: {
      messages: [
        { type: "system", text: "Your exterior is winter-ready! 🏠" },
      ],
    },
  },
};

export const exteriorWalkthroughFallDetail = {
  title: "Exterior Walkthrough (Fall)",
  category: "Exterior",
  difficulty: "Easy",
  estTime: "30 min",
  estCost: "Free",
  whyItMatters: "One lap around the outside before winter. Check that soil slopes away from the foundation, look up at the roof for missing shingles, and note any branches near the house.",
  whatYoullLearn: [
    "How to check your foundation grading",
    "What to look for on your roof from the ground",
    "How to spot siding and trim issues before they get worse",
  ],
};
