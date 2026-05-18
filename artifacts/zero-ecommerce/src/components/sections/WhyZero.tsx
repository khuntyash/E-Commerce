import { motion } from "framer-motion";
import { Clock, Workflow, DollarSign, ShieldCheck, AlertTriangle, TrendingUp } from "lucide-react";
import inventoryImg from "@/assets/inventory-feature.png";

const benefits = [
  { icon: Clock, title: "Save 10+ Hours Weekly", desc: "Eliminate manual data entry, label printing, and report generation.", accent: "#3B82F6" },
  { icon: Workflow, title: "Full Workflow Automation", desc: "From order received to label printed — zero manual steps.", accent: "#8B5CF6" },
  { icon: DollarSign, title: "Maximize Profit Margins", desc: "Real-time P&L visibility across every product and channel.", accent: "#10B981" },
  { icon: ShieldCheck, title: "Detect Suspicious Orders", desc: "AI flags suspicious orders before they cost you money.", accent: "#EF4444" },
  { icon: AlertTriangle, title: "Never Stockout Again", desc: "Smart reorder alerts based on sales velocity and trends.", accent: "#F59E0B" },
  { icon: TrendingUp, title: "Scale Without Limits", desc: "Infrastructure built for 100 to 10 million orders per month.", accent: "#06B6D4" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };

export default function WhyZero() {
  return (
    <section className="py-28 bg-white overflow-hidden" id="solutions">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: "transform" }}
          >
            <p className="text-[#3B82F6] font-semibold text-sm uppercase tracking-widest mb-4">Why Zero?</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 leading-tight" style={{ letterSpacing: "-0.03em" }}>
              Built for Sellers<br />Who <span className="gradient-text">Mean Business</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              Every feature is designed to solve a real problem that costs you time, money, or sanity. No bloat, no fluff — just tools that work.
            </p>

            <div className="relative rounded-3xl overflow-hidden border border-border/60 shadow-2xl" style={{ boxShadow: "0 30px 60px -15px rgba(59,130,246,0.2)" }}>
              <div className="absolute inset-0 opacity-20" style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)" }} />
              <img src={inventoryImg} alt="AI Inventory Management" className="relative w-full h-auto" />
            </div>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {benefits.map((b) => (
              <motion.div
                key={b.title}
                variants={item}
                className="group p-5 rounded-2xl border border-border/60 hover:shadow-lg hover:-translate-y-0.5 hover:border-transparent transition-all duration-250 bg-white cursor-pointer"
                style={{ willChange: "transform" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: `${b.accent}15` }}>
                  <b.icon className="w-5 h-5" style={{ color: b.accent }} />
                </div>
                <h3 className="font-bold text-sm mb-1.5">{b.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
