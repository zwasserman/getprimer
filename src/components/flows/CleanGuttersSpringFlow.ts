import type { FlowDefinition } from "./TaskFlowEngine";

export const cleanGuttersSpringFlow: FlowDefinition = {
  title: "Clean Your Gutters (Spring)",
  initialStep: "opening",
  steps: {
    opening: {
      messages: [
        { type: "system", text: "Winter debris, seed pods, and early spring pollen have been piling up. Before the heavy spring rains, let's get your gutters cleared." },
        { type: "system", text: "This is the same process as fall — clear the gutters and flush the downspouts. How tall is your house?" },
      ],
      chips: [
        { label: "Single story — I'll DIY", next: "diy_tips" },
        { label: "Two+ stories — hiring a pro", next: "hire_pro" },
      ],
    },
    diy_tips: {
      messages: [
        { type: "system", text: "Grab your ladder, gloves, and a bucket. Work your way around the house scooping debris, then flush each run with a hose." },
        { type: "tip", text: "Spring gutters tend to have more fine sediment than fall leaves. A stiff brush helps scrub out the sludge." },
      ],
      chips: [
        { label: "What about downspouts?", next: "downspouts" },
        { label: "I'll get it done", next: "celebration" },
      ],
    },
    hire_pro: {
      messages: [
        { type: "system", text: "Same as fall — $100-250 for a pro cleaning. If you used someone in the fall, call them again. Many offer spring/fall packages at a discount." },
      ],
      chips: [
        { label: "I'll schedule it", next: "celebration" },
      ],
    },
    downspouts: {
      messages: [
        { type: "system", text: "Flush each downspout with the hose. If water backs up, there's a clog. Use a plumber's snake or disconnect the bottom elbow to clear it." },
        { type: "system", text: "Make sure downspout extensions are still directing water at least 4 feet from the foundation." },
      ],
      chips: [
        { label: "Got it", next: "celebration" },
      ],
    },
    celebration: {
      messages: [
        { type: "system", text: "All clear! 🎉 Your gutters are ready for spring rains. This protects your foundation and keeps your basement dry." },
        { type: "system", text: "I've saved this to your home profile. ✓" },
      ],
      chips: [
        { label: "What's next?", next: "complete" },
        { label: "Done", next: "complete" },
      ],
    },
    complete: {
      messages: [
        { type: "system", text: "You're all set! 🌧️🏠" },
      ],
    },
  },
};

export const cleanGuttersSpringDetail = {
  title: "Clean Your Gutters (Spring)",
  category: "Exterior",
  difficulty: "Moderate",
  estTime: "3 hrs",
  estCost: "Free – $250",
  whyItMatters: "Snow's melted, spring rains are coming. Clear the gutters before water has nowhere to go.",
  whatYoullLearn: [
    "How to clear spring debris from gutters",
    "How to flush downspouts",
    "When to DIY vs. hire a pro",
  ],
};
