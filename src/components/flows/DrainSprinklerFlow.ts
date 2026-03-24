import type { FlowDefinition } from "./TaskFlowEngine";

export const drainSprinklerFlow: FlowDefinition = {
  title: "Drain Your Sprinkler System",
  initialStep: "opening",
  steps: {
    opening: {
      messages: [
        { type: "system", text: "Sprinkler lines are buried shallow enough to freeze. If water is left in the pipes, they can crack — and you won't know until spring when everything leaks." },
        { type: "system", text: "Most homeowners hire an irrigation company to blow out the lines with compressed air. Have you done this before?" },
      ],
      chips: [
        { label: "No, first time", next: "first_time" },
        { label: "Yes, I know the drill", next: "reminder" },
      ],
    },
    first_time: {
      messages: [
        { type: "system", text: "Here's the process: a pro connects an air compressor to your system and blows out each zone one at a time. It takes about 30-45 minutes." },
        { type: "system", text: "Cost is typically $75-100. Search 'sprinkler winterization near me' or 'irrigation blowout' to find a local company." },
        { type: "tip", text: "Book this before the first hard freeze (below 28°F). Many irrigation companies fill up fast in October, so schedule early." },
      ],
      chips: [
        { label: "Can I DIY this?", next: "diy_option" },
        { label: "I'll hire a pro", next: "scheduling" },
      ],
    },
    diy_option: {
      messages: [
        { type: "system", text: "You can, but you need an air compressor that delivers at least 80 PSI and enough CFM for your pipe size. Most home compressors aren't big enough." },
        { type: "system", text: "If you over-pressurize, you can crack fittings. If you under-pressurize, water stays in the lines and freezes. For most homeowners, the $75-100 pro fee is worth it." },
      ],
      chips: [
        { label: "Fair enough, I'll hire a pro", next: "scheduling" },
      ],
    },
    reminder: {
      messages: [
        { type: "system", text: "Great — just a reminder to get it scheduled before the first hard freeze. Most companies book up quickly in October." },
      ],
      chips: [
        { label: "I'll schedule it", next: "scheduling" },
        { label: "Already booked", next: "celebration" },
      ],
    },
    scheduling: {
      messages: [
        { type: "system", text: "Before the tech comes, you'll also want to:" },
        { type: "system", text: "1. Shut off the water supply to the sprinkler system (usually a dedicated valve in the basement)\n2. Turn off the controller/timer so it doesn't try to run zones over winter" },
      ],
      chips: [
        { label: "Got it", next: "celebration" },
      ],
    },
    celebration: {
      messages: [
        { type: "system", text: "You're covered! 🎉 One less thing to worry about when winter hits. Your sprinkler system will be ready to go next spring." },
        { type: "system", text: "I've saved this to your home profile. ✓" },
      ],
      chips: [
        { label: "What's next?", next: "complete" },
        { label: "Done for now", next: "complete" },
      ],
    },
    complete: {
      messages: [
        { type: "system", text: "All set for winter! ❄️" },
      ],
    },
  },
};

export const drainSprinklerDetail = {
  title: "Drain Your Sprinkler System",
  category: "Exterior",
  difficulty: "Moderate",
  estTime: "45 min",
  estCost: "Free – $100",
  whyItMatters: "Sprinkler lines are shallow enough to freeze. The water needs to be blown out before winter. Most irrigation companies charge $75-100.",
  whatYoullLearn: [
    "Why sprinkler lines need to be drained before winter",
    "How to find and schedule a blowout service",
    "How to shut off the sprinkler water supply",
  ],
};
