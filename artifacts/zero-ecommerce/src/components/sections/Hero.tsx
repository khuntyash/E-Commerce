import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import { Play } from "lucide-react";
import AmbientBackground from "@/components/three/AmbientBackground";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20 pb-20">
      <div className="absolute inset-0 z-0 aurora-bg opacity-30"></div>
      <AmbientBackground />
      
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-blue/30 bg-brand-blue/5 text-brand-blue text-sm font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse-glow"></span>
          Now with AI-powered Insights
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-[80px] font-extrabold tracking-tight text-foreground leading-[1.1] max-w-4xl mb-6"
        >
          Powering the Future<br />of E-Commerce Sellers
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
        >
          AI-powered tools for smarter operations, automation, analytics, and growth across every marketplace.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <MagneticButton className="bg-brand-blue text-white rounded-full hover:bg-brand-blue/90 w-full sm:w-auto" data-testid="button-hero-start">
            Start Free Trial
          </MagneticButton>
          <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border bg-white text-foreground hover:bg-gray-50 transition-colors w-full sm:w-auto font-medium" data-testid="button-hero-demo">
            <Play className="w-4 h-4" /> Watch Demo
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center gap-4 text-sm text-muted-foreground"
        >
          <p>Trusted by sellers on</p>
          <div className="flex flex-wrap items-center justify-center gap-4 opacity-70">
            {["Amazon", "Flipkart", "Meesho", "Shopify", "Myntra"].map((p) => (
              <span key={p} className="px-4 py-1.5 rounded-full border border-border bg-white/80 text-sm font-semibold text-foreground/70 shadow-sm">
                {p}
              </span>
            ))}
          </div>
        </motion.div>
        
        {/* Simple Mockup representation for speed */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 w-full max-w-5xl aspect-video glass rounded-2xl border border-white/40 shadow-2xl p-4 overflow-hidden relative animate-float flex flex-col"
        >
          <div className="w-full h-12 border-b border-border/50 flex items-center px-4 mb-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="mx-auto bg-gray-100 rounded-md px-4 py-1 text-xs text-gray-500 font-mono">zero-dashboard.app</div>
          </div>
          <div className="flex-1 w-full bg-gray-50/50 rounded-xl flex gap-4 p-4">
             <div className="w-1/4 h-full flex flex-col gap-4">
                <div className="h-24 bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
                  <span className="text-xs text-gray-500 uppercase">Revenue</span>
                  <span className="text-2xl font-bold">₹12.4L</span>
                </div>
                <div className="h-24 bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
                  <span className="text-xs text-gray-500 uppercase">Orders Today</span>
                  <span className="text-2xl font-bold">2,847</span>
                </div>
                <div className="h-24 bg-red-50 rounded-lg shadow-sm border border-red-100 p-4 flex flex-col justify-between text-red-700">
                  <span className="text-xs uppercase">Fraud Alerts</span>
                  <span className="text-2xl font-bold">3 flagged</span>
                </div>
             </div>
             <div className="flex-1 h-full bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col">
                <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
                <div className="flex-1 w-full flex items-end gap-2 pb-4">
                   {[40, 60, 45, 80, 50, 90, 70].map((h, i) => (
                     <div key={i} className="flex-1 bg-brand-blue/20 rounded-t-sm" style={{ height: `${h}%` }}>
                       <div className="w-full bg-brand-blue rounded-t-sm" style={{ height: '10%' }}></div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
