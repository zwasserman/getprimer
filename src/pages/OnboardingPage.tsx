import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { question: "What's your name?", placeholder: "First name", type: "text" },
  { question: "What's your email?", placeholder: "email@example.com", type: "email" },
  { question: "Verify your code", placeholder: "000000", type: "text" },
  { question: "What's your address?", placeholder: "1234 Main St, City, State", type: "text" },
];

const OnboardingPage = () => {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(["", "", "", ""]);
  const navigate = useNavigate();

  const current = steps[step];
  const canContinue = values[step].trim().length > 0;

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigate("/");
    }
  };

  const handleChange = (val: string) => {
    setValues((prev) => {
      const next = [...prev];
      next[step] = val;
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col px-6 pt-24 pb-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="flex-1 flex flex-col"
        >
          <h1 className="text-display text-foreground mb-12">{current.question}</h1>

          <input
            type={current.type}
            value={values[step]}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={current.placeholder}
            autoFocus
            className="text-h1 bg-transparent border-0 border-b-2 border-border focus:border-primary outline-none pb-3 text-foreground placeholder:text-muted-foreground/40 transition-colors w-full"
            onKeyDown={(e) => e.key === "Enter" && canContinue && next()}
          />
        </motion.div>
      </AnimatePresence>

      <motion.button
        onClick={next}
        disabled={!canContinue}
        className={`w-full h-14 rounded-full text-base font-semibold transition-all ${
          canContinue
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
        whileTap={canContinue ? { scale: 0.98 } : {}}
      >
        {step === steps.length - 1 ? "Get Started" : "Continue"}
      </motion.button>
    </div>
  );
};

export default OnboardingPage;
