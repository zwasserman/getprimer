import type { FlowDefinition } from "./TaskFlowEngine";

export const testSumpPumpFlow: FlowDefinition = {
  title: "Test Your Sump Pump",
  initialStep: "opening",
  steps: {
    opening: {
      messages: [
        { type: "system", text: "Your sump pump is your basement's last line of defense against flooding. Before spring rains arrive, let's make sure it actually works." },
        { type: "system", text: "Do you know where your sump pump is?" },
      ],
      chips: [
        { label: "Yes", next: "test_it" },
        { label: "Not sure", next: "find_it" },
      ],
    },
    find_it: {
      messages: [
        { type: "system", text: "Look in the lowest point of your basement, usually in a corner. You're looking for a round pit (sump basin) in the floor, about 18 inches wide, with a pipe going up and out." },
        { type: "tip", text: "It may have a cover on it. The pump itself sits inside the pit." },
      ],
      chips: [
        { label: "Found it!", next: "test_it" },
        { label: "I don't think I have one", next: "no_pump" },
      ],
    },
    no_pump: {
      messages: [
        { type: "system", text: "Not every home needs one — it depends on your water table and drainage. If your basement stays dry, you may not need one. But if you've ever had water in the basement, it's worth considering." },
      ],
      chips: [
        { label: "Got it", next: "complete" },
      ],
    },
    test_it: {
      messages: [
        { type: "system", text: "Here's the test: grab a 5-gallon bucket of water and slowly pour it into the sump pit." },
        { type: "system", text: "The float should rise and trigger the pump. You'll hear it kick on and the water should be pumped out quickly. Watch the discharge pipe outside to confirm water is flowing out." },
      ],
      chips: [
        { label: "It kicked on!", next: "check_discharge" },
        { label: "Nothing happened", next: "pump_problem" },
      ],
    },
    pump_problem: {
      messages: [
        { type: "system", text: "Don't panic. Check these things:" },
        { type: "system", text: "1. Is it plugged in? (Check the outlet — it should be a GFCI outlet)\n2. Has the GFCI tripped? Press the reset button\n3. Is the float stuck? Wiggle it manually\n4. Try unplugging and plugging back in" },
      ],
      chips: [
        { label: "Got it working!", next: "check_discharge" },
        { label: "Still not working", next: "call_pro" },
      ],
    },
    call_pro: {
      messages: [
        { type: "system", text: "Time to call a plumber. A sump pump replacement is typically $300-600 installed. Do this before spring rains — you don't want to find out it's dead during a storm." },
        { type: "tip", text: "Ask about a battery backup sump pump ($200-400 extra). It kicks in during power outages, which is exactly when you need it most — during big storms." },
      ],
      chips: [
        { label: "I'll call a plumber", next: "celebration" },
      ],
    },
    check_discharge: {
      messages: [
        { type: "system", text: "Great! Now check outside where the discharge pipe exits. Make sure:" },
        { type: "system", text: "💧 Water is flowing freely out the pipe\n💧 The pipe directs water away from the foundation (at least 4 feet)\n💧 The end isn't clogged with debris or ice" },
      ],
      chips: [
        { label: "All good", next: "celebration" },
      ],
    },
    celebration: {
      messages: [
        { type: "system", text: "Your sump pump is ready! 🎉 This 10-minute test can save you thousands in flood damage. Consider testing it every few months." },
        { type: "system", text: "I've saved this to your home profile. ✓" },
      ],
      chips: [
        { label: "What's next?", next: "complete" },
        { label: "Done for now", next: "complete" },
      ],
    },
    complete: {
      messages: [
        { type: "system", text: "Basement protected! 🏠💧" },
      ],
    },
  },
};

export const testSumpPumpDetail = {
  title: "Test Your Sump Pump",
  category: "Plumbing",
  difficulty: "Easy",
  estTime: "10 min",
  estCost: "Free",
  whyItMatters: "Pour a bucket of water into the sump pit. The pump should kick on and push the water out. If it doesn't, fix that before the next heavy rain.",
  whatYoullLearn: [
    "Where your sump pump is and how it works",
    "How to test it with a bucket of water",
    "What to do if it's not working",
  ],
};
