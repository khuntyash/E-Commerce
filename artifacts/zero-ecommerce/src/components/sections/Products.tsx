import { motion } from "framer-motion";
import { Scissors, TrendingUp, ShieldAlert, RefreshCw, BarChart3, Zap, Package, Bot } from "lucide-react";
import analyticsImg from "@/assets/analytics-visual.png";
import fraudImg from "@/assets/fraud-shield.png";
import inventoryAiImg from "@/assets/inventory-ai-card.png";
import plAnalyticsImg from "@/assets/pl-analytics-card.png";
import labelCropperImg from "@/assets/label-cropper-card.png";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const tools = [
  { icon: ShieldAlert, title: "Suspicious Order Detection", desc: "AI-powered suspicious order alerts before you ship.", col: "", accent: "#EF4444" },
  { icon: RefreshCw, title: "Multi-Platform Sync", desc: "Amazon, Shopify, Meesho — one unified command center.", col: "md:col-span-2", accent: "#06B6D4" },
  { icon: Bot, title: "Seller Automation", desc: "Build no-code workflows that run your business on autopilot.", col: "", accent: "#F59E0B" },
];

export default function Products() {
  return (
    <section className="py-28 bg-brand-gray w-full" id="products">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4" style={{ letterSpacing: "-0.03em" }}>
            Everything You Need<br />to Sell <span className="gradient-text">Smarter</span>
          </h2>
          <p className="text-muted-foreground text-lg">One platform. Every tool. Zero friction.</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {tools.map((tool) => (
            <motion.div
              key={tool.title}
              variants={item}
              className={`group bg-white rounded-3xl p-7 border border-border/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer ${tool.col}`}
              style={{ willChange: "transform" }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: `${tool.accent}15` }}
              >
                <tool.icon className="w-5 h-5" style={{ color: tool.accent }} />
              </div>
              <h3 className="text-lg font-bold mb-2">{tool.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{tool.desc}</p>
            </motion.div>
          ))}

          <motion.div
            variants={item}
            className="group bg-white rounded-3xl border border-border/60 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 md:col-span-2"
            style={{ willChange: "transform" }}
          >
            <img src={labelCropperImg} alt="Smart Label Cropper" className="w-full h-56 object-cover object-center" />
            <div className="p-7">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#3B82F615" }}>
                <Scissors className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <h3 className="text-lg font-bold mb-2">Smart Label Cropper</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Auto-crop, resize, and format shipping labels for any printer in milliseconds — zero manual effort.</p>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="group bg-white rounded-3xl border border-border/60 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            style={{ willChange: "transform" }}
          >
            <img src={plAnalyticsImg} alt="P&L Analytics" className="w-full h-48 object-cover object-center" />
            <div className="p-7">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#8B5CF615" }}>
                <TrendingUp className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <h3 className="text-lg font-bold mb-2">P&L Analytics</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Real-time profit tracking per product, channel, and SKU — know exactly what's making money.</p>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="group bg-white rounded-3xl border border-border/60 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            style={{ willChange: "transform" }}
          >
            <img src={inventoryAiImg} alt="Inventory AI" className="w-full h-48 object-cover object-center" />
            <div className="p-7">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#10B98115" }}>
                <Package className="w-5 h-5 text-[#10B981]" />
              </div>
              <h3 className="text-lg font-bold mb-2">Inventory AI</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Predictive reorder alerts and stock velocity tracking so you never miss a sale.</p>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="group bg-white rounded-3xl border border-border/60 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            style={{ willChange: "transform" }}
          >
            <img src={analyticsImg} alt="Analytics Visualization" className="w-full h-48 object-cover" />
            <div className="p-7">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#8B5CF615" }}>
                <BarChart3 className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <h3 className="text-lg font-bold mb-2">AI Revenue Intelligence</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Neural pattern detection surfaces hidden profit opportunities across all your channels.</p>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="group bg-white rounded-3xl border border-border/60 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            style={{ willChange: "transform" }}
          >
            <img src={fraudImg} alt="Fraud Protection" className="w-full h-48 object-cover object-top" />
            <div className="p-7">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ background: "#EF444415" }}>
                <Zap className="w-5 h-5 text-[#EF4444]" />
              </div>
              <h3 className="text-lg font-bold mb-2">Suspicious Order Shield</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Block serial returners and bad actors before they cost you money.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
