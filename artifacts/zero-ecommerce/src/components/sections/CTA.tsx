import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";

export default function CTA() {
  return (
    <motion.section 
      className="relative py-32 bg-brand-black text-white overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-brand-blue/30 rounded-full blur-[120px] -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-brand-purple/30 rounded-full blur-[100px] -translate-y-1/2"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Build Smarter.<br />Scale Faster.<br />Sell Better.
        </h2>
        <p className="text-lg text-gray-300 max-w-xl mb-10">
          Join 50,000+ sellers already using Zero to run their e-commerce operations.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <MagneticButton className="bg-white text-brand-black rounded-full hover:bg-gray-100 px-8 py-4 text-lg">
            Start Free Trial
          </MagneticButton>
          <button className="px-8 py-4 rounded-full border border-white/20 hover:bg-white/10 transition-colors font-medium text-lg">
            Talk to Sales
          </button>
        </div>
      </div>
    </motion.section>
  );
}
