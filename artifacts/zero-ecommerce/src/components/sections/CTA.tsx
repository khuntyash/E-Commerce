import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative py-32 bg-brand-black text-white overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, #3B82F6 0%, transparent 65%)",
            filter: "blur(40px)",
            willChange: "transform",
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #8B5CF6 0%, transparent 65%)",
            filter: "blur(40px)",
            willChange: "transform",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[1px]"
          style={{
            boxShadow: "0 0 400px 200px rgba(6,182,212,0.08)",
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-white/70 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4 text-[#06B6D4]" />
          50,000+ sellers scaling with Zero
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.05]"
          style={{ letterSpacing: "-0.04em" }}
        >
          Build Smarter.<br />
          <span style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Scale Faster.
          </span>
          <br />Sell Better.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg text-white/60 max-w-xl mb-12 leading-relaxed"
        >
          Join thousands of top sellers who've automated their operations and unlocked their next level of growth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <MagneticButton
            className="rounded-full font-bold px-8 py-4 text-base text-[#0F172A] flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, #ffffff, #f0f4ff)" }}
          >
            Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>
          <button className="px-8 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-200 font-semibold text-base backdrop-blur-sm">
            Talk to Sales
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 text-white/30 text-sm"
        >
          No credit card required · Free 14-day trial · Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}
