import type { FlowDefinition } from "./TaskFlowEngine";

export const waterHeaterFlow: FlowDefinition = {
  title: "Check Your Water Heater Temperature",
  initialStep: "opening",
  steps: {
    opening: {
      messages: [
        { type: "system", text: "Let's check your water heater temperature. This is one of the quickest wins in home maintenance — 5 minutes and you could save money and prevent scalding." },
        { type: "system", text: "Most water heaters should be set to 120°F. Higher than that wastes energy and can scald. Lower than that risks bacteria growth." },
      ],
      chips: [
        { label: "Let's check it", next: "find_heater" },
      ],
    },
    find_heater: {
      messages: [
        { type: "system", text: "Head to your water heater. It's usually in the basement, garage, utility closet, or laundry room. You're looking for a tall cylindrical tank (about 5 feet tall) with pipes coming out the top." },
      ],
      chips: [
        { label: "Found it", next: "find_dial" },
        { label: "I have a tankless unit", next: "tankless" },
      ],
    },
    tankless: {
      messages: [
        { type: "system", text: "Tankless units usually have a digital display or control panel right on the front. Check what temperature it's set to." },
        { type: "tip", text: "Tankless units are more precise — if it says 120°F, you're probably good." },
      ],
      chips: [
        { label: "It says 120°F", next: "temp_good" },
        { label: "It's higher than 120", next: "temp_high" },
        { label: "It's lower than 120", next: "temp_low" },
      ],
    },
    find_dial: {
      messages: [
        { type: "system", text: "Look for the temperature dial. On gas water heaters, it's usually a knob near the bottom of the tank. On electric ones, there may be a dial behind a small panel on the side." },
        { type: "tip", text: "Gas heaters: look for a red or black knob near the gas valve at the bottom. Electric heaters: you may need a screwdriver to open a small access panel." },
      ],
      chips: [
        { label: "Found the dial", next: "check_temp" },
      ],
    },
    check_temp: {
      messages: [
        { type: "system", text: "What does the dial say? Some show actual temperatures, others just show labels like A-B-C or \"warm/hot/very hot.\"" },
      ],
      chips: [
        { label: "It's at 120°F or 'warm'", next: "temp_good" },
        { label: "It's higher — 130-140°F or 'hot'", next: "temp_high" },
        { label: "It's lower than 120°F", next: "temp_low" },
        { label: "Can't tell / no markings", next: "no_markings" },
      ],
    },
    no_markings: {
      messages: [
        { type: "system", text: "No worries — many dials just have vague labels. Here's a trick: run hot water at a faucet for 2 minutes, then hold a cooking thermometer under the stream." },
        { type: "system", text: "If it reads 120°F ± 5°, you're in good shape." },
      ],
      chips: [
        { label: "Reads about 120°F", next: "temp_good" },
        { label: "It's hotter than that", next: "temp_high" },
        { label: "It's cooler", next: "temp_low" },
      ],
    },
    temp_good: {
      messages: [
        { type: "system", text: "Perfect — 120°F is the sweet spot. Hot enough for comfortable showers and killing bacteria, not so hot it scalds or wastes energy." },
      ],
      chips: [
        { label: "Nice!", next: "celebration" },
      ],
    },
    temp_high: {
      messages: [
        { type: "system", text: "That's higher than recommended. Turn it down to 120°F — you'll save about 3-5% on water heating costs for every 10° you reduce." },
        { type: "tip", text: "At 140°F, water can cause a third-degree burn in just 5 seconds. At 120°F, it takes several minutes. Big safety difference, especially if you have kids." },
      ],
      chips: [
        { label: "Turned it down ✓", next: "celebration" },
        { label: "I'll adjust it later", next: "celebration" },
      ],
    },
    temp_low: {
      messages: [
        { type: "system", text: "Below 120°F can allow bacteria (like Legionella) to grow in the tank. Turn it up to 120°F for safety." },
      ],
      chips: [
        { label: "Turned it up ✓", next: "celebration" },
        { label: "I'll adjust it later", next: "celebration" },
      ],
    },
    celebration: {
      messages: [
        { type: "system", text: "Done! 🎉 Your water heater temperature is dialed in. One of those quick wins that saves money and keeps everyone safe." },
        { type: "system", text: "Saved to your home profile. ✓" },
      ],
      chips: [
        { label: "What's next?", next: "complete" },
        { label: "I'm done for now", next: "complete" },
      ],
    },
    complete: {
      messages: [
        { type: "system", text: "You're all set with this one. Quick and easy! 🏠" },
      ],
    },
  },
};

export const waterHeaterDetail = {
  title: "Check Your Water Heater Temperature",
  category: "Plumbing",
  difficulty: "Easy",
  estTime: "5 min",
  estCost: "Free",
  whyItMatters: "Most water heaters should be set to 120°F — hot enough for showers, not so hot it scalds. If it's higher, turn it down and save on energy.",
  whatYoullLearn: [
    "Where your water heater temperature dial is",
    "Whether it's set to the right temperature",
    "How to adjust it safely",
  ],
};
