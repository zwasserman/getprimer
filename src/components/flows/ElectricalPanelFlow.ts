import type { FlowDefinition } from "./TaskFlowEngine";

export const electricalPanelFlow: FlowDefinition = {
  title: "Label Your Electrical Panel",
  initialStep: "opening",
  steps: {
    opening: {
      messages: [
        { type: "system", text: "Let's find and label your electrical panel. That gray metal box controls the electricity in every room — and when a breaker trips at 11pm, you'll be glad you labeled it." },
        { type: "system", text: "This one takes a little time but it's oddly satisfying. You'll need: a pen, masking tape or labels, and someone to help (they'll stand at each room while you flip breakers)." },
      ],
      chips: [
        { label: "I've got help — let's go", next: "find_panel" },
        { label: "I'm solo today", next: "solo_tip" },
      ],
    },
    solo_tip: {
      messages: [
        { type: "system", text: "You can do this solo! Just plug a radio or lamp into each outlet, set it loud/bright, and listen/look as you flip each breaker. It takes a bit longer but works fine." },
      ],
      chips: [
        { label: "Good idea — let's go", next: "find_panel" },
      ],
    },
    find_panel: {
      messages: [
        { type: "system", text: "Head to your basement, garage, or utility area. The panel is a flat metal box (usually gray) mounted on the wall. Open the door — you'll see rows of switches (breakers)." },
      ],
      chips: [
        { label: "Found it", next: "check_labels" },
        { label: "Can't find it", next: "panel_locations" },
      ],
    },
    panel_locations: {
      messages: [
        { type: "system", text: "Try these spots: basement wall, garage wall, hallway closet, laundry room, or outside (some homes have an exterior panel)." },
        { type: "tip", text: "In condos and apartments, it's often inside a closet near the front door." },
      ],
      chips: [
        { label: "Found it", next: "check_labels" },
      ],
    },
    check_labels: {
      messages: [
        { type: "system", text: "Take a look at the inside of the panel door. Is there a chart or list that maps each breaker to a room or circuit?" },
      ],
      chips: [
        { label: "There are some labels", next: "verify_labels" },
        { label: "No labels at all", next: "start_labeling" },
        { label: "Labels are there but messy", next: "start_labeling" },
      ],
    },
    verify_labels: {
      messages: [
        { type: "system", text: "Nice — but don't trust old labels! Previous owners (or electricians in a hurry) often mislabel panels. Let's verify them." },
        { type: "system", text: "Start at breaker #1. Flip it off, then check which rooms/outlets lost power. Compare to what the label says." },
      ],
      chips: [
        { label: "Labels are mostly right", next: "key_breakers" },
        { label: "Some are wrong", next: "start_labeling" },
      ],
    },
    start_labeling: {
      messages: [
        { type: "system", text: "Here's the method: start at breaker #1 and flip it off. Have your helper check each room (or listen for your radio to go silent). Write down what each breaker controls." },
        { type: "system", text: "Work through each breaker one at a time. Most panels have 20-40 breakers. It'll take 20-30 minutes." },
        { type: "tip", text: "Some breakers control more than one room, and some big appliances (AC, dryer, oven) have double-wide breakers. That's normal." },
      ],
      chips: [
        { label: "Done labeling!", next: "key_breakers" },
      ],
    },
    key_breakers: {
      messages: [
        { type: "system", text: "Great work! Now make sure you can quickly find these critical breakers:" },
        { type: "system", text: "• Kitchen (where your fridge is)\n• Bathrooms (GFCI circuits)\n• HVAC system\n• Water heater (if electric)\n• Washer/Dryer" },
        { type: "tip", text: "Consider marking critical breakers with a small colored dot so you can find them fast." },
      ],
      chips: [
        { label: "All identified ✓", next: "main_breaker" },
      ],
    },
    main_breaker: {
      messages: [
        { type: "system", text: "One more — find the main breaker. It's usually at the top of the panel and is larger than the others. This shuts off ALL power to the house." },
        { type: "system", text: "You'd use it in an emergency — like if you see sparks or smell burning from an outlet." },
      ],
      chips: [
        { label: "Found the main breaker", next: "celebration" },
      ],
    },
    celebration: {
      messages: [
        { type: "system", text: "Awesome work! 🎉 Your panel is now labeled and you know your way around it. The next time a breaker trips, you'll fix it in 30 seconds instead of stumbling around in the dark." },
        { type: "system", text: "I've saved this to your home profile. ✓" },
      ],
      chips: [
        { label: "What's next?", next: "complete" },
        { label: "I'm done for now", next: "complete" },
      ],
    },
    complete: {
      messages: [
        { type: "system", text: "You're all set with this one. That panel label is going to pay off! 🏠" },
      ],
    },
  },
};

export const electricalPanelDetail = {
  title: "Label Your Electrical Panel",
  category: "Electrical",
  difficulty: "Easy",
  estTime: "30 min",
  estCost: "Free",
  whyItMatters: "That gray metal box in your basement controls the electricity in every room. Label each switch now — you'll need this the first time something trips.",
  whatYoullLearn: [
    "Where your electrical panel is",
    "Which breaker controls which room",
    "Where the main shut-off breaker is",
  ],
};
