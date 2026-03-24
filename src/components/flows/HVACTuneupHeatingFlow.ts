import type { FlowDefinition } from "./TaskFlowEngine";

export const hvacTuneupHeatingFlow: FlowDefinition = {
  title: "Schedule Your HVAC Tune-Up (Heating)",
  initialStep: "opening",
  steps: {
    opening: {
      messages: [
        { type: "system", text: "A fall HVAC tune-up makes sure your furnace is safe and ready before cold weather hits. This is a pro job — your role is just to schedule it." },
        { type: "system", text: "Have you had your heating system serviced in the last 12 months?" },
      ],
      chips: [
        { label: "Yes, recently", next: "already_done" },
        { label: "No / not sure", next: "find_pro" },
      ],
    },
    already_done: {
      messages: [
        { type: "system", text: "Great — if it's been serviced within the last year, you're probably good. Just make sure to schedule the next one before next fall." },
        { type: "tip", text: "Many HVAC companies offer annual service plans that include both heating and cooling tune-ups for $150-250/year." },
      ],
      chips: [
        { label: "Good to know", next: "complete" },
      ],
    },
    find_pro: {
      messages: [
        { type: "system", text: "You'll want to find a licensed HVAC technician. Here's how:" },
        { type: "system", text: "1. Ask neighbors or friends for recommendations\n2. Search 'HVAC tune-up near me'\n3. Check if your home warranty covers an annual tune-up (many do!)" },
      ],
      chips: [
        { label: "What does a tune-up include?", next: "what_included" },
        { label: "How much does it cost?", next: "cost" },
      ],
    },
    what_included: {
      messages: [
        { type: "system", text: "A standard heating tune-up typically includes:" },
        { type: "system", text: "🔧 Inspect and clean the burner assembly\n🔧 Check the heat exchanger for cracks (carbon monoxide risk!)\n🔧 Test safety controls and thermostat\n🔧 Check gas connections\n🔧 Replace the filter if needed\n🔧 Measure airflow and efficiency" },
        { type: "tip", text: "The heat exchanger check is the most important part — a cracked heat exchanger can leak carbon monoxide." },
      ],
      chips: [
        { label: "How much does it cost?", next: "cost" },
        { label: "I'll schedule it", next: "scheduling_tips" },
      ],
    },
    cost: {
      messages: [
        { type: "system", text: "A standard heating tune-up runs $80-150. If you sign up for an annual service plan (heating + cooling), it's usually $150-250/year total." },
        { type: "tip", text: "Check your home warranty — many include one HVAC service call per year with just a $75 service fee." },
      ],
      chips: [
        { label: "I'll schedule it", next: "scheduling_tips" },
      ],
    },
    scheduling_tips: {
      messages: [
        { type: "system", text: "Book in September or early October if you can — HVAC companies get slammed once the first cold snap hits. Many offer early-bird discounts too." },
        { type: "system", text: "When the tech comes, ask them to show you how to change your filter and point out anything you should watch for." },
      ],
      chips: [
        { label: "Got it, I'll book it", next: "celebration" },
      ],
    },
    celebration: {
      messages: [
        { type: "system", text: "You're on it! 🎉 Scheduling this before winter is the kind of move that prevents expensive emergency calls in January." },
        { type: "system", text: "I've saved this to your home profile. ✓" },
      ],
      chips: [
        { label: "What's next?", next: "complete" },
        { label: "Done for now", next: "complete" },
      ],
    },
    complete: {
      messages: [
        { type: "system", text: "Stay warm this winter! 🏠" },
      ],
    },
  },
};

export const hvacTuneupHeatingDetail = {
  title: "Schedule Your HVAC Tune-Up (Heating)",
  category: "HVAC",
  difficulty: "N/A (Pro job)",
  estTime: "1 hr (tech visit)",
  estCost: "$80 – $150",
  whyItMatters: "Don't discover your furnace is broken when it's 15°F outside. A fall tune-up makes sure your heating is safe and ready.",
  whatYoullLearn: [
    "What a heating tune-up includes",
    "How to find a good HVAC technician",
    "When to schedule for the best pricing",
  ],
};
