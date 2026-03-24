import type { FlowDefinition } from "./TaskFlowEngine";

export const protectPipesWinterFlow: FlowDefinition = {
  title: "Protect Your Pipes Before Winter",
  initialStep: "opening",
  steps: {
    opening: {
      messages: [
        { type: "system", text: "A burst pipe can cause $5,000+ in damage — and it's one of the most common winter emergencies. Let's make sure yours are protected." },
        { type: "system", text: "There are three things to do: disconnect outdoor hoses, shut off exterior faucets, and insulate exposed pipes." },
      ],
      chips: [
        { label: "Let's start", next: "hoses" },
      ],
    },
    hoses: {
      messages: [
        { type: "system", text: "First, go outside and disconnect any garden hoses from the spigots. Even frost-free faucets can burst if a hose is left connected — the trapped water has nowhere to expand." },
        { type: "tip", text: "Drain the hoses and store them in the garage or basement. They'll last longer too." },
      ],
      chips: [
        { label: "Hoses disconnected", next: "shutoff_valves" },
        { label: "I don't have outdoor hoses", next: "shutoff_valves" },
      ],
    },
    shutoff_valves: {
      messages: [
        { type: "system", text: "Now let's shut off water to the exterior faucets. Look in your basement or crawl space for small shut-off valves on the pipes leading to outside spigots." },
        { type: "system", text: "Turn the valve clockwise to close it, then go outside and open the faucet to drain any remaining water from the line." },
      ],
      chips: [
        { label: "Found and shut them off", next: "insulation" },
        { label: "Can't find the valves", next: "valve_help" },
      ],
    },
    valve_help: {
      messages: [
        { type: "system", text: "Not every home has interior shut-offs for exterior faucets. Look for small handles or levers on pipes near the foundation wall, often in the basement ceiling area." },
        { type: "tip", text: "If you can't find them, consider adding frost-free spigots or insulated faucet covers ($3-5 at any hardware store) as extra protection." },
      ],
      chips: [
        { label: "Got it, moving on", next: "insulation" },
      ],
    },
    insulation: {
      messages: [
        { type: "system", text: "Last step: check for exposed pipes in unheated areas — basement, crawl space, garage, or near exterior walls." },
        { type: "system", text: "Wrap any exposed pipes with foam pipe insulation (about $3-5 for a 6-foot sleeve). Pay special attention to pipes near exterior walls or in the garage." },
      ],
      chips: [
        { label: "Pipes insulated", next: "celebration" },
        { label: "I'll get supplies and do this", next: "celebration" },
      ],
    },
    celebration: {
      messages: [
        { type: "system", text: "Nice work! 🎉 Your pipes are protected for winter. This simple prep prevents one of the most expensive homeowner disasters." },
        { type: "tip", text: "During extreme cold snaps (below 0°F), you can also open cabinet doors under sinks on exterior walls and let faucets drip slightly to prevent freezing." },
      ],
      chips: [
        { label: "Good to know!", next: "complete" },
        { label: "Done for now", next: "complete" },
      ],
    },
    complete: {
      messages: [
        { type: "system", text: "Your home is winter-ready! ❄️ Stay warm." },
      ],
    },
  },
};

export const protectPipesWinterDetail = {
  title: "Protect Your Pipes Before Winter",
  category: "Plumbing",
  difficulty: "Easy",
  estTime: "30 min",
  estCost: "Free – $30",
  whyItMatters: "Disconnect hoses, shut off exterior faucets, and insulate any exposed pipes in unheated areas. A burst pipe can cause $5,000+ in damage.",
  whatYoullLearn: [
    "How to disconnect and drain outdoor hoses",
    "Where your exterior faucet shut-off valves are",
    "Which pipes need insulation before freezing temps hit",
  ],
};
