import type { FlowDefinition } from "./TaskFlowEngine";

export const safetyDeviceFlow: FlowDefinition = {
  title: "Safety Device Check",
  initialStep: "opening",
  steps: {
    opening: {
      messages: [
        { type: "system", text: "Let's do a safety device walkthrough. We're going to check every smoke detector, CO detector, and fire extinguisher in your house. This is the most important 20 minutes you'll spend on your home." },
        { type: "system", text: "Grab a step stool if you need one — most detectors are on the ceiling. Ready?" },
      ],
      chips: [
        { label: "Ready to go", next: "smoke_detectors" },
      ],
    },
    smoke_detectors: {
      messages: [
        { type: "system", text: "Start with smoke detectors. Walk through every level of your house and press the test button on each one. You should hear a loud beep." },
        { type: "system", text: "You should have one in:\n• Every bedroom\n• Every hallway near bedrooms\n• Every level of the house\n• The basement" },
      ],
      chips: [
        { label: "All working ✓", next: "smoke_good" },
        { label: "Some didn't beep", next: "smoke_fix" },
        { label: "I'm missing some", next: "smoke_missing" },
      ],
    },
    smoke_good: {
      messages: [
        { type: "system", text: "Great — all clear on smoke detectors!" },
      ],
      autoAdvance: "co_detectors",
    },
    smoke_fix: {
      messages: [
        { type: "system", text: "If they didn't beep, try replacing the batteries first (most use 9V or AA). If they still don't work after new batteries, the detector itself needs replacing." },
        { type: "tip", text: "Smoke detectors expire after 10 years. Check the manufacture date on the back. If it's older than 10 years, replace it regardless." },
      ],
      chips: [
        { label: "Fixed — moving on", next: "co_detectors" },
        { label: "I need to buy some", next: "co_detectors" },
      ],
    },
    smoke_missing: {
      messages: [
        { type: "system", text: "You'll want to add detectors to cover the gaps. Basic smoke detectors are $10-25 each and take 5 minutes to install (most just mount with screws or adhesive)." },
        { type: "tip", text: "For the best protection, get combination smoke/CO detectors — they cover both in one unit." },
      ],
      chips: [
        { label: "I'll add that to my list", next: "co_detectors" },
      ],
    },
    co_detectors: {
      messages: [
        { type: "system", text: "Now let's check carbon monoxide (CO) detectors. These are critical if you have gas appliances, a furnace, or an attached garage." },
        { type: "system", text: "You should have one on every level and near sleeping areas. Press the test button on each one." },
      ],
      chips: [
        { label: "All working ✓", next: "co_good" },
        { label: "Some issues", next: "co_fix" },
        { label: "I don't have any", next: "co_missing" },
      ],
    },
    co_good: {
      messages: [
        { type: "system", text: "CO detectors are good to go!" },
      ],
      autoAdvance: "fire_extinguisher",
    },
    co_fix: {
      messages: [
        { type: "system", text: "Same drill — try batteries first, then replace if needed. CO detectors typically last 5-7 years." },
      ],
      chips: [
        { label: "Got it — moving on", next: "fire_extinguisher" },
      ],
    },
    co_missing: {
      messages: [
        { type: "system", text: "You definitely need CO detectors — carbon monoxide is odorless and can be fatal. Add this to your shopping list as a priority." },
        { type: "tip", text: "Many states require CO detectors by law. Combination smoke/CO detectors ($25-40) are the easiest solution." },
      ],
      chips: [
        { label: "Adding to my list", next: "fire_extinguisher" },
      ],
    },
    fire_extinguisher: {
      messages: [
        { type: "system", text: "Last check — fire extinguisher. You should have at least one, ideally in the kitchen. Find it and check the pressure gauge." },
        { type: "system", text: "The needle should be in the green zone. If it's in the red zone, it needs to be recharged or replaced." },
      ],
      chips: [
        { label: "Gauge is green ✓", next: "extinguisher_good" },
        { label: "It's in the red", next: "extinguisher_bad" },
        { label: "I don't have one", next: "extinguisher_missing" },
      ],
    },
    extinguisher_good: {
      messages: [
        { type: "system", text: "Perfect — your extinguisher is charged and ready." },
        { type: "tip", text: "Remember PASS: Pull the pin, Aim at the base of the fire, Squeeze the handle, Sweep side to side." },
      ],
      chips: [
        { label: "Got it", next: "celebration" },
      ],
    },
    extinguisher_bad: {
      messages: [
        { type: "system", text: "Time for a replacement. A basic kitchen fire extinguisher (ABC rated) is $20-30 at any hardware store." },
        { type: "tip", text: "Get an ABC-rated extinguisher — it works on all common fire types (grease, electrical, paper)." },
      ],
      chips: [
        { label: "I'll get a new one", next: "celebration" },
      ],
    },
    extinguisher_missing: {
      messages: [
        { type: "system", text: "Every home needs at least one fire extinguisher. Keep it in the kitchen (but not right next to the stove — you need to be able to reach it if the stove is on fire)." },
        { type: "tip", text: "A basic ABC-rated extinguisher is $20-30 and could save your home." },
      ],
      chips: [
        { label: "Adding to my list", next: "celebration" },
      ],
    },
    celebration: {
      messages: [
        { type: "system", text: "Safety check complete! 🎉 You've tested your smoke detectors, CO detectors, and fire extinguisher. This is one of those tasks that takes 20 minutes but could literally save your life." },
        { type: "system", text: "I'm setting up a monthly reminder to test these again. It only takes a couple minutes once you know where everything is." },
        { type: "system", text: "Saved to your home profile. ✓" },
      ],
      chips: [
        { label: "What's next?", next: "complete" },
        { label: "I'm done for now", next: "complete" },
      ],
    },
    complete: {
      messages: [
        { type: "system", text: "You're all set — your home is safer now! 🏠" },
      ],
    },
  },
};

export const safetyDeviceDetail = {
  title: "Safety Device Check",
  category: "Safety",
  difficulty: "Easy",
  estTime: "20 min",
  estCost: "Free – $50",
  whyItMatters: "Walk through the house and test every smoke detector, CO detector, and check your fire extinguisher gauge. These are the most important devices in your house.",
  whatYoullLearn: [
    "Whether all your smoke detectors work",
    "Whether you have adequate CO detection",
    "Whether your fire extinguisher is charged",
  ],
};
