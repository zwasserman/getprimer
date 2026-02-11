import { motion } from "framer-motion";
import { Wrench } from "lucide-react";

const ProsPage = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center min-h-screen px-4 pb-32"
  >
    <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
      <Wrench size={32} className="text-secondary" />
    </div>
    <h1 className="text-h1 text-foreground text-center mb-3">Find Trusted Pros</h1>
    <p className="text-body text-muted-foreground text-center max-w-[280px]">
      Coming soon — we'll connect you with vetted professionals in your area.
    </p>
  </motion.div>
);

export default ProsPage;
