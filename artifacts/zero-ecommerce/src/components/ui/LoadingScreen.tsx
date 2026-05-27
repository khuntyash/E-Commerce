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
            className="flex flex-col items-center gap-3 px-6"
          >
            <motion.div
              className="flex flex-col items-stretch gap-3 w-full max-w-xl"
              initial={{ letterSpacing: "0.1em", opacity: 0 }}
              animate={{ letterSpacing: "-0.02em", opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-center leading-snug">
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(105deg, #38BDF8 0%, #818CF8 28%, #C084FC 52%, #F472B6 72%, #22D3EE 100%)",
                  }}
                >
                  Zero{" "}
                </span>
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(105deg, #A5B4FC 0%, #E879F9 45%, #67E8F9 100%)",
                  }}
                >
                  E-Commerce{" "}
                </span>
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(105deg, #22D3EE 0%, #34D399 55%, #A3E635 100%)",
                  }}
                >
                  Solutions
                </span>
              </motion.div>
              <motion.div
                className="h-0.5 rounded-full origin-left bg-gradient-to-r from-[#38BDF8] via-[#A78BFA] via-[#F472B6] to-[#22D3EE]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
