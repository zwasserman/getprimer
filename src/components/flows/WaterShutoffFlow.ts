import type { FlowDefinition } from "./TaskFlowEngine";

export const waterShutoffFlow: FlowDefinition = {
  title: "Find Your Water Shut-Off Valve",
  initialStep: "opening",
  steps: {
    opening: {
      messages: [
        { type: "system", text: "Let's find your main water shut-off valve. If a pipe ever bursts, you'll need to shut off the water fast — and you don't want to be searching for it while your basement floods." },
        { type: "system", text: "Most homes have two shut-off points: one inside and one at the street. We'll start with the one inside." },
      ],
      chips: [
        { label: "Let's find it", next: "check_basement" },
      ],
    },
    check_basement: {
      messages: [
        { type: "system", text: "The main shut-off is almost always in the basement or crawl space, near where the water line enters your house from the street." },
        { type: "system", text: "Head down there and look along the wall that faces the street. You're looking for a pipe coming through the wall with a valve on it." },
        { type: "tip", text: "It's usually a round wheel handle (gate valve) or a lever handle (ball valve). Ball valves are more reliable." },
      ],
      chips: [
        { label: "Found it!", next: "test_valve" },
        { label: "Not in the basement", next: "alt_locations" },
      ],
    },
    alt_locations: {
      messages: [
        { type: "system", text: "No worries — some homes have it in different spots. Check these:" },
        { type: "system", text: "• Utility closet or mechanical room\n• Near the water heater\n• Under a kitchen or bathroom sink (less common for the main valve)\n• In a garage or near the foundation wall" },
      ],
      chips: [
        { label: "Found it!", next: "test_valve" },
        { label: "Still can't find it", next: "cant_find" },
      ],
    },
    cant_find: {
      messages: [
        { type: "system", text: "That's OK — some houses have unusual setups. There should also be a shut-off at the street (usually a metal cover in the ground near the curb)." },
        { type: "tip", text: "Consider asking a plumber to help you locate it during their next visit. It's a quick thing they can point out." },
      ],
      chips: [
        { label: "Good to know", next: "celebration" },
      ],
    },
    test_valve: {
      messages: [
        { type: "system", text: "Great find! Now let's make sure it works. Gently try turning it — but don't force it if it's stuck." },
        { type: "system", text: "For a lever handle: turn it 90° so it's perpendicular to the pipe (that's off). Turn it back parallel to turn it on." },
        { type: "system", text: "For a wheel handle: turn it clockwise to close (off), counter-clockwise to open (on)." },
      ],
      chips: [
        { label: "It turns fine", next: "label_it" },
        { label: "It's stuck or hard to turn", next: "stuck_valve" },
      ],
    },
    stuck_valve: {
      messages: [
        { type: "system", text: "Don't force it — old gate valves can corrode and break if you push too hard." },
        { type: "tip", text: "A plumber can replace a stuck valve with a modern ball valve for $150-300. Worth doing — a valve you can't turn is the same as no valve at all." },
      ],
      chips: [
        { label: "I'll add that to my list", next: "label_it" },
      ],
    },
    label_it: {
      messages: [
        { type: "system", text: "One last thing — grab a piece of tape or a tag and label it \"MAIN WATER SHUT-OFF\" so anyone in your house can find it in an emergency." },
      ],
      chips: [
        { label: "Labeled it ✓", next: "celebration" },
        { label: "I'll do it later", next: "celebration" },
      ],
    },
    celebration: {
      messages: [
        { type: "system", text: "Nice work! 🎉 You now know where your main water shut-off is. That knowledge alone could save you thousands in water damage someday." },
        { type: "tip", text: "Make sure everyone in your household knows where it is too. It takes 30 seconds to show them." },
        { type: "system", text: "I've saved this to your home profile. ✓" },
      ],
      chips: [
        { label: "What's next?", next: "complete" },
        { label: "I'm done for now", next: "complete" },
      ],
    },
    complete: {
      messages: [
        { type: "system", text: "You're all set with this one. Great job taking care of your home! 🏠" },
      ],
    },
  },
};

export const waterShutoffDetail = {
  title: "Find Your Water Shut-Off Valve",
  category: "Plumbing",
  difficulty: "Easy",
  estTime: "15 min",
  estCost: "Free",
  whyItMatters: "If a pipe ever bursts, you need to know where to shut off the water — fast. Finding it now means you won't be scrambling later. A burst pipe can cause $5,000+ in damage in just a few hours.",
  whatYoullLearn: [
    "Where your main water shut-off valve is",
    "What type of valve you have",
    "How to operate it in an emergency",
  ],
};
