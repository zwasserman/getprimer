import type { FlowDefinition } from "./TaskFlowEngine";

export const hvacTuneupACFlow: FlowDefinition = {
  title: "Schedule Your HVAC Tune-Up (AC)",
  initialStep: "opening",
  steps: {
    opening: {
      messages: [
        { type: "system", text: "Getting your AC serviced in spring means you won't be sweating through a breakdown in July when every HVAC company has a 2-week wait." },
        { type: "system", text: "Has your cooling system been serviced in the last 12 months?" },
      ],
      chips: [
        { label: "Yes", next: "already_done" },
        { label: "No / not sure", next: "find_pro" },
      ],
    },
    already_done: {
      messages: [
        { type: "system", text: "Perfect. If it was recently serviced, you're set. Just make sure to schedule again next spring." },
        { type: "tip", text: "If you had your heating serviced in the fall with a service plan, your spring AC tune-up might already be included." },
      ],
      chips: [
        { label: "Good to know", next: "complete" },
      ],
    },
    find_pro: {
      messages: [
        { type: "system", text: "Same company that does your heating can usually do the AC. If you don't have one yet:" },
        { type: "system", text: "1. Ask neighbors for recommendations\n2. Search 'AC tune-up near me'\n3. Check if your home warranty covers it" },
      ],
      chips: [
        { label: "What does a tune-up include?", next: "what_included" },
        { label: "How much?", next: "cost" },
      ],
    },
    what_included: {
      messages: [
        { type: "system", text: "A spring AC tune-up typically covers:" },
        { type: "system", text: "❄️ Clean the condenser coils (the outdoor unit)\n❄️ Check refrigerant levels\n❄️ Test the thermostat and controls\n❄️ Inspect the condensate drain\n❄️ Check electrical connections\n❄️ Replace the filter" },
        { type: "tip", text: "While the tech is there, ask them to clear any debris around the outdoor unit. Keep 2 feet of clearance around it for proper airflow." },
      ],
      chips: [
        { label: "How much?", next: "cost" },
        { label: "I'll schedule it", next: "scheduling" },
      ],
    },
    cost: {
      messages: [
        { type: "system", text: "A standard AC tune-up is $80-150. Annual service plans (heating + cooling) run $150-250 total." },
        { type: "tip", text: "Many companies offer early-bird spring specials in March/April." },
      ],
      chips: [
        { label: "I'll schedule it", next: "scheduling" },
      ],
    },
    scheduling: {
      messages: [
        { type: "system", text: "Try to book in March or April — before the rush. While you wait for the appointment, make sure nothing is blocking the outdoor condenser unit (leaves, garden tools, etc.)." },
      ],
      chips: [
        { label: "Will do", next: "celebration" },
      ],
    },
    celebration: {
      messages: [
        { type: "system", text: "You're ahead of the game! 🎉 You'll be cool and comfortable while your neighbors are on a waiting list." },
        { type: "system", text: "I've saved this to your home profile. ✓" },
      ],
      chips: [
        { label: "What's next?", next: "complete" },
        { label: "Done for now", next: "complete" },
      ],
    },
    complete: {
      messages: [
        { type: "system", text: "Stay cool! ❄️🏠" },
      ],
    },
  },
};

export const hvacTuneupACDetail = {
  title: "Schedule Your HVAC Tune-Up (AC)",
  category: "HVAC",
  difficulty: "N/A (Pro job)",
  estTime: "1 hr (tech visit)",
  estCost: "$80 – $150",
  whyItMatters: "Schedule your AC tune-up before every HVAC company is booked. A spring checkup catches problems before you're sweating through a breakdown.",
  whatYoullLearn: [
    "What an AC tune-up includes",
    "How to find a good HVAC technician",
    "How to prep your outdoor unit for summer",
  ],
};
