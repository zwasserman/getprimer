import type { FlowDefinition } from "./TaskFlowEngine";

export const trimBranchesFlow: FlowDefinition = {
  title: "Trim Branches Away From House",
  initialStep: "opening",
  steps: {
    opening: {
      messages: [
        { type: "system", text: "Branches touching your house scrape the roof, clog gutters, and give squirrels and raccoons a highway into your attic. Let's check yours." },
        { type: "system", text: "Walk around your house and look up. Are any tree branches within 3 feet of your roof, siding, or power lines?" },
      ],
      chips: [
        { label: "Yes, a few spots", next: "assess" },
        { label: "No, all clear", next: "all_clear" },
      ],
    },
    all_clear: {
      messages: [
        { type: "system", text: "Great! Nothing to do right now. Just keep an eye on things — trees grow fast, especially in spring and summer." },
      ],
      chips: [
        { label: "Got it", next: "complete" },
      ],
    },
    assess: {
      messages: [
        { type: "system", text: "How big are the branches that need trimming?" },
      ],
      chips: [
        { label: "Small — under 3 inches", next: "diy_trim" },
        { label: "Large limbs or near power lines", next: "hire_pro" },
      ],
    },
    diy_trim: {
      messages: [
        { type: "system", text: "Small branches you can handle with a pole pruner or loppers. The goal is 3 feet of clearance between any branch and your house." },
        { type: "system", text: "Best time to trim is late winter or early spring while trees are dormant. Cut just outside the branch collar (the swollen area where the branch meets the trunk) — don't cut flush." },
        { type: "tip", text: "Never trim from a ladder leaning against the tree. Use a pole pruner from the ground, or hire a pro for anything you can't reach safely." },
      ],
      chips: [
        { label: "I'll handle it", next: "celebration" },
      ],
    },
    hire_pro: {
      messages: [
        { type: "system", text: "For large limbs or anything near power lines, hire a certified arborist. Never trim near power lines yourself — call the power company or a licensed tree service." },
        { type: "system", text: "Cost varies widely: $200-500 for a few large limbs, or more for big jobs. Get 2-3 quotes." },
        { type: "tip", text: "Ask if they're ISA certified (International Society of Arboriculture). Certified arborists know how to trim without damaging the tree." },
      ],
      chips: [
        { label: "I'll get quotes", next: "celebration" },
      ],
    },
    celebration: {
      messages: [
        { type: "system", text: "You're on it! 🎉 Keeping branches clear protects your roof, gutters, and keeps critters at bay." },
        { type: "system", text: "I've saved this to your home profile. ✓" },
      ],
      chips: [
        { label: "What's next?", next: "complete" },
        { label: "Done for now", next: "complete" },
      ],
    },
    complete: {
      messages: [
        { type: "system", text: "Trees trimmed, house protected! 🌳🏠" },
      ],
    },
  },
};

export const trimBranchesDetail = {
  title: "Trim Branches Away From House",
  category: "Exterior",
  difficulty: "Moderate",
  estTime: "3 hrs",
  estCost: "Free – $500",
  whyItMatters: "Branches touching your roof scrape shingles, drop debris into gutters, and give critters a highway into your attic. Keep 3 feet of clearance.",
  whatYoullLearn: [
    "How to identify branches that need trimming",
    "Safe DIY trimming techniques",
    "When to hire an arborist",
  ],
};
