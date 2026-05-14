import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { useState } from "react";

export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <motion.section 
      className="py-24 bg-white"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      id="pricing"
    >
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground mb-8">No hidden fees. Cancel anytime.</p>
          
          <div className="inline-flex items-center p-1 bg-gray-100 rounded-full border border-gray-200">
            <button 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${billing === 'monthly' ? 'bg-white shadow-sm text-foreground' : 'text-gray-500 hover:text-foreground'}`}
              onClick={() => setBilling('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${billing === 'annual' ? 'bg-white shadow-sm text-foreground' : 'text-gray-500 hover:text-foreground'}`}
              onClick={() => setBilling('annual')}
            >
              Annual <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Save 17%</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="border border-border rounded-3xl p-8 flex flex-col bg-white">
            <h3 className="text-xl font-bold mb-2">Starter</h3>
            <div className="mb-6 flex items-end">
              <AnimatePresence mode="wait">
                <motion.span 
                  key={billing}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-4xl font-extrabold"
                >
                  ₹{billing === 'monthly' ? '999' : '829'}
                </motion.span>
              </AnimatePresence>
              <span className="text-muted-foreground mb-1 ml-1">/mo</span>
            </div>
            <ul className="flex flex-col gap-4 mb-8 flex-1">
              {["Up to 500 orders/month", "2 marketplace integrations", "Smart Label Cropper", "Basic Analytics Dashboard", "Email support"].map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl border border-border font-medium hover:bg-gray-50 transition-colors">Start Free Trial</button>
          </div>
          
          {/* Growth */}
          <div className="border-2 border-brand-blue rounded-3xl p-8 flex flex-col bg-blue-50/30 relative scale-[1.02] shadow-xl z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
            <h3 className="text-xl font-bold mb-2">Growth</h3>
            <div className="mb-6 flex items-end">
              <AnimatePresence mode="wait">
                <motion.span 
                  key={billing}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-4xl font-extrabold"
                >
                  ₹{billing === 'monthly' ? '2,499' : '2,079'}
                </motion.span>
              </AnimatePresence>
              <span className="text-muted-foreground mb-1 ml-1">/mo</span>
            </div>
            <ul className="flex flex-col gap-4 mb-8 flex-1">
              {["Unlimited orders", "4 marketplace integrations", "All 8 tools included", "P&L Analytics", "Suspicious Buyer Detection", "Priority support"].map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="font-medium">{f}</span>
                </li>
              ))}
            </ul>
            <MagneticButton className="w-full rounded-xl bg-brand-blue text-white hover:bg-brand-blue/90">Start Free Trial</MagneticButton>
          </div>
          
          {/* Enterprise */}
          <div className="border border-border rounded-3xl p-8 flex flex-col bg-white">
            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">Custom</span>
            </div>
            <ul className="flex flex-col gap-4 mb-8 flex-1">
              {["Custom pricing", "All marketplaces", "Custom integrations", "Dedicated account manager", "SLA guarantee", "White-label options"].map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-xl border border-border font-medium hover:bg-gray-50 transition-colors">Talk to Sales</button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
