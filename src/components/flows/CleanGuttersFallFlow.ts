import type { FlowDefinition } from "./TaskFlowEngine";

export const cleanGuttersFallFlow: FlowDefinition = {
  title: "Clean Your Gutters (Fall)",
  initialStep: "opening",
  steps: {
    opening: {
      messages: [
        { type: "system", text: "Clogged gutters are one of the top causes of basement leaks and foundation damage. Before winter rain and snow, let's make sure yours are clear." },
        { type: "system", text: "First — how tall is your house?" },
      ],
      chips: [
        { label: "Single story", next: "diy_plan" },
        { label: "Two stories", next: "two_story" },
        { label: "Three+ stories", next: "hire_pro" },
      ],
    },
    diy_plan: {
      messages: [
        { type: "system", text: "Great — single story is very doable yourself. You'll need a sturdy ladder, work gloves, a bucket or tarp, and a garden hose." },
        { type: "system", text: "Work your way around the house, scooping out leaves and debris. Then flush each run with the hose to check flow and spot clogs in the downspouts." },
      ],
      chips: [
        { label: "What about downspouts?", next: "downspouts" },
        { label: "Got it, I'll do this", next: "safety_tips" },
      ],
    },
    two_story: {
      messages: [
        { type: "system", text: "Two-story homes are trickier. You can DIY with an extension ladder, but many people prefer to hire this out — it's one of the most common pro jobs ($100-250)." },
        { type: "tip", text: "If you go DIY, always have someone spot you on the ladder and never lean past your belt buckle." },
      ],
      chips: [
        { label: "I'll DIY it", next: "diy_plan" },
        { label: "I'll hire a pro", next: "hire_pro" },
      ],
    },
    hire_pro: {
      messages: [
        { type: "system", text: "Smart call. For multi-story homes, hiring a gutter cleaning service is the safest option. Typical cost is $100-250 depending on your home's size." },
        { type: "tip", text: "Search for 'gutter cleaning near me' or ask your neighbors who they use. Book early in fall — they fill up fast." },
      ],
      chips: [
        { label: "What should I look for?", next: "pro_tips" },
        { label: "I'll schedule it", next: "celebration" },
      ],
    },
    pro_tips: {
      messages: [
        { type: "system", text: "Ask if they include downspout flushing (many do). Also ask them to check for loose gutter brackets or sagging sections — winter ice makes those worse." },
      ],
      chips: [
        { label: "Good to know", next: "celebration" },
      ],
    },
    downspouts: {
      messages: [
        { type: "system", text: "Downspouts are where clogs hide. After clearing the gutters, run water from the hose into each downspout. If water backs up, you've got a clog." },
        { type: "system", text: "For stubborn clogs, try feeding a plumber's snake down from the top, or disconnect the bottom elbow and flush from below." },
        { type: "tip", text: "Make sure downspouts direct water at least 4 feet away from your foundation. Add extensions if needed ($5-10 each)." },
      ],
      chips: [
        { label: "Got it", next: "safety_tips" },
      ],
    },
    safety_tips: {
      messages: [
        { type: "system", text: "A few safety reminders:" },
        { type: "system", text: "🪜 Set your ladder on firm, level ground. Never on a slope or soft soil.\n🧤 Wear work gloves — gutters can have sharp edges.\n⚡ Watch for power lines near the roofline." },
      ],
      chips: [
        { label: "Thanks!", next: "celebration" },
      ],
    },
    celebration: {
      messages: [
        { type: "system", text: "Awesome! 🎉 Clean gutters = protected foundation. Your home is ready for fall rain and winter snowmelt." },
        { type: "system", text: "I've saved this to your home profile. ✓" },
      ],
      chips: [
        { label: "What's next?", next: "complete" },
        { label: "Done for now", next: "complete" },
      ],
    },
    complete: {
      messages: [
        { type: "system", text: "You're all set! 🏠" },
      ],
    },
  },
};

export const cleanGuttersFallDetail = {
  title: "Clean Your Gutters (Fall)",
  category: "Exterior",
  difficulty: "Moderate",
  estTime: "3 hrs",
  estCost: "Free – $250",
  whyItMatters: "Gutters direct rainwater away from your foundation. When clogged, water overflows and pools against the house — leading to basement leaks and foundation problems.",
  whatYoullLearn: [
    "How to safely clean your gutters",
    "How to check and clear downspout clogs",
    "When to DIY vs. hire a pro",
  ],
};
