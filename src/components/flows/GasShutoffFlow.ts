import type { FlowDefinition } from "./TaskFlowEngine";

export const gasShutoffFlow: FlowDefinition = {
  title: "Find Your Gas Shut-Off",
  initialStep: "opening",
  steps: {
    opening: {
      messages: [
        { type: "system", text: "Let's find your gas shut-off valve. If you ever smell rotten eggs in your house, that could be a gas leak — and you'll want to know exactly where to shut it off." },
        { type: "system", text: "There are typically two shut-off points: one at your gas meter (outside) and individual shut-offs at each gas appliance." },
      ],
      chips: [
        { label: "Let's find them", next: "find_meter" },
      ],
    },
    find_meter: {
      messages: [
        { type: "system", text: "First, let's find your gas meter. It's usually outside your house — look along the side of your home, often near the front." },
        { type: "system", text: "You're looking for a metal box with dials or a digital display, with pipes going into the ground and into your house." },
      ],
      chips: [
        { label: "Found the meter", next: "meter_valve" },
        { label: "Can't find it", next: "meter_help" },
      ],
    },
    meter_help: {
      messages: [
        { type: "system", text: "Check these spots: side of the house facing the street, near the foundation, or in a utility area. In some older homes it may be in the basement." },
        { type: "tip", text: "Your gas bill may show the meter location, or you can call your gas utility company — they'll tell you exactly where it is." },
      ],
      chips: [
        { label: "Found it!", next: "meter_valve" },
        { label: "I'll check later", next: "appliance_valves" },
      ],
    },
    meter_valve: {
      messages: [
        { type: "system", text: "Near the meter, look for a valve on the pipe. It's usually a rectangular handle that sits parallel to the pipe when gas is flowing." },
        { type: "system", text: "To shut off: turn it 90° so it's perpendicular to the pipe. That's it." },
        { type: "tip", text: "You may need a wrench to turn it. Some people keep an adjustable wrench near the meter for emergencies. Do NOT turn it off now — your gas company should be the one to turn it back on." },
      ],
      chips: [
        { label: "Got it", next: "appliance_valves" },
      ],
    },
    appliance_valves: {
      messages: [
        { type: "system", text: "Now let's check the individual shut-offs. Each gas appliance (furnace, water heater, stove, dryer) should have its own valve on the gas line feeding it." },
        { type: "system", text: "Look behind or near each appliance for a small lever or handle on the gas pipe. These are useful if you need to service just one appliance without shutting off gas to the whole house." },
      ],
      chips: [
        { label: "Found them", next: "safety_tips" },
        { label: "I see some but not all", next: "safety_tips" },
      ],
    },
    safety_tips: {
      messages: [
        { type: "system", text: "Important safety reminders:" },
        { type: "system", text: "🚨 If you smell gas: don't flip any light switches, don't use your phone inside, get everyone out, and call your gas company or 911 from outside." },
        { type: "system", text: "If you shut off gas at the meter, call your gas company to turn it back on — they need to relight pilots and check for leaks." },
      ],
      chips: [
        { label: "Understood", next: "celebration" },
      ],
    },
    celebration: {
      messages: [
        { type: "system", text: "Excellent! 🎉 You now know where your gas shut-offs are. That's critical safety knowledge that most homeowners never learn until there's an emergency." },
        { type: "system", text: "Make sure everyone in your household knows too — especially the main meter location." },
        { type: "system", text: "I've saved this to your home profile. ✓" },
      ],
      chips: [
        { label: "What's next?", next: "complete" },
        { label: "I'm done for now", next: "complete" },
      ],
    },
    complete: {
      messages: [
        { type: "system", text: "You're all set with this one. Stay safe! 🏠" },
      ],
    },
  },
};

export const gasShutoffDetail = {
  title: "Find Your Gas Shut-Off",
  category: "Safety",
  difficulty: "Easy",
  estTime: "10 min",
  estCost: "Free",
  whyItMatters: "If you ever smell rotten eggs, that's a gas leak — shut off the gas and get out. Everyone in the house should know where the valve is.",
  whatYoullLearn: [
    "Where your gas meter is",
    "How to shut off gas at the meter",
    "Where individual appliance shut-offs are",
  ],
};
