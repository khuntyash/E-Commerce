import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loading"
          className="fixed inset-0 z-[9999] bg-[#0F172A] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center gap-3"
          >
            <motion.div
              className="text-white text-6xl font-black tracking-tight"
              initial={{ letterSpacing: "0.3em", opacity: 0 }}
              animate={{ letterSpacing: "-0.02em", opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Zero
            </motion.div>
            <motion.div
              className="h-0.5 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
