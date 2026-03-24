import type { FlowDefinition } from "./TaskFlowEngine";

export const interiorWalkthroughFlow: FlowDefinition = {
  title: "Interior Walkthrough",
  initialStep: "opening",
  steps: {
    opening: {
      messages: [
        { type: "system", text: "Let's walk through your house and check the spots where problems hide. Think of this as a home health check — we're looking for small issues before they become big (expensive) ones." },
        { type: "system", text: "We'll check three areas: under sinks, the attic, and caulk/seals around tubs and windows. Ready?" },
      ],
      chips: [
        { label: "Let's do it", next: "under_sinks" },
      ],
    },
    under_sinks: {
      messages: [
        { type: "system", text: "First stop: under every sink in the house. Open the cabinet doors under your kitchen sink, every bathroom sink, and any utility sinks." },
        { type: "system", text: "Look for:\n• Drips or moisture on the pipes\n• Stains or warped wood on the cabinet floor\n• Musty smell (could mean hidden mold)\n• Corroded or green-colored fittings" },
      ],
      chips: [
        { label: "Everything looks dry ✓", next: "sinks_good" },
        { label: "I see some moisture", next: "sinks_issue" },
        { label: "Looks like there was a past leak", next: "sinks_old" },
      ],
    },
    sinks_good: {
      messages: [
        { type: "system", text: "No signs of leaks — that's great!" },
      ],
      autoAdvance: "attic_check",
    },
    sinks_issue: {
      messages: [
        { type: "system", text: "Active moisture is worth investigating. Check if a connection is loose — sometimes tightening the coupling under the sink stops it. If it's dripping from the faucet supply lines or drain pipe, a plumber should take a look." },
        { type: "tip", text: "Put a small towel or pan under the drip for now and keep an eye on it. A small leak today can become a big problem." },
      ],
      chips: [
        { label: "Noted — moving on", next: "attic_check" },
      ],
    },
    sinks_old: {
      messages: [
        { type: "system", text: "Old stains could mean a past leak that's been fixed, or an intermittent leak that only happens sometimes. Check if the area is dry now and monitor it." },
        { type: "tip", text: "Run the faucet for 30 seconds and look underneath. If nothing drips, it was probably fixed." },
      ],
      chips: [
        { label: "Seems dry now", next: "attic_check" },
        { label: "It's dripping!", next: "sinks_issue" },
      ],
    },
    attic_check: {
      messages: [
        { type: "system", text: "Next: the attic. If you have attic access (usually a hatch in a ceiling or pull-down stairs), poke your head up there." },
        { type: "system", text: "Look for:\n• Daylight coming through the roof (bad!)\n• Water stains on the underside of the roof deck\n• Proper insulation coverage\n• Any signs of pests (droppings, nesting material)" },
        { type: "tip", text: "Use a flashlight. Don't step between joists — only step ON the joists or on plywood decking." },
      ],
      chips: [
        { label: "Looks good up there", next: "attic_good" },
        { label: "I see some issues", next: "attic_issue" },
        { label: "I don't have attic access", next: "caulk_check" },
      ],
    },
    attic_good: {
      messages: [
        { type: "system", text: "Attic looks solid — no leaks or issues. Nice!" },
      ],
      autoAdvance: "caulk_check",
    },
    attic_issue: {
      messages: [
        { type: "system", text: "Water stains or daylight mean you may need a roof repair. This is worth getting a roofer to evaluate — catching a small leak early prevents ceiling damage and mold." },
        { type: "tip", text: "Take a photo of any stains with your phone — it'll help when you talk to a roofer." },
      ],
      chips: [
        { label: "I'll follow up on that", next: "caulk_check" },
      ],
    },
    caulk_check: {
      messages: [
        { type: "system", text: "Last area: caulk and seals. Check around your bathtub, shower, and windows." },
        { type: "system", text: "Run your finger along the caulk line where the tub meets the wall and where the tub meets the floor. Look for:\n• Gaps or peeling caulk\n• Dark spots (mold growing behind old caulk)\n• Caulk that's cracked or pulling away" },
      ],
      chips: [
        { label: "Caulk looks solid ✓", next: "caulk_good" },
        { label: "Some spots need attention", next: "caulk_fix" },
      ],
    },
    caulk_good: {
      messages: [
        { type: "system", text: "Seals are in good shape — water stays where it should." },
      ],
      autoAdvance: "celebration",
    },
    caulk_fix: {
      messages: [
        { type: "system", text: "Re-caulking a tub is a great DIY project. Remove old caulk with a caulk removal tool ($5), clean the surface, and apply new silicone caulk ($7). The whole job takes about 30 minutes." },
        { type: "tip", text: "Use 100% silicone caulk for wet areas — it's more flexible and water-resistant than latex." },
      ],
      chips: [
        { label: "I'll tackle that soon", next: "celebration" },
      ],
    },
    celebration: {
      messages: [
        { type: "system", text: "Interior walkthrough complete! 🎉 You've checked the three most common problem areas in a home. Now you know what to look for, and you'll catch small issues before they become expensive ones." },
        { type: "system", text: "I'm setting up a reminder to do this again in 6 months — it only gets faster once you know what to look for." },
        { type: "system", text: "Saved to your home profile. ✓" },
      ],
      chips: [
        { label: "What's next?", next: "complete" },
        { label: "I'm done for now", next: "complete" },
      ],
    },
    complete: {
      messages: [
        { type: "system", text: "You're all set with this one. Your home thanks you! 🏠" },
      ],
    },
  },
};

export const interiorWalkthroughDetail = {
  title: "Interior Walkthrough",
  category: "General",
  difficulty: "Easy",
  estTime: "30 min",
  estCost: "Free",
  whyItMatters: "Let's walk through your house and check the spots where problems hide — under sinks, in the attic, and around tubs and windows.",
  whatYoullLearn: [
    "How to spot leaks under sinks",
    "What to look for in the attic",
    "How to check caulk and seals",
  ],
};
