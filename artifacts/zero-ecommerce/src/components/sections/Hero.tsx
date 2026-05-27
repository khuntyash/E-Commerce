import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import AmbientBackground from "@/components/three/AmbientBackground";
import heroDashboard from "@/assets/hero-dashboard.png";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-24 pb-16">
      <AmbientBackground />
      <div className="absolute inset-0 z-0 aurora-bg opacity-20" />

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">

        <motion.div {...fadeUp(0)} className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/5 text-[#3B82F6] text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#3B82F6]" style={{ animation: "pulse-glow 2s ease-in-out infinite" }} />
          Now with AI-powered Insights
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.div>

        <motion.h1
          {...fadeUp(0.08)}
          className="text-5xl md:text-7xl lg:text-[82px] font-black tracking-tight text-foreground leading-[1.05] max-w-4xl mb-6"
          style={{ letterSpacing: "-0.03em" }}
        >
          Powering the{" "}
          <span className="gradient-text">Future</span>
          <br />of E-Commerce Sellers
        </motion.h1>

        <motion.p {...fadeUp(0.14)} className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          AI-powered tools for smarter operations, analytics, and growth across every marketplace.
        </motion.p>

        <motion.div {...fadeUp(0.2)} className="flex flex-col items-center gap-3 mb-14 text-sm text-muted-foreground">
          <p className="font-medium">Trusted by sellers on</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {["Amazon", "Flipkart", "Meesho", "Shopify", "Myntra"].map((p) => (
              <span key={p} className="px-4 py-1.5 rounded-full border border-border bg-white/90 text-xs font-bold text-foreground/60 shadow-sm tracking-wide uppercase">
                {p}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl relative"
          style={{ willChange: "transform" }}
        >
          <div className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl" style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6, #06B6D4)" }} />
          <div className="relative glass rounded-2xl border border-white/50 shadow-2xl overflow-hidden" style={{ boxShadow: "0 40px 80px -20px rgba(59,130,246,0.25), 0 0 0 1px rgba(255,255,255,0.6)" }}>
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/40 bg-white/60 backdrop-blur-sm">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="mx-auto bg-gray-100/80 rounded-md px-5 py-1 text-xs text-gray-500 font-mono">
                app.zeroecommerce.ai
              </div>
            </div>
            <img
              src={heroDashboard}
              alt="Zero AI Dashboard"
              className="w-full h-auto block"
              style={{ aspectRatio: "16/9", objectFit: "cover" }}
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
